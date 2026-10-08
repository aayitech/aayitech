type Message = { role: "system" | "user" | "assistant"; content: string };

export async function aiCompletion(messages: Message[], json = false) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("AI_NOT_CONFIGURED");

  const model = process.env.OPENROUTER_MODEL || "openrouter/free";

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      // The router only selects free models, preventing accidental paid-model use.
      model,
      messages,
      max_completion_tokens: 1400,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let providerCode: string | undefined;
    let providerMessage = responseText;
    try {
      const payload = JSON.parse(responseText);
      providerCode = typeof payload?.error?.code === "string" ? payload.error.code : undefined;
      providerMessage = typeof payload?.error?.message === "string" ? payload.error.message : responseText;
    } catch {
      // Keep the provider's non-JSON response available for diagnosis too.
    }
    console.error("[ai:openrouter] provider request failed", {
      status: response.status,
      statusText: response.statusText,
      providerCode,
      providerMessage: providerMessage.replace(/\b(sk-or-v1-|Bearer\s+)[^\s"']+/gi, "[redacted]").slice(0, 500),
      model,
    });
    throw new Error(`AI_PROVIDER_${response.status}`);
  }
  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) {
    console.error("[ai:openrouter] empty completion", {
      model,
      finishReason: payload?.choices?.[0]?.finish_reason,
      responseId: payload?.id,
    });
    throw new Error("AI_EMPTY_RESPONSE");
  }
  return text.trim();
}

export function aiErrorResponse(error: unknown) {
  if (error instanceof Error && error.message === "AI_NOT_CONFIGURED") {
    return Response.json({ message: "AI tools are ready, but the owner still needs to add OPENROUTER_API_KEY to the server environment." }, { status: 503 });
  }
  const message = error instanceof Error ? error.message : "Unknown AI provider error";
  console.error("[ai] request failed", { name: error instanceof Error ? error.name : "UnknownError", message });
  if (message === "AI_PROVIDER_429") {
    return Response.json({ message: "The free AI request limit has been reached. Please wait a little and try again." }, { status: 429 });
  }
  return Response.json({ message: "The AI provider could not answer right now. Please try again in a moment." }, { status: 502 });
}
