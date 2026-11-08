"use client";

import React, { useState } from "react";
import { GitRepoState, CommandOutput } from "@/types/git";
import {
  getInitialRepoState,
  getPresetState,
  executeGitCommand,
} from "@/lib/gitEngine";
import { GitGraphCanvas } from "./GitGraphCanvas";
import { GitTerminal } from "./GitTerminal";
import { GitZonesView } from "./GitZonesView";
import { GitPresets } from "./GitPresets";
import { Sparkles, HelpCircle } from "lucide-react";

export const GitSimulator: React.FC = () => {
  const [repoState, setRepoState] = useState<GitRepoState>(getInitialRepoState());
  const [currentPreset, setCurrentPreset] = useState<string>("initial");
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "git status",
      output:
        "Sur la branche main\nModifications qui ne sont pas indexées pour validation :\n  (utilisez \"git add <fichier>...\" pour mettre à jour)\n\tconfig/app.json\n\tsrc/auth/service.ts\n\narbre de travail avec modifications non indexées.",
      type: "info",
      timestamp: "Initial",
    },
  ]);

  const handleExecute = (rawCmd: string) => {
    const { nextState, output } = executeGitCommand(rawCmd, repoState);
    setRepoState(nextState);
    setHistory((prev) => [...prev, output]);
  };

  const handleSelectPreset = (presetId: string) => {
    setCurrentPreset(presetId);
    const newState = getPresetState(presetId);
    setRepoState(newState);

    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => [
      ...prev,
      {
        command: `# Chargement du scénario : ${presetId}`,
        output: `Scénario '${presetId}' chargé dans l'environnement virtuel Git.`,
        type: "info",
        timestamp: now,
      },
    ]);
  };

  const handleReset = () => {
    handleSelectPreset(currentPreset);
  };

  const handleClearTerminal = () => {
    setHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-[#10131E] to-zinc-900/90 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 px-2 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              Moteur Virtuel Git
            </span>
            <span className="text-zinc-500 text-xs">&bull;</span>
            <span className="text-zinc-400 text-xs">ISIMS DevOps & Versioning</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            Simulateur Graphique Interactif du Graphe de Commits Git
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
            Visualisez en temps réel l&apos;impact de chaque commande sur les branches, les pointeurs, la zone d&apos;indexation (staging) et le pointeur HEAD (attaché ou détaché).
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <GitPresets
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
      />

      {/* Interactive Commit Graph Canvas */}
      <GitGraphCanvas state={repoState} />

      {/* 3 Zones Internal Architecture View */}
      <GitZonesView state={repoState} />

      {/* Interactive CLI Terminal */}
      <GitTerminal
        history={history}
        onExecute={handleExecute}
        onClear={handleClearTerminal}
      />
    </div>
  );
};
