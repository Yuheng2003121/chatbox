import { AgentResult, TextMessage } from "@inngest/agent-kit";
import Sandbox from "e2b";
import { SANDBOX_TIMEOUT } from "./constant";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  await sandbox.setTimeout(SANDBOX_TIMEOUT);
  return sandbox;
}

export function lastAssistantMessageContent(result: AgentResult) {
  const lastAssistantMessageContent = result.output.findLastIndex(
    (message) => message.role === "assistant"
  );
  const message = result.output[lastAssistantMessageContent] as
    | TextMessage
    | undefined;
  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map(c => c.text).join("")
    : undefined;
}
