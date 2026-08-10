import Image from "next/image";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/cn";

/** Champs minimaux nécessaires au rendu d'un cover. */
export type CoverData = Pick<Project, "slug" | "number" | "title" | "year"> & {
  cover?: string;
};

function hashString(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (Math.imul(h, 31) + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Couverture de projet. Si `cover` (capture) est fourni, on l'affiche ; sinon on
 * génère une composition abstraite déterministe dérivée du slug, dans la palette
 * de marque (tokens), pour garder un set cohérent en attendant les vrais visuels.
 */
export function ProjectCover({
  project,
  className,
}: {
  project: CoverData;
  className?: string;
}) {
  const h = hashString(project.slug);
  const angle = 90 + (h % 8) * 22.5;
  const blobLeft = 16 + (h % 5) * 13;
  const blobTop = 8 + ((h >> 3) % 5) * 13;
  const short = project.number.slice(-2);

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface",
        className,
      )}
    >
      {project.cover ? (
        <Image
          src={project.cover}
          alt=""
          fill
          sizes="256px"
          className="object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${angle}deg, color-mix(in oklab, var(--accent) 24%, var(--surface)), var(--surface) 72%)`,
            }}
          />
          <div
            className="absolute h-28 w-28 rounded-full [filter:blur(28px)]"
            style={{
              left: `${blobLeft}%`,
              top: `${blobTop}%`,
              background: "color-mix(in oklab, var(--accent) 38%, transparent)",
            }}
          />
          <span className="absolute -right-1 -top-7 font-display text-[6.5rem] leading-none text-accent/10">
            {short}
          </span>
          <span className="absolute left-4 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            {project.year}
          </span>
          <span className="absolute bottom-3 left-4 right-4 font-display text-xl leading-tight tracking-tight text-foreground">
            {project.title}
          </span>
        </>
      )}
    </div>
  );
}
