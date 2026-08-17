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

/** Formats disponibles. Le ratio est fixé ici (et pas via `className`) parce que
 *  `cn` concatène sans arbitrer : deux `aspect-*` sur le même élément se
 *  marcheraient dessus selon l'ordre de génération de Tailwind. */
const RATIOS = {
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]",
} as const;

/**
 * Couverture de projet. Si `cover` (capture) est fourni, on l'affiche ; sinon on
 * génère une composition abstraite déterministe dérivée du slug, dans la palette
 * de marque (tokens), pour garder un set cohérent en attendant les vrais visuels.
 */
export function ProjectCover({
  project,
  className,
  imageClassName,
  sizes = "256px",
  ratio = "4/3",
  priority = false,
  alt = "",
}: {
  project: CoverData;
  className?: string;
  /** Classes portées par l'image elle-même (zoom, parallax…). */
  imageClassName?: string;
  /** Largeurs candidates transmises à next/image (le cover n'est pas toujours
   *  une vignette : la fiche projet l'affiche pleine largeur). */
  sizes?: string;
  ratio?: keyof typeof RATIOS;
  priority?: boolean;
  /** Vide par défaut : à côté du titre du projet, la vignette est décorative.
   *  À renseigner quand l'image porte l'information (grande couverture). */
  alt?: string;
}) {
  const h = hashString(project.slug);
  const angle = 90 + (h % 8) * 22.5;
  const blobLeft = 16 + (h % 5) * 13;
  const blobTop = 8 + ((h >> 3) % 5) * 13;
  const short = project.number.slice(-2);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border bg-surface",
        RATIOS[ratio],
        className,
      )}
    >
      {project.cover ? (
        <Image
          src={project.cover}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
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
          <span className="absolute left-4 top-3 font-mono text-label uppercase tracking-[0.18em] text-foreground">
            {project.year}
          </span>
          <span className="absolute bottom-3 left-4 right-4 font-display text-sub leading-tight tracking-tight text-foreground">
            {project.title}
          </span>
        </>
      )}
    </div>
  );
}
