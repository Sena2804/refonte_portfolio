import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider, ThemeScript } from "@/components/ThemeProvider";
import { PageTransition } from "@/components/ui";
import { AskMe } from "@/components/ai/AskMe";

const chatEnabled = process.env.NEXT_PUBLIC_CHAT_ENABLED === "true";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
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
  metadataBase: new URL("https://premicia.dev"),
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
    { media: "(prefers-color-scheme: light)", color: "#F7F7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0F1F" },
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
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
    >
      <body id="top" className="bg-background text-foreground antialiased">
        <ThemeScript />
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:shadow-lg"
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
