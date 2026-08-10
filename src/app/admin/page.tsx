import type { Metadata } from "next";
import { Heading, Page, Section, SectionLabel } from "@/components/ui";
import {
  getAvailability,
  isStorageConfigured,
  STATUS_LABELS,
} from "@/lib/availability";
import { isAdminConfigured } from "@/lib/admin-session";
import { AvailabilityForm, LoginForm } from "./AdminForms";
import { isAuthenticated, logout } from "./actions";

/**
 * Toujours rendue à la demande. Sans ça, la page se prérend au build selon les
 * variables d'environnement présentes à ce moment-là : elle resterait figée sur
 * « module en veille » si les secrets ne sont ajoutés qu'après le déploiement.
 * Effet de bord voulu : la lecture de la disponibilité ici ignore le cache et
 * affiche donc toujours la valeur réellement stockée.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  // Jamais indexé, jamais suivi — c'est une page privée, pas une page du site.
  robots: { index: false, follow: false, nocache: true },
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-8 max-w-xl rounded-xl border border-border bg-surface/50 px-5 py-4 text-sm leading-relaxed text-muted">
      {children}
    </p>
  );
}

export default async function AdminPage() {
  const configured = isAdminConfigured();
  const authenticated = configured && (await isAuthenticated());

  return (
    <Page>
      <Section size="lg">
        <SectionLabel number="000">Espace privé</SectionLabel>
        <Heading as="h1" variant="page" className="mt-6 max-w-[16ch]">
          Ma disponibilité.
        </Heading>

        {!configured ? (
          <Notice>
            Le module est en veille : définis <code>ADMIN_PASSWORD</code> et{" "}
            <code>ADMIN_SESSION_SECRET</code> dans les variables
            d&apos;environnement pour l&apos;activer. Tant qu&apos;elles sont
            absentes, aucune écriture n&apos;est possible et le site affiche la
            disponibilité par défaut.
          </Notice>
        ) : !authenticated ? (
          <>
            <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted">
              Cette page pilote ce qui s&apos;affiche dans le hero et ce que
              répond le chat sur mes disponibilités.
            </p>
            <LoginForm />
          </>
        ) : (
          <AuthenticatedPanel />
        )}
      </Section>
    </Page>
  );
}

async function AuthenticatedPanel() {
  const availability = await getAvailability();
  const persistent = isStorageConfigured();

  const updated = availability.updatedAt
    ? new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
        timeZone: "Africa/Porto-Novo",
      }).format(new Date(availability.updatedAt))
    : null;

  return (
    <>
      <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted">
        En ligne actuellement :{" "}
        <span className="text-foreground">
          {STATUS_LABELS[availability.status]}
        </span>
        {updated ? <> · modifié le {updated}</> : <> · valeur par défaut</>}
      </p>

      {!persistent ? (
        <Notice>
          Stockage non branché : les modifications restent en mémoire du serveur
          et disparaissent au redémarrage. Définis{" "}
          <code>UPSTASH_REDIS_REST_URL</code> et{" "}
          <code>UPSTASH_REDIS_REST_TOKEN</code> pour les rendre persistantes.
        </Notice>
      ) : null}

      <AvailabilityForm initial={availability} />

      <form action={logout} className="mt-14 border-t border-border pt-8">
        <button
          type="submit"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted underline-offset-4 transition-colors duration-200 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Se déconnecter
        </button>
      </form>
    </>
  );
}
