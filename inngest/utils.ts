/* eslint-disable @typescript-eslint/no-explicit-any */
export function lastAssistantTextMessageContent(result: any) {
  const output = result?.output;

  if (!Array.isArray(output)) return undefined;

  const idx = output.findLastIndex(
    (message) => message?.role === "assistant"
  );

  if (idx === -1) return undefined;

  const message = output[idx];

  if (!message?.content) return undefined;

  if (typeof message.content === "string") {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    return message.content.map((c: any) => c?.text ?? "").join("");
  }

  return undefined;
}
