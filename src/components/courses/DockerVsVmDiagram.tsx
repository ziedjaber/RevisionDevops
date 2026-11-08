"use client";

import React, { useState } from "react";
import { Server, Box, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const DockerVsVmDiagram: React.FC = () => {
  const [highlighted, setHighlighted] = useState<"vm" | "docker">("docker");

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Comparatif Visuel Fondamental</span>
          <h3 className="text-lg font-bold text-zinc-100">Conteneurisation Docker vs Virtualisation Lourde (Slide S176)</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setHighlighted("docker")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              highlighted === "docker"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            )}
          >
            Conteneurs Docker (Recommandé)
          </button>
          <button
            onClick={() => setHighlighted("vm")}
            className={cn(
              "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
              highlighted === "vm"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            )}
          >
            Machines Virtuelles (VM)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Machine Virtuelle (VM) */}
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between",
            highlighted === "vm"
              ? "bg-zinc-900/90 border-amber-500/40 shadow-gold-glow/20"
              : "bg-zinc-900/40 border-zinc-800 opacity-75"
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-zinc-100">Machine Virtuelle (VM)</h4>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Chaque VM embarque un OS complet avec son propre noyau et ses pilotes.
            </p>

            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700 text-center text-xs space-y-1">
                  <div className="font-semibold text-amber-300">App A</div>
                  <div className="text-[10px] text-zinc-400">Bins / Libs</div>
                  <div className="p-1 bg-amber-500/20 text-amber-200 rounded text-[10px] font-bold">
                    Guest OS (Plusieurs Go)
                  </div>
                </div>
                <div className="p-3 bg-zinc-800/80 rounded-xl border border-zinc-700 text-center text-xs space-y-1">
                  <div className="font-semibold text-amber-300">App B</div>
                  <div className="text-[10px] text-zinc-400">Bins / Libs</div>
                  <div className="p-1 bg-amber-500/20 text-amber-200 rounded text-[10px] font-bold">
                    Guest OS (Plusieurs Go)
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl text-center text-xs font-semibold text-purple-300">
                Hyperviseur (ESXi, KVM, VirtualBox)
              </div>
              <div className="p-2.5 bg-zinc-850 border border-zinc-700 rounded-xl text-center text-xs text-zinc-300">
                Système d&apos;Exploitation Hôte (Host OS)
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-xs font-mono text-zinc-500">
                Infrastructure Matérielle (CPU, RAM, Disque)
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-1">
            <div>⏱ Démarrage : <strong>Plusieurs minutes</strong></div>
            <div>💾 Poids mémoire : <strong>Gigaoctets réservés d&apos;office</strong></div>
            <div>⚖️ Isolation : Émulation matérielle totale</div>
          </div>
        </div>

        {/* Conteneurs Docker */}
        <div
          className={cn(
            "p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between",
            highlighted === "docker"
              ? "bg-zinc-900/90 border-cyan-500/40 shadow-cyan-glow/30"
              : "bg-zinc-900/40 border-zinc-800 opacity-75"
          )}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-5 h-5 text-cyan-400" />
              <h4 className="text-base font-bold text-zinc-100">Conteneurs Docker</h4>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Partage direct du noyau de l&apos;hôte via cgroups & namespaces. Pas de Guest OS !
            </p>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-zinc-800/80 rounded-xl border border-cyan-500/30 text-center text-xs space-y-1">
                  <div className="font-semibold text-cyan-300">App 1</div>
                  <div className="text-[10px] text-zinc-400">Bins / Libs</div>
                </div>
                <div className="p-3 bg-zinc-800/80 rounded-xl border border-cyan-500/30 text-center text-xs space-y-1">
                  <div className="font-semibold text-cyan-300">App 2</div>
                  <div className="text-[10px] text-zinc-400">Bins / Libs</div>
                </div>
                <div className="p-3 bg-zinc-800/80 rounded-xl border border-cyan-500/30 text-center text-xs space-y-1">
                  <div className="font-semibold text-cyan-300">App 3</div>
                  <div className="text-[10px] text-zinc-400">Bins / Libs</div>
                </div>
              </div>

              <div className="p-2.5 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-center text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                Moteur Docker (dockerd + API REST)
              </div>
              <div className="p-2.5 bg-zinc-850 border border-zinc-700 rounded-xl text-center text-xs font-semibold text-emerald-300">
                Host OS avec Noyau Partagé (cgroups, namespaces)
              </div>
              <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-center text-xs font-mono text-zinc-500">
                Infrastructure Matérielle (CPU, RAM, Disque)
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-300 space-y-1">
            <div>⚡ Démarrage : <strong>Quasi-instantané (&lt; 1 seconde)</strong></div>
            <div>📦 Poids mémoire : <strong>Quelques dizaines de Mo seulement</strong></div>
            <div>🎯 Portabilité : <strong>« Build once, run anywhere »</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
