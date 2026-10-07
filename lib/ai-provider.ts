type Message = { role: "system" | "user" | "assistant"; content: string };

export async function aiCompletion(messages: Message[], json = false) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // The router only selects free models, preventing accidental paid-model use.
      model: process.env.OPENROUTER_MODEL || "openrouter/free",
      messages,
      max_completion_tokens: 1400,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) throw new Error("AI_REQUEST_FAILED");
  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("AI_EMPTY_RESPONSE");
  return text.trim();
}

export function aiErrorResponse(error: unknown) {
  if (error instanceof Error && error.message === "AI_NOT_CONFIGURED") {
    return Response.json({ message: "AI tools are ready, but the owner still needs to add OPENROUTER_API_KEY to the server environment." }, { status: 503 });
  }
  return Response.json({ message: "The AI provider could not answer right now. Please try again in a moment." }, { status: 502 });
}
