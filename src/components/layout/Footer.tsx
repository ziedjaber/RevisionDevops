import React from "react";
import { GitBranch, Heart, GraduationCap, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#07080D] py-10 mt-20 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold text-zinc-300">
                DevOps &amp; Git Mastery Lab &bull; ISIMS
              </div>
              <div className="text-[11px] text-zinc-500">
                Plateformes Collaboratives, CI/CD, Git &amp; Conteneurisation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              Basé sur le cours universitaire de Pr. Bassem BOUAZIZ
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} DevOps &amp; Git Mastery Lab. Conçu avec Next.js 14, TypeScript &amp; Tailwind CSS.
          </div>
          <div className="flex items-center gap-3">
            <span>8 Chapitres &bull; 218 Slides</span>
            <span>&bull;</span>
            <span>Simulateur Graphe de Commits SHA-1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
