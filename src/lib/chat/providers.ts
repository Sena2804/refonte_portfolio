// Abstraction de fournisseur LLM pour le chat « moi ». Agnostique : Gemini ou
// Groq, choisi par variable d'env. Aucune dépendance — on parle aux APIs REST
// en streaming SSE via fetch. Module serveur uniquement (lit les clés d'env).

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatConfig = {
  provider: "gemini" | "groq";
  apiKey: string;
  model: string;
};

/**
 * Lit la configuration depuis l'environnement. Renvoie null si rien n'est
 * configuré → le chat reste désactivé proprement (pas de clé dans le repo).
 *   CHAT_PROVIDER = "gemini" | "groq"
 *   GEMINI_API_KEY / GROQ_API_KEY
 *   CHAT_MODEL (optionnel, sinon défaut par provider)
 */
export function getChatConfig(): ChatConfig | null {
  const provider = process.env.CHAT_PROVIDER;
  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    return {
      provider,
      apiKey: process.env.GEMINI_API_KEY,
      // Alias qui suit le modèle Flash courant. Les modèles datés
      // (gemini-2.0-flash, gemini-2.5-flash…) sont soit fermés aux nouveaux
      // comptes, soit à quota gratuit nul selon le projet Google.
      model: process.env.CHAT_MODEL || "gemini-flash-latest",
    };
  }
  if (provider === "groq" && process.env.GROQ_API_KEY) {
    return {
      provider,
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.CHAT_MODEL || "llama-3.1-8b-instant",
    };
  }
  return null;
}

/** Itère les lignes `data:` d'une réponse SSE. */
async function* sseData(res: Response): AsyncGenerator<string> {
  const reader = res.body?.getReader();
  if (!reader) return;
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (line.startsWith("data:")) yield line.slice(5).trim();
    }
  }
}

type GeminiChunk = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

async function* streamGemini(
  config: ChatConfig,
  system: string,
  messages: ChatMessage[],
): AsyncGenerator<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:streamGenerateContent?alt=sse&key=${config.apiKey}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  for await (const data of sseData(res)) {
    if (data === "[DONE]") break;
    try {
      const json = JSON.parse(data) as GeminiChunk;
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) yield text;
    } catch {
      // ignore les fragments JSON incomplets
    }
  }
}

type GroqChunk = { choices?: { delta?: { content?: string } }[] };

async function* streamGroq(
  config: ChatConfig,
  system: string,
  messages: ChatMessage[],
): AsyncGenerator<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      stream: true,
      temperature: 0.4,
      max_tokens: 800,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}`);
  for await (const data of sseData(res)) {
    if (data === "[DONE]") break;
    try {
      const json = JSON.parse(data) as GroqChunk;
      const text = json.choices?.[0]?.delta?.content;
      if (text) yield text;
    } catch {
      // ignore
    }
  }
}

/** Stream les deltas de texte de la réponse, quel que soit le provider. */
export function streamChat(
  config: ChatConfig,
  system: string,
  messages: ChatMessage[],
): AsyncGenerator<string> {
  return config.provider === "gemini"
    ? streamGemini(config, system, messages)
    : streamGroq(config, system, messages);
}
