"use client";

import React from "react";
import { GitBranch, GitMerge, ShieldAlert, RotateCcw, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

interface GitPresetsProps {
  currentPreset: string;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
}

export const GitPresets: React.FC<GitPresetsProps> = ({
  currentPreset,
  onSelectPreset,
  onReset,
}) => {
  const presets = [
    {
      id: "initial",
      title: "Dépôt Standard",
      desc: "Branche main avec 3 commits linéaires et fichiers prêts à indexer.",
      icon: GitBranch,
      color: "text-cyan-400",
    },
    {
      id: "divergent",
      title: "Branches Divergentes",
      desc: "main et feature/oauth ont divergé. Testez 'git merge' ou 'git rebase' !",
      icon: GitMerge,
      color: "text-amber-400",
    },
    {
      id: "gitflow",
      title: "Scénario Git Flow",
      desc: "main, develop, feature/cart et hotfix/security en parallèle.",
      icon: Compass,
      color: "text-emerald-400",
    },
    {
      id: "detached",
      title: "Piège Detached HEAD",
      desc: "HEAD pointe sur un commit orphelin. Entraînez-vous à l'ancrer.",
      icon: ShieldAlert,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0B0D14]/90 p-4 backdrop-blur-xl shadow-subtle-card">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800">
        <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
          Scénarios Prédéfinis en 1 Clic
        </span>
        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
          title="Réinitialiser l'état actuel"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = currentPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p.id)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all relative",
                isSelected
                  ? "bg-zinc-850/90 border-amber-500/50 shadow-gold-glow/20"
                  : "bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/80 hover:border-zinc-700"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("w-4 h-4", p.color)} />
                <span className="text-xs font-bold text-zinc-100">{p.title}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">{p.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
