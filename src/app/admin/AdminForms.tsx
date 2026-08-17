"use client";

import { useActionState, useId } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  MESSAGE_MAX,
  STATUS_LABELS,
  STATUS_ORDER,
  type Availability,
} from "@/lib/availability";
import { login, saveAvailability, type ActionState } from "./actions";

const EMPTY: ActionState = {};

const fieldClasses =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-body text-foreground transition-colors duration-200 placeholder:text-faint focus:border-accent focus:outline-none";

const labelClasses =
  "block font-mono text-label uppercase tracking-[0.18em] text-foreground";

function Feedback({ state }: { state: ActionState }) {
  if (!state.error && !state.success) return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "text-small",
        state.error ? "text-foreground" : "text-ok",
      )}
    >
      {state.error ?? state.success}
    </p>
  );
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, EMPTY);
  const id = useId();

  return (
    <form action={formAction} className="mt-10 max-w-sm space-y-5">
      <div className="space-y-2">
        <label htmlFor={id} className={labelClasses}>
          Mot de passe
        </label>
        <input
          id={id}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          className={fieldClasses}
        />
      </div>

      <Feedback state={state} />

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Vérification…" : "Entrer"}
      </Button>
    </form>
  );
}

export function AvailabilityForm({ initial }: { initial: Availability }) {
  const [state, formAction, pending] = useActionState(saveAvailability, EMPTY);
  const messageId = useId();
  const datesId = useId();

  return (
    <form action={formAction} className="mt-12 max-w-xl space-y-10">
      <fieldset className="space-y-3">
        <legend className={labelClasses}>Statut</legend>
        <div className="flex flex-wrap gap-3 pt-1">
          {STATUS_ORDER.map((status) => (
            <label
              key={status}
              className="group relative cursor-pointer rounded-full border border-border px-5 py-2.5 text-small transition-colors duration-200 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:checked]:text-accent has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-accent"
            >
              <input
                type="radio"
                name="status"
                value={status}
                defaultChecked={initial.status === status}
                className="sr-only"
              />
              {STATUS_LABELS[status]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor={messageId} className={labelClasses}>
          Phrase affichée
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={3}
          maxLength={MESSAGE_MAX}
          required
          defaultValue={initial.message}
          className={cn(fieldClasses, "resize-y leading-relaxed")}
        />
        <p className="text-label text-foreground">
          Visible dans le hero, et reprise telle quelle par le chat.{" "}
          {MESSAGE_MAX} caractères max.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={datesId} className={labelClasses}>
          Jours indisponibles
        </label>
        <textarea
          id={datesId}
          name="busyDates"
          rows={4}
          defaultValue={initial.busyDates.join("\n")}
          placeholder={"2026-08-15\n2026-08-16"}
          className={cn(fieldClasses, "resize-y font-mono text-small leading-relaxed")}
        />
        <p className="text-label text-foreground">
          Une date par ligne, au format AAAA-MM-JJ. Ces jours apparaissent
          barrés dans le calendrier du hero.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Enregistrement…" : "Enregistrer"}
        </Button>
        <Feedback state={state} />
      </div>
    </form>
  );
}
