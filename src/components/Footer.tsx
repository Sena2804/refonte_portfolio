import Link from "next/link";

const navLinks = [
  { href: "/projets", label: "Projets" },
  { href: "/parcours", label: "Parcours" },
  { href: "/a-propos", label: "À propos" },
  { href: "/cv", label: "CV" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-[clamp(1rem,4vw,2.5rem)] py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-[clamp(1.75rem,3vw,2.25rem)] leading-tight tracking-tight">
              Prémicia S. E. Mensah
            </p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-foreground">
              Développeuse full-stack / Cotonou
            </p>
          </div>

          {/* `py-1` porte la zone cliquable à 28px : sous 24px, WCAG 2.2
              (2.5.8) considère la cible trop petite au doigt. Le `-my-1`
              compense pour que l'alignement visuel ne bouge pas. */}
          <nav
            aria-label="Pied de page"
            className="-my-1 flex flex-wrap gap-x-8 gap-y-1 text-sm"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center py-1 text-foreground transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse gap-4 border-t border-border pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground md:flex-row md:items-center md:justify-between">
          <p>© {year} — Tous droits réservés</p>
          <a
            href="#top"
            className="-my-1 inline-flex items-center gap-2 py-1 transition-colors duration-200 hover:text-foreground"
          >
            <span aria-hidden>↑</span> Retour en haut
          </a>
        </div>
      </div>
    </footer>
  );
}
