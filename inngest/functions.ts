import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter"

const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "agent/hello" },
  async ({ event, step }) => {
    const helloAgent = createAgent({
        name:"hello-agent",
        description:"An agent that says hello world",
        system:"You are a friendly agent that greets the world.",
        model:gemini({model:"gemini-2.5-flash"})
    })
    const sandboxId = await step.run("get-sandbox-id",async()=>{
        const sandbox = await Sandbox.create("uicraft-build")
        return sandbox.sandboxId
    })
    const sandboxUrl = await step.run("get-sandbox-url",async()=>{
        const sandbox = await Sandbox.connect(sandboxId)
        const host =sandbox.getHost(3000)
        return `http://${host}`
    })
    const {output} = await helloAgent.run("Say hello world!")
    return { message: output[0] }
  },
);

export default helloWorld;