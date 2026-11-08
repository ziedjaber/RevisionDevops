"use client";

import React from "react";
import { GitRepoState } from "@/types/git";
import { FolderGit2, FileText, CheckCircle, Database, Archive, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface GitZonesViewProps {
  state: GitRepoState;
}

export const GitZonesView: React.FC<GitZonesViewProps> = ({ state }) => {
  const commitCount = Object.keys(state.commits).length;
  const branchCount = Object.keys(state.branches).length;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0B0D14]/90 p-5 backdrop-blur-xl shadow-subtle-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Structure Interne de Git</span>
          <h4 className="text-sm font-bold text-zinc-100">Les Trois Zones Locales (ISIMS Slide S60–S63)</h4>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="cyan">HEAD: {state.head.type === "branch" ? state.head.target : `detached (${state.head.target.slice(0, 7)})`}</Badge>
          <Badge variant="gold">{branchCount} branche(s)</Badge>
          <Badge variant="emerald">{commitCount} commit(s)</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Working Directory */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-rose-400" />
                1. Working Directory
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Fichiers modifiés</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Vos fichiers physiques dans votre éditeur (non encore indexés).
            </p>

            <div className="space-y-1.5 min-h-[60px]">
              {state.workingDirectory.length === 0 ? (
                <div className="text-[11px] text-zinc-600 italic py-2">Arbre de travail propre.</div>
              ) : (
                state.workingDirectory.map((file) => (
                  <div
                    key={file}
                    className="p-1.5 px-2.5 rounded-lg bg-rose-950/20 border border-rose-500/30 text-[11px] text-rose-300 font-mono flex items-center justify-between"
                  >
                    <span>{file}</span>
                    <span className="text-[9px] uppercase font-bold text-rose-400">Modifié</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
            <span>Action : git add</span>
            <ArrowRight className="w-3 h-3 text-amber-400" />
          </div>
        </div>

        {/* 2. Staging Area (Index) */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-amber-500/30 flex flex-col justify-between shadow-gold-glow/10">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-400" />
                2. Staging Area (Index)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Prêt pour commit</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Instantané préparatoire qui sera scellé dans le prochain commit.
            </p>

            <div className="space-y-1.5 min-h-[60px]">
              {state.stagingArea.length === 0 ? (
                <div className="text-[11px] text-zinc-600 italic py-2">Aucun fichier indexé.</div>
              ) : (
                state.stagingArea.map((file) => (
                  <div
                    key={file}
                    className="p-1.5 px-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono flex items-center justify-between"
                  >
                    <span>{file}</span>
                    <span className="text-[9px] uppercase font-bold text-emerald-400">Staged</span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
            <span>Action : git commit</span>
            <ArrowRight className="w-3 h-3 text-cyan-400" />
          </div>
        </div>

        {/* 3. Local Repository (.git) */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-cyan-400" />
                3. Local Repository (.git)
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Objets immuables</span>
            </div>
            <p className="text-[11px] text-zinc-400 mb-3">
              Base de données de snapshots cryptographiques SHA-1.
            </p>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between p-1.5 px-2 rounded bg-zinc-800/60 text-zinc-300">
                <span>Commits enregistrés :</span>
                <span className="font-mono text-cyan-300 font-bold">{commitCount}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 px-2 rounded bg-zinc-800/60 text-zinc-300">
                <span>Stash sauvegardé :</span>
                <span className="font-mono text-amber-300 font-bold">{state.stash.length} entrées</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Historique sécurisé &amp; traçable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
