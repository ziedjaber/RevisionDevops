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
  const [repoState, setRepoState] = useState<GitRepoState>(
    getInitialRepoState()
  );
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
        command: `# Loaded preset topology: ${presetId}`,
        output: `Topology '${presetId}' initialized in Gitgraph.js engine.`,
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
      <GitPresets
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
      />

      <GitGraphCanvas state={repoState} />

      <GitZonesView state={repoState} />

      <GitTerminal
        history={history}
        onExecute={handleExecute}
        onClear={handleClearTerminal}
      />
    </div>
  );
};
