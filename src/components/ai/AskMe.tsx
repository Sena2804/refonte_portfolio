"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ArrowUp } from "lucide-react";
import { cn } from "@/lib/cn";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Tes stages en entreprise ?",
  "Parle-moi de My Show Time",
  "Ta stack préférée ?",
  "Tu es dispo en ce moment ?",
];

/**
 * Chat « moi » : une version IA de Prémicia, ancrée sur sa base de connaissances.
 * Monté par le layout uniquement si un fournisseur LLM est configuré.
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
      {/* Le bouton s'efface quand le panneau s'ouvre : la fermeture vit dans
          l'en-tête, ce qui évite deux éléments flottants superposés. */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Discuter avec l'IA de Prémicia"
          aria-expanded={false}
          aria-controls="askme-panel"
          className="fixed bottom-5 right-5 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-border bg-accent px-5 text-background shadow-lg transition-transform duration-200 ease-[var(--ease-out-soft)] hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} />
          <span className="font-mono text-xs uppercase tracking-[0.16em]">
            Demandez-moi
          </span>
        </button>
      ) : null}

      {open ? (
        <div
          id="askme-panel"
          role="dialog"
          aria-label="Chat avec l'IA de Prémicia"
          className="fixed inset-x-3 bottom-3 z-40 flex h-[min(34rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl [animation:hero-line-in_300ms_var(--ease-out-soft)_both] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[27rem]"
        >
          <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <p className="font-display text-lg leading-none tracking-tight">
                Prémicia
              </p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Version IA de mon profil
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="-mr-1.5 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
          >
            {messages.length === 0 ? (
              <>
                <p className="text-[15px] leading-relaxed text-muted">
                  Bonjour 👋 Pose-moi ce que tu veux sur mon parcours, mes
                  projets ou mes disponibilités.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border px-3.5 py-2 text-left text-[13px] text-muted transition-colors duration-200 hover:border-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
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

          <div className="border-t border-border px-5 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={2000}
                placeholder="Écris ton message…"
                aria-label="Ton message"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                aria-label="Envoyer"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-background transition-opacity duration-200 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <ArrowUp className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
            {/* Mention d'honnêteté déplacée hors de l'en-tête, qui était chargé. */}
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              Réponses générées : je peux me tromper. Écris-moi pour confirmer.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
