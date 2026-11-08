import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "DevOps & Git Mastery Lab | shadcn/ui · Magic UI · React Bits · Inspira UI · Cult UI · Gitgraph.js",
  description:
    "Plateforme d'entraînement interactif Git, DevOps & GitLab CI propulsée par shadcn/ui, Magic UI, React Bits, tsParticles, Inspira UI, Cult UI, AutoAnimate et Gitgraph.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`dark ${fontSans.variable} ${fontMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
