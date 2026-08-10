import {
  getChatConfig,
  streamChat,
  type ChatMessage,
} from "@/lib/chat/providers";
import { buildKnowledgeBase, persona } from "@/lib/knowledge";
import { describeAvailability, getAvailability } from "@/lib/availability";
import { clientKey, slidingWindow } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * System prompt ancré. Tout est statique sauf la disponibilité, pilotée depuis
 * /admin — la lecture est mise en cache par tag, donc le coût par requête est nul.
 */
async function buildSystemPrompt(): Promise<string> {
  const availability = await getAvailability();
  return [
    persona.voice,
    persona.scope,
    persona.honesty,
    persona.levels,
    persona.privacy,
    "",
    buildKnowledgeBase(describeAvailability(availability)),
  ].join("\n");
}

const limiter = slidingWindow({ max: 20, windowMs: 10 * 60 * 1000 });

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

  if (!limiter.take(clientKey(req.headers))) {
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

  const systemPrompt = await buildSystemPrompt();
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamChat(config, systemPrompt, messages)) {
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
