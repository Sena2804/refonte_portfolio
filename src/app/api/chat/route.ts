import {
  getChatConfig,
  streamChat,
  type ChatMessage,
} from "@/lib/chat/providers";
import { buildKnowledgeBase, persona } from "@/lib/knowledge";

export const runtime = "nodejs";

// System prompt ancré, construit une fois (la base de connaissances est statique).
const SYSTEM_PROMPT = [
  persona.voice,
  persona.scope,
  persona.honesty,
  persona.privacy,
  "",
  buildKnowledgeBase(),
].join("\n");

// Rate-limit en mémoire, best-effort (par instance serverless).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 20;
const hits = new Map<string, number[]>();

function isAllowed(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > 20) {
    return null;
  }
  const out: ChatMessage[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0 || content.length > 2000) {
      return null;
    }
    out.push({ role, content });
  }
  if (out[out.length - 1].role !== "user") return null;
  return out;
}

export async function POST(req: Request) {
  const config = getChatConfig();
  if (!config) {
    return Response.json(
      {
        error: "chat_disabled",
        message:
          "Le chat n'est pas encore activé. Écris-moi par e-mail en attendant.",
      },
      { status: 503 },
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!isAllowed(ip)) {
    return Response.json(
      { error: "rate_limited", message: "Trop de messages, réessaie dans un moment." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const messages = parseMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamChat(config, SYSTEM_PROMPT, messages)) {
          controller.enqueue(encoder.encode(delta));
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            "\n\nDésolée, une erreur est survenue. Réessaie ou écris-moi par e-mail.",
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
