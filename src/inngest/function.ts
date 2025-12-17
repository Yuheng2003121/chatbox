import { inngest } from "./client";
import {  createAgent, openai } from "@inngest/agent-kit";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    const codeAgent = createAgent({
      name: "CodeAgent",
      description: "summarizer",
      system: "You are a expert nextjs developer. You write readable code. You write simple nextjs & react snippets",
      model: openai({
        baseUrl: "https://api-inference.modelscope.cn/v1",
        model: "deepseek-ai/DeepSeek-V3.2",
        apiKey: process.env.OPENAI_API_KEY,
      }),
    });
    const { output } = await codeAgent.run(
      `Wripte the following snippet: ${event.data.value}`
    );
    
    return { output };
  }
);
