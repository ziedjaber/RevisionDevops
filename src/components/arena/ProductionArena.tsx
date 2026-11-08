"use client";

import React, { useState, useEffect } from "react";
import { arenaScenarios } from "@/data/arenaScenarios";
import { ArenaScenario, DifficultyLevel, MistakeRecord } from "@/types/game";
import { GitRepoState, CommandOutput } from "@/types/git";
import { getPresetState, executeGitCommand } from "@/lib/gitEngine";
import { GitGraphCanvas } from "@/components/simulator/GitGraphCanvas";
import { GitTerminal } from "@/components/simulator/GitTerminal";
import {
  ShieldAlert,
  CheckCircle2,
  Circle,
  RotateCcw,
  Lightbulb,
  Trophy,
  StepForward,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

interface ProductionArenaProps {
  solvedArenaIds: string[];
  onSolveScenario: (scenario: ArenaScenario) => void;
  onRecordMistake: (mistake: Omit<MistakeRecord, "id" | "timestamp">) => void;
}

export const ProductionArena: React.FC<ProductionArenaProps> = ({
  solvedArenaIds,
  onSolveScenario,
  onRecordMistake,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<"All" | DifficultyLevel>("All");
  const [selectedId, setSelectedId] = useState<string>(arenaScenarios[0].id);

  const activeScenario =
    arenaScenarios.find((s) => s.id === selectedId) || arenaScenarios[0];

  const [gitState, setGitState] = useState<GitRepoState>(() =>
    getPresetState(activeScenario.initialPreset)
  );
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<CommandOutput[]>([]);
  const [hintsCount, setHintsCount] = useState<number>(0);
  const [stepPlayIdx, setStepPlayIdx] = useState<number>(0);
  const [justSolvedBanner, setJustSolvedBanner] = useState<boolean>(false);

  useEffect(() => {
    const fresh = getPresetState(activeScenario.initialPreset);
    setGitState(fresh);
    setCmdHistory([]);
    setHintsCount(0);
    setStepPlayIdx(0);
    setJustSolvedBanner(false);
    setTerminalLogs([
      {
        command: `# Incident ${activeScenario.incidentCode} initialisé`,
        output: `Mission : ${activeScenario.missionGoal}`,
        type: "info",
        timestamp: "00:00",
      },
    ]);
  }, [activeScenario]);

  const handleExecuteCommand = (rawCmd: string) => {
    const { nextState, output } = executeGitCommand(rawCmd, gitState);
    const nextCmdHistory = [...cmdHistory, rawCmd];
    setGitState(nextState);
    setCmdHistory(nextCmdHistory);
    setTerminalLogs((prev) => [...prev, output]);

    if (output.type === "error") {
      onRecordMistake({
        mode: "arena",
        difficulty: activeScenario.difficulty,
        category: activeScenario.category,
        prompt: `${activeScenario.incidentCode} : ${activeScenario.missionGoal}`,
        userAnswer: rawCmd,
        correctAnswer: activeScenario.solutionSteps.map((s) => s.command).join(" -> "),
        explanation: activeScenario.postMortemTakeaway,
      });
    }

    const allMet = activeScenario.objectives.every((obj) =>
      obj.check(nextState, nextCmdHistory)
    );

    if (allMet && !justSolvedBanner) {
      setJustSolvedBanner(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.65 },
        colors: ["#3b82f6", "#10b981", "#6366f1"],
      });
      onSolveScenario(activeScenario);
    }
  };

  const handlePlayNextStep = () => {
    if (stepPlayIdx >= activeScenario.solutionSteps.length) return;
    const step = activeScenario.solutionSteps[stepPlayIdx];
    handleExecuteCommand(step.command);
    setStepPlayIdx((prev) => prev + 1);
  };

  const handleResetScenario = () => {
    setGitState(getPresetState(activeScenario.initialPreset));
    setCmdHistory([]);
    setStepPlayIdx(0);
    setJustSolvedBanner(false);
    setTerminalLogs([
      {
        command: "# Graphe Git réinitialisé à l'état initial de l'incident",
        output: "Prêt pour une nouvelle tentative.",
        type: "info",
        timestamp: "Reset",
      },
    ]);
  };

  const filteredScenarios = arenaScenarios.filter(
    (s) => difficultyFilter === "All" || s.difficulty === difficultyFilter
  );

  const difficultyBadgeVariant = (diff: DifficultyLevel) =>
    diff === "Junior" ? "emerald" : diff === "Mid" ? "gold" : "rose";

  return (
    <div className="space-y-6">
      {/* Top Filter & Mode Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-saas-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">
              Mode 1 &bull; Production Incident Arena
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Simulation de graphe Git pas à pas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            Arena de Problèmes &amp; Scénarios Réels de Prod
          </h1>
        </div>

        {/* Difficulty Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {(["All", "Junior", "Mid", "DevOps Lead"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setDifficultyFilter(lvl)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all",
                difficultyFilter === lvl
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {lvl === "All" ? "Tous Niveaux" : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scenario Selector & Objectives Checklist */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-2">
            {filteredScenarios.map((scen) => {
              const isSelected = scen.id === activeScenario.id;
              const isSolved = solvedArenaIds.includes(scen.id);
              return (
                <button
                  key={scen.id}
                  onClick={() => setSelectedId(scen.id)}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all flex items-start justify-between gap-3",
                    isSelected
                      ? "bg-slate-900 border-blue-500/60 shadow-tech-glow"
                      : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                  )}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-400">
                        {scen.incidentCode}
                      </span>
                      <Badge variant={difficultyBadgeVariant(scen.difficulty)}>
                        {scen.difficulty}
                      </Badge>
                      <span className="text-[11px] font-mono text-emerald-400">
                        +{scen.xpReward} XP
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-100 truncate">
                      {scen.title}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {scen.category}
                    </div>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isSolved ? (
                      <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-700" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Incident Mission Brief & Live Objectives */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-saas-card">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#f43f5e] font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#f43f5e]" />
                Briefing Incident {activeScenario.incidentCode}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                +{activeScenario.xpReward} XP
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeScenario.incidentBrief}
            </p>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
              <strong className="text-blue-400 block font-mono uppercase text-[10px] mb-0.5">
                Objectif de Mission :
              </strong>
              {activeScenario.missionGoal}
            </div>

            {/* Live Verification Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Critères de Validation en Direct :
              </span>
              {activeScenario.objectives.map((obj) => {
                const passed = obj.check(gitState, cmdHistory);
                return (
                  <div
                    key={obj.id}
                    className={cn(
                      "p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all",
                      passed
                        ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                        : "bg-slate-950/80 border-slate-800 text-slate-400"
                    )}
                  >
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="leading-snug">{obj.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Step-by-Step Interactive Graph Replay Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-blue-400 font-semibold">
                  Simulation Pas à Pas ({stepPlayIdx}/{activeScenario.solutionSteps.length})
                </span>
                <button
                  onClick={() =>
                    setHintsCount((c) =>
                      c < activeScenario.hints.length ? c + 1 : c
                    )
                  }
                  className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  Indice ({hintsCount}/{activeScenario.hints.length})
                </button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handlePlayNextStep}
                  disabled={stepPlayIdx >= activeScenario.solutionSteps.length}
                  variant="primary"
                  size="sm"
                  className="flex-1 text-xs"
                  icon={<StepForward className="w-3.5 h-3.5" />}
                >
                  {stepPlayIdx < activeScenario.solutionSteps.length
                    ? `Exécuter Étape ${stepPlayIdx + 1} sur le Graphe`
                    : "Toutes les étapes exécutées"}
                </Button>
                <Button
                  onClick={handleResetScenario}
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw className="w-3.5 h-3.5" />}
                  title="Réinitialiser le graphe"
                >
                  Reset
                </Button>
              </div>

              {stepPlayIdx > 0 && (
                <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 text-xs space-y-1">
                  <div className="font-mono text-blue-300 font-bold">
                    $ {activeScenario.solutionSteps[stepPlayIdx - 1].command}
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    {activeScenario.solutionSteps[stepPlayIdx - 1].description}
                  </p>
                </div>
              )}

              {hintsCount > 0 && (
                <div className="space-y-1.5 pt-1">
                  {activeScenario.hints.slice(0, hintsCount).map((h, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-amber-950/25 border border-amber-500/30 text-[11px] text-amber-200 font-mono"
                    >
                      💡 {h}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Git Graph + Interactive Terminal */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {justSolvedBanner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 rounded-2xl border border-emerald-500/60 bg-slate-900/95 flex flex-wrap items-center justify-between gap-4 shadow-emerald-glow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-emerald-300 flex items-center gap-2">
                      INCIDENT {activeScenario.incidentCode} RÉSOLU !
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        +{activeScenario.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {activeScenario.postMortemTakeaway}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <GitGraphCanvas state={gitState} />

          <GitTerminal
            history={terminalLogs}
            onExecute={handleExecuteCommand}
            onClear={() => setTerminalLogs([])}
          />
        </div>
      </div>
    </div>
  );
};
