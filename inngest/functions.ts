import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";
import { z } from "zod";
import { PROMPT } from "@/prompt";
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

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: gemini({ model: "gemini-2.5-flash" }),
      tools: [
        createTool({
          name: "terminal",
          description: "A terminal to run bash commands",
          parameters: z.object({
            command: z.string(),
          }),
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
          description: "Create or update a files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("createOrUpdateFiles", async () => {
              const sandbox = await Sandbox.connect(sandboxId);
              for (const file of files) {
                await sandbox.files.write(file.path, file.content);
              }
              return files;
            });
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read a files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
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
        onResponse: async ({ result }) => {
          return result;
        },
      },
    });

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async () => {
        return codeAgent;
      },
    });

    let result;

    try {
      result = await network.run(event.data.value);
    } catch (err: unknown) {
      const errObj =
        typeof err === "object" && err !== null
          ? (err as Record<string, unknown>)
          : null;
      const status = errObj?.["status"];
      const code = errObj?.["code"];

      if (
        status === "RESOURCE_EXHAUSTED" ||
        code === 429 ||
        String(err).includes("Quota")
      ) {
        return {
          url: null,
          title: "Quota Exceeded",
          files: null,
          summary:
            "Gemini API quota was exhausted. Please wait or upgrade the plan.",
        };
      }

      throw err;
    }

    const summary = lastAssistantTextMessageContent(result);
    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;
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
          content:
            result.state.data.summary || "Project generated successfully.",
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          fragments: {
            create: {
              sandboxUrl,
              title: "Untitled Project",
              files: result.state.data.files,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Untitled Project",
      files: result.state.data.files,
      summary,
    };
  }
);

export default codeAgentFunction;
