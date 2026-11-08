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

export const GitSimulator: React.FC = () => {
  const [repoState, setRepoState] = useState<GitRepoState>(getInitialRepoState());
  const [currentPreset, setCurrentPreset] = useState<string>("initial");
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "git status",
      output:
        "On branch main\nChanges not staged for commit:\n\tmodified:   config/app.json\n\tmodified:   src/auth/service.ts",
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

    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setHistory((prev) => [
      ...prev,
      {
        command: `# Chargement de la topologie : ${presetId}`,
        output: `Topologie '${presetId}' initialisée dans le moteur Git.`,
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
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-saas-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">
              Mode 4 &bull; Free-Play Git Graph Simulator
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">
            Simulateur Graphique Interactif du Graphe de Commits Git
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Expérimentez librement avec les branches, fusions Fast-Forward vs 3-Way, rebase, cherry-pick, reset et le pointeur HEAD.
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
