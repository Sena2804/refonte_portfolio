"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Quels sont tes projets backend ?",
  "Parle-moi de My Show Time",
  "Quelles technologies maîtrises-tu ?",
  "Es-tu disponible pour une mission ?",
];

/**
 * Chat « moi » : une version IA de Prémicia, ancrée sur sa base de connaissances.
 * Affiché uniquement si NEXT_PUBLIC_CHAT_ENABLED = "true" (gardé dans le layout).
 * Streaming token par token depuis /api/chat. Dégradation propre si désactivé.
 */
export function AskMe() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setNotice(null);

    const history: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        setMessages(history);
        setNotice(
          data?.message ??
            "Le chat est indisponible pour le moment. Écris-moi par e-mail.",
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch {
      setMessages(history);
      setNotice("Connexion interrompue. Réessaie dans un instant.");
    } finally {
      setStreaming(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Fermer le chat" : "Discuter avec l'IA de Prémicia"}
        aria-expanded={open}
        aria-controls="askme-panel"
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-border bg-accent px-5 text-background shadow-lg transition-transform duration-200 ease-[var(--ease-out-soft)] hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? (
          <X className="h-4 w-4" strokeWidth={2} />
        ) : (
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
        )}
        <span className="font-mono text-xs uppercase tracking-[0.16em]">
          {open ? "Fermer" : "Demandez-moi"}
        </span>
      </button>

      {open ? (
        <div
          id="askme-panel"
          role="dialog"
          aria-label="Chat avec l'IA de Prémicia"
          className="fixed bottom-20 right-5 z-40 flex h-[min(32rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl [animation:hero-line-in_300ms_var(--ease-out-soft)_both]"
        >
          <header className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ok" />
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-foreground">
              IA de Prémicia
            </p>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              version IA · pas toujours exacte
            </span>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
          >
            {messages.length === 0 ? (
              <p className="text-sm leading-relaxed text-muted">
                Bonjour 👋 Je suis la version IA de Prémicia. Pose-moi tes
                questions sur son parcours, ses projets ou sa disponibilité.
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "ml-auto bg-accent text-background"
                      : "bg-surface text-foreground",
                  )}
                >
                  {m.content ||
                    (streaming && i === messages.length - 1 ? "…" : "")}
                </div>
              ))
            )}

            {notice ? (
              <p className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-muted">
                {notice}
              </p>
            ) : null}
          </div>

          {messages.length === 0 ? (
            <div className="flex flex-wrap gap-2 px-4 pb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted transition-colors duration-200 hover:border-foreground hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Écris ton message…"
              aria-label="Votre message"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              aria-label="Envoyer"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-background transition-opacity duration-200 disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      ) : null}
    </>
  );
}
