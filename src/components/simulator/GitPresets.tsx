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
      color: "text-emerald-400",
    },
    {
      id: "divergent",
      title: "Branches Divergentes",
      desc: "main et feature/oauth ont divergé. Testez 'git merge' ou 'git rebase' !",
      icon: GitMerge,
      color: "text-blue-400",
    },
    {
      id: "gitflow",
      title: "Architecture Git Flow",
      desc: "main, develop et feature/cart en parallèle avec fichiers modifiés.",
      icon: Compass,
      color: "text-indigo-400",
    },
    {
      id: "detached",
      title: "État Detached HEAD",
      desc: "HEAD pointe sur un commit orphelin (Ambre/Rubis). Entraînez-vous à l'ancrer.",
      icon: ShieldAlert,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur-xl shadow-saas-card">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold font-mono">
          Topologies de Dépôt en 1 Clic
        </span>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors font-mono"
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
                "p-3.5 rounded-xl border text-left transition-all relative",
                isSelected
                  ? "bg-slate-800/90 border-blue-500/60 shadow-tech-glow"
                  : "bg-slate-950/50 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("w-4 h-4", p.color)} />
                <span className="text-xs font-bold text-slate-100">{p.title}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{p.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
