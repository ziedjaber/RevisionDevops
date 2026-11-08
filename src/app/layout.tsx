import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevOps & Git Mastery Lab | shadcn/ui + Kibo UI + Gitgraph.js",
  description:
    "Interactive Git commit graph simulator powered by Gitgraph.js (@gitgraph/core), Kibo UI and shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
