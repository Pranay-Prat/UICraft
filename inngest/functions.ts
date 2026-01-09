import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
  createState,
} from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";
import { z } from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { lastAssistantTextMessageContent } from "./utils";
import { prisma } from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";

const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", retries: 1 },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("uicraft-build");
      return sandbox.sandboxId;
    });

    const state = createState({
      summary: "",
      files: {},
    });

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: gemini({ model: "gemini-2.5-flash" }),
      tools: [
        createTool({
          name: "terminal",
          description: "A terminal to run bash commands",
          parameters: z.object({ command: z.string() }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                return `Command failed: ${error}\n${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                const updatedFiles = network?.state?.data.files || {};
                const sandbox = await Sandbox.connect(sandboxId);

                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              }
            );

            if (network && typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
            return newFiles;
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({ files: z.array(z.string()) }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              const sandbox = await Sandbox.connect(sandboxId);
              const contents = [];
              for (const file of files) {
                const content = await sandbox.files.read(file);
                contents.push({ path: file, content });
              }
              return JSON.stringify(contents);
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const text = lastAssistantTextMessageContent(result);
          if (text && network) {
            if (text.includes("<task_summary>")) {
              network.state.data.summary = text;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        if (network.state.data.summary) {
          return undefined;
        }
        return codeAgent;
      },
    });

    let result;
    try {
      result = await network.run(event.data.value, { state });
    } catch (err: unknown) {
      const errObj =
        typeof err === "object" && err !== null
          ? (err as Record<string, unknown>)
          : null;
      if (
        errObj?.["status"] === "RESOURCE_EXHAUSTED" ||
        String(err).includes("Quota")
      ) {
        return {
          url: null,
          title: "Quota Exceeded",
          files: null,
          summary: "Quota exhausted.",
        };
      }
      throw err;
    }
    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generate  title for the fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generate a response for the fragment",
      system: RESPONSE_PROMPT,
      model: gemini({ model: "gemini-2.5-flash" }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary
    );
    const generateFragmentTitle = () => {
      if (fragmentTitleOutput[0].type !== "text") {
        return "Untitled";
      }
      if (Array.isArray(fragmentTitleOutput[0].content)) {
        return fragmentTitleOutput[0].content.map((c) => c).join("");
      } else {
        return fragmentTitleOutput[0].content;
      }
    };
    const generateResponse = () => {
      if (responseOutput[0].type !== "text") {
        return "Here you go";
      }
      if (Array.isArray(responseOutput[0].content)) {
        return responseOutput[0].content.map((c) => c).join("");
      } else {
        return responseOutput[0].content;
      }
    };
    const summary = result.state.data.summary;
    const files = result.state.data.files;
    const isError = !summary || Object.keys(files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content:
              "Something went wrong while generating the project. Please try again.",
            role: MessageRole.ASSISTANT,
            type: MessageType.ERROR,
          },
        });
      }

      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: generateResponse(),
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          fragments: {
            create: {
              sandboxUrl,
              title: generateFragmentTitle(),
              files: files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Untitled Project",
      files: files,
      summary: summary,
    };
  }
);

export default codeAgentFunction;
