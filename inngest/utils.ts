/* eslint-disable @typescript-eslint/no-explicit-any */
export function lastAssistantTextMessageContent(result: any) {
  const output = result?.output;
  if (!Array.isArray(output)) return null;

  for (let i = output.length - 1; i >= 0; i--) {
    const message = output[i];
    if (message?.role !== "assistant") continue;
    if (!message?.content) continue;

    if (typeof message.content === "string") {
      return message.content;
    }

    if (Array.isArray(message.content)) {
      return message.content
        .map((c: any) => c?.text)
        .filter(Boolean)
        .join("");
    }
  }

  return null;
}
