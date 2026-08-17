import type { Metadata, Viewport } from "next";
import { Newsreader, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider, ThemeScript } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/ui";
import { AskMe } from "@/components/ai/AskMe";
import { getChatConfig } from "@/lib/chat/providers";
import { SITE_URL } from "@/lib/site";

// Le widget suit la config réelle du fournisseur : pas de second interrupteur à
// tenir à la main. Une clé présente => le chat s'affiche ; pas de clé => rien,
// et jamais une bulle visible qui répondrait 503 au premier message.
const chatEnabled = getChatConfig() !== null;

// Corps de texte : un serif de texte sous des titres serif — parti pris
// éditorial assumé, choisi sur maquette comparative. Une seule variable CSS
// (`--font-body`) : changer de police se fait ici, et nulle part ailleurs.
const body = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Prémicia S. E. MENSAH — Développeuse Full-stack",
    template: "%s — Prémicia S. E. MENSAH",
  },
  description:
    "Portfolio de Prémicia MENSAH, développeuse full-stack React, Node.js et Python, basée au Bénin.",
  openGraph: {
    title: "Prémicia S. E. MENSAH — Développeuse Full-stack",
    description:
      "Portfolio de Prémicia MENSAH, développeuse full-stack React, Node.js et Python.",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#08090B" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${body.variable} ${mono.variable} ${display.variable}`}
    >
      <body id="top" className="bg-background text-foreground antialiased">
        <ThemeScript />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-small focus:text-foreground focus:shadow-lg"
          >
            Aller au contenu
          </a>
          <Navbar />
          <PageTransition>{children}</PageTransition>
          <Footer />
          {chatEnabled ? <AskMe /> : null}
        </ThemeProvider>
      </body>
    </html>
  );
}
