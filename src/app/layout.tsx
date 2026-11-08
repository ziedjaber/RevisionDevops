import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevOps & Git Mastery Lab | Plateformes Collaboratives ISIMS",
  description:
    "Plateforme d'apprentissage et simulateur interactif complet pour le cours Plateformes Collaboratives - DevOps & Gestion de version Git (ISIMS). Graphe de commits en temps réel, exercices pratiques, pipelines GitLab CI et conteneurs Docker.",
  keywords: [
    "DevOps",
    "Git",
    "ISIMS",
    "GitLab CI",
    "Docker",
    "Docker Compose",
    "Microservices",
    "Fast-forward",
    "Rebase",
    "3-way merge",
    "CAMS",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="font-sans antialiased text-slate-100 min-h-screen flex flex-col bg-[#0b0f17]">
        {children}
      </body>
    </html>
  );
}
