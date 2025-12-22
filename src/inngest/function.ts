import { inngest } from "./client";
import {
  createAgent,
  createNetwork,
  createState,
  createTool,
  Message,
  openai,
  Tool,
} from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantMessageContent } from "./utils";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/lib/prompt";
import { prisma } from "@/lib/prisma";
import { SANDBOX_TIMEOUT } from "./constant";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("vibe-nextjs-lyh");
      await sandbox.setTimeout(SANDBOX_TIMEOUT)
      return sandbox.sandboxId;
    });
    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];
        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages.reverse();
      }
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      }
    );

    const codeAgent = createAgent<AgentState>({
      name: "CodeAgent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        baseUrl: "https://api-inference.modelscope.cn/v1",
        model: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
        apiKey: process.env.OPENAI_API_KEY,
      }),
      tools: [
        createTool({
          name: "terminal",
          description: "use terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getSandbox(sandboxId);
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
                console.error(
                  `Command failed:${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`
                );
                return `Command failed:${error} \nstdout: ${buffers.stdout} \nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),

        createTool({
          name: "createOrUpdateFile",
          description: "create or update a file in the sandbox",
          parameters: z.object({
            files: z.array(z.object({ path: z.string(), content: z.string() })),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run("createOrUpdateFile", async () => {
              try {
                const updatedFiles = network.state.data.files || {};
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (error) {
                return `Error: ${error}`;
              }
            });
            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),

        createTool({
          name: "readFiles",
          description: "Read a file from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return `Error: ${error}`;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessage = lastAssistantMessageContent(result);
          if (lastAssistantMessage && network) {
            if (lastAssistantMessage.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessage;
            }
          }

          return result;
        },
      },
    });
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    // const { output } = await codeAgent.run(
    //   `Wripte the following snippet: ${event.data.value}`
    // );
    const result = await network.run(event.data.value, {state: state}); 

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        baseUrl: "https://api-inference.modelscope.cn/v1",
        model: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
        apiKey: process.env.OPENAI_API_KEY,
      }),
    })

      const responseGenerator = createAgent({
        name: "fragment-response-generator",
        description: "A response generator",
        system: RESPONSE_PROMPT,
        model: openai({
          baseUrl: "https://api-inference.modelscope.cn/v1",
          model: "Qwen/Qwen3-Coder-480B-A35B-Instruct",
          apiKey: process.env.OPENAI_API_KEY,
        }),
      });
      const {output: fragmentTitle} = await fragmentTitleGenerator.run(
        `Generate a title for the following code: ${result.state.data.summary}`
      );

      const {output: response} = await responseGenerator.run(
        `Generate a response for the following code: ${result.state.data.summary}`
      );

      const generateFragmentTitle = () => {
        if(fragmentTitle[0].type !== "text") {
          return "Fragment"
        }

        if(Array.isArray(fragmentTitle[0].content)) {
          return fragmentTitle[0].content.join("");
        } else {
          return fragmentTitle[0].content;
        }
      }

       const generateResponse = () => {
         if (response[0].type !== "text") {
           return "Here you go";
         }

         if (Array.isArray(response[0].content)) {
           return response[0].content.join("");
         } else {
           return response[0].content;
         }
       };


    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);

      return `http://${host}`;
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await prisma.message.create({
          data: {
            content: "Something went wrong. Please try again.",
            role: "ASSISTANT",
            type: "ERROR",
            projectId: event.data.projectId,
          },
        });
      }
      return await prisma.message.create({
        data: {
          content: generateResponse(),
          role: "ASSISTANT",
          type: "RESULT",
          projectId: event.data.projectId,
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: generateFragmentTitle(),
              files: result.state.data.files
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  }
);
