"use client";

import React from "react";
import { GitRepoState } from "@/types/git";
import {
  FolderGit2,
  FileText,
  Database,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface GitZonesViewProps {
  state: GitRepoState;
}

export const GitZonesView: React.FC<GitZonesViewProps> = ({ state }) => {
  const commitCount = Object.keys(state.commits).length;
  const branchCount = Object.keys(state.branches).length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-xl shadow-saas-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold font-mono">
            Architecture Interne Git
          </span>
          <h4 className="text-sm font-bold text-slate-100">
            État en Direct des Trois Zones Locales
          </h4>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <Badge variant="gold">
            HEAD:{" "}
            {state.head.type === "branch"
              ? state.head.target
              : `detached (${state.head.target.slice(0, 7)})`}
          </Badge>
          <Badge variant="blue">{branchCount} branche(s)</Badge>
          <Badge variant="emerald">{commitCount} commit(s)</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Working Directory */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-[#f43f5e]" />
                1. Working Directory
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Fichiers modifiés
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Fichiers physiques modifiés dans l&apos;espace de travail.
            </p>

            <div className="space-y-1.5 min-h-[56px]">
              {state.workingDirectory.length === 0 ? (
                <div className="text-[11px] text-slate-500 italic py-2 font-mono">
                  Working tree clean.
                </div>
              ) : (
                state.workingDirectory.map((file) => (
                  <div
                    key={file}
                    className="p-1.5 px-2.5 rounded-lg bg-rose-950/25 border border-rose-500/30 text-[11px] text-rose-300 font-mono flex items-center justify-between"
                  >
                    <span>{file}</span>
                    <span className="text-[9px] uppercase font-bold text-[#f43f5e]">
                      Modified
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>git add &lt;file&gt;</span>
            <ArrowRight className="w-3 h-3 text-blue-400" />
          </div>
        </div>

        {/* 2. Staging Area (Index) */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#3b82f6]" />
                2. Staging Area (Index)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Prêt pour commit
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Instantané indexé qui formera le prochain commit.
            </p>

            <div className="space-y-1.5 min-h-[56px]">
              {state.stagingArea.length === 0 ? (
                <div className="text-[11px] text-slate-500 italic py-2 font-mono">
                  Aucun fichier stagé.
                </div>
              ) : (
                state.stagingArea.map((file) => (
                  <div
                    key={file}
                    className="p-1.5 px-2.5 rounded-lg bg-emerald-950/25 border border-emerald-500/30 text-[11px] text-emerald-300 font-mono flex items-center justify-between"
                  >
                    <span>{file}</span>
                    <span className="text-[9px] uppercase font-bold text-[#10b981]">
                      Staged
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
            <span>git commit -m &quot;...&quot;</span>
            <ArrowRight className="w-3 h-3 text-emerald-400" />
          </div>
        </div>

        {/* 3. Local Repository (.git) */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#10b981]" />
                3. Local Repository (.git)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                Snapshots SHA-1
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Base d&apos;objets immuables validés dans le graphe.
            </p>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span>Commits SHA-1 :</span>
                <span className="text-emerald-400 font-bold">{commitCount}</span>
              </div>
              <div className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span>Pile Git Stash :</span>
                <span className="text-amber-400 font-bold">
                  {state.stash.length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Intégrité SHA-1 vérifiée</span>
          </div>
        </div>
      </div>
    </div>
  );
};
