"use client";

import React, { useState } from "react";
import { GitBranch, GitMerge, Tag, CheckCircle2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export const GitFlowDiagram: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<"gitflow" | "trunk">("gitflow");

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Méthodologies Collaboratives</span>
          <h3 className="text-lg font-bold text-zinc-100">Git Flow vs Trunk-Based Development (Slides S106–S110)</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveWorkflow("gitflow")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              activeWorkflow === "gitflow"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            )}
          >
            Modèle Git Flow (Classique)
          </button>
          <button
            onClick={() => setActiveWorkflow("trunk")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              activeWorkflow === "trunk"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            )}
          >
            Trunk-Based (DevOps Moderne)
          </button>
        </div>
      </div>

      {activeWorkflow === "gitflow" ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300">
            Dans <strong>Git Flow</strong>, chaque type de changement possède son couloir de branche dédié :
          </p>

          <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-3 font-mono text-xs">
            {/* main lane */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-right font-bold text-cyan-400 flex items-center justify-end gap-1">
                <GitBranch className="w-3.5 h-3.5" /> main
              </span>
              <div className="flex-1 flex items-center gap-2 py-2 px-3 bg-zinc-800/80 rounded-lg border border-cyan-500/30">
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">C1: v1.0</span>
                <span className="text-zinc-500">───</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">C2: v1.0.1</span>
                <span className="text-zinc-500">──────────────</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">Merge Hotfix (v1.0.2)</span>
                <span className="text-zinc-500">────────</span>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">Merge Release (v1.1)</span>
              </div>
            </div>

            {/* hotfix lane */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-right font-bold text-rose-400 flex items-center justify-end gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> hotfix/*
              </span>
              <div className="flex-1 flex items-center gap-2 py-2 px-3 bg-rose-950/20 rounded-lg border border-rose-500/30">
                <span className="text-zinc-500">Départ de main ➔</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 text-[10px] font-bold">Patch SQL Injection</span>
                <span className="text-zinc-500">➔ Fusionne dans main ET develop !</span>
              </div>
            </div>

            {/* release lane */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-right font-bold text-amber-400 flex items-center justify-end gap-1">
                <Tag className="w-3.5 h-3.5" /> release/*
              </span>
              <div className="flex-1 flex items-center gap-2 py-2 px-3 bg-amber-950/20 rounded-lg border border-amber-500/30">
                <span className="text-zinc-500">Départ de develop ➔</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">Tests finaux & Bump v1.1</span>
                <span className="text-zinc-500">➔ Fusionne dans main ET develop</span>
              </div>
            </div>

            {/* develop lane */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-right font-bold text-emerald-400 flex items-center justify-end gap-1">
                <GitBranch className="w-3.5 h-3.5" /> develop
              </span>
              <div className="flex-1 flex items-center gap-2 py-2 px-3 bg-zinc-800/80 rounded-lg border border-emerald-500/30">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Sprint Start</span>
                <span className="text-zinc-500">──</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Merge Feature Auth</span>
                <span className="text-zinc-500">──</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Merge Feature Cart</span>
              </div>
            </div>

            {/* feature lane */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-right font-bold text-purple-400 flex items-center justify-end gap-1">
                <GitMerge className="w-3.5 h-3.5" /> feature/*
              </span>
              <div className="flex-1 flex items-center gap-2 py-2 px-3 bg-purple-950/20 rounded-lg border border-purple-500/30">
                <span className="text-zinc-500">Départ de develop ➔ Commits isolés ➔ Rejoint develop via Pull Request</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-300">
            📌 <strong>Cas d&apos;usage :</strong> Projets logiciels avec releases planifiées (mensuelles/trimestrielles) et versions majeures distinctes à maintenir.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-zinc-300">
            Dans <strong>Trunk-Based Development</strong>, tous les développeurs intègrent fréquemment leur travail directement sur la branche principale unique (le <em>trunk</em>) :
          </p>

          <div className="p-5 bg-zinc-900/60 rounded-xl border border-zinc-800 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="w-24 text-right font-bold text-cyan-400 flex items-center justify-end gap-1">
                <GitBranch className="w-4 h-4" /> TRUNK (main)
              </span>
              <div className="flex-1 flex flex-wrap items-center gap-2 py-3 px-4 bg-zinc-800/90 rounded-xl border-2 border-cyan-500/40">
                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold">C1</span>
                <span className="text-cyan-400">➔</span>
                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold">C2</span>
                <span className="text-cyan-400">➔</span>
                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold">C3 (Feature Flag)</span>
                <span className="text-cyan-400">➔</span>
                <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold">C4</span>
                <span className="text-cyan-400">➔</span>
                <span className="px-2 py-1 rounded bg-emerald-500/30 text-emerald-300 text-xs font-bold">Deploy Prod Auto</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-zinc-300">
              <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/80">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Branches éphémères (&lt; 24h)
                </div>
                <div className="text-[11px] text-zinc-400">
                  Branches courtes de quelques commits rapidement fusionnées pour éliminer les conflits massifs de merge.
                </div>
              </div>
              <div className="p-3 bg-zinc-800/60 rounded-lg border border-zinc-700/80">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Feature Flags (Bascules)
                </div>
                <div className="text-[11px] text-zinc-400">
                  Le code incomplet est poussé en production mais masqué aux utilisateurs finaux jusqu&apos;à validation.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-xs text-cyan-300">
            🚀 <strong>Cas d&apos;usage :</strong> Organisations DevOps matures pratiquant le Déploiement Continu avec pipelines CI/CD ultra-rapides.
          </div>
        </div>
      )}
    </div>
  );
};
