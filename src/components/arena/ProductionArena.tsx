"use client";

import React, { useState, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Pill,
  PillStatus,
  PillIndicator,
  Snippet,
  SnippetHeader,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
  SnippetCopyButton,
} from "@/components/ui/kibo-ui";
import { BorderBeam } from "@/components/ui/magic-ui";
import { Card3DTilt, GlowButton } from "@/components/ui/inspira-ui";
import { CultSpringTabs, CultTabItem } from "@/components/ui/cult-ui";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface ProductionArenaProps {
  solvedArenaIds: string[];
  onSolveScenario: (scenario: ArenaScenario) => void;
  onRecordMistake: (mistake: Omit<MistakeRecord, "id" | "timestamp">) => void;
}

const ARENA_TABS: CultTabItem<"All" | DifficultyLevel>[] = [
  { id: "All", label: "Tous les incidents" },
  { id: "Junior", label: "Junior" },
  { id: "Mid", label: "Mid" },
  { id: "DevOps Lead", label: "DevOps Lead" },
];

export const ProductionArena: React.FC<ProductionArenaProps> = ({
  solvedArenaIds,
  onSolveScenario,
  onRecordMistake,
}) => {
  const [difficultyFilter, setDifficultyFilter] = useState<
    "All" | DifficultyLevel
  >("All");
  const [selectedId, setSelectedId] = useState<string>(arenaScenarios[0].id);

  // AutoAnimate hooks for zero-config list transitions
  const [scenarioListRef] = useAutoAnimate<HTMLDivElement>();
  const [objectivesRef] = useAutoAnimate<HTMLDivElement>();

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
        output: `Objectif : ${activeScenario.missionGoal}`,
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
        prompt: `${activeScenario.incidentCode}: ${activeScenario.missionGoal}`,
        userAnswer: rawCmd,
        correctAnswer: activeScenario.solutionSteps
          .map((s) => s.command)
          .join(" -> "),
        explanation: activeScenario.postMortemTakeaway,
      });
    }

    const allMet = activeScenario.objectives.every((obj) =>
      obj.check(nextState, nextCmdHistory)
    );

    if (allMet && !justSolvedBanner) {
      setJustSolvedBanner(true);
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.65 },
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
        command: "# État du dépôt réinitialisé",
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
    diff === "Junior" ? "emerald" : diff === "Mid" ? "amber" : "rose";

  return (
    <div className="space-y-6">
      {/* Filter Bar with Cult UI Spring Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Pill variant="outline" className="text-xs">
            <PillStatus>
              <PillIndicator variant="warning" pulse />
              <span>Incident Actif</span>
            </PillStatus>
            <span className="font-mono font-semibold">
              {activeScenario.incidentCode}
            </span>
          </Pill>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {activeScenario.category}
          </span>
        </div>

        <CultSpringTabs
          items={ARENA_TABS}
          value={difficultyFilter}
          onChange={setDifficultyFilter}
          layoutId="arena-tier-spring-tabs"
        />
      </div>

      {/* Main Arena Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Inspira UI 3D Tilt Scenario Cards & Mission Briefing */}
        <div className="lg:col-span-4 space-y-4">
          <div ref={scenarioListRef} className="space-y-2.5">
            {filteredScenarios.map((scen) => {
              const isSelected = scen.id === activeScenario.id;
              const isSolved = solvedArenaIds.includes(scen.id);
              return (
                <Card3DTilt
                  key={scen.id}
                  active={isSelected}
                  onClick={() => setSelectedId(scen.id)}
                  className="cursor-pointer p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {scen.incidentCode}
                        </span>
                        <Badge
                          variant={difficultyBadgeVariant(scen.difficulty)}
                        >
                          {scen.difficulty}
                        </Badge>
                        <span className="text-[11px] font-mono text-emerald-400">
                          +{scen.xpReward} XP
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-foreground truncate">
                        {scen.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {scen.category}
                      </div>
                    </div>
                    <div className="shrink-0 mt-1">
                      {isSolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </div>
                </Card3DTilt>
              );
            })}
          </div>

          {/* Active Incident Card with Magic UI BorderBeam */}
          <Card className="relative overflow-hidden">
            <BorderBeam
              size={180}
              duration={14}
              colorFrom="#f43f5e"
              colorTo="#f59e0b"
            />
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-rose-400">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Briefing {activeScenario.incidentCode}</span>
                </CardTitle>
                <Badge variant="emerald" className="font-mono">
                  +{activeScenario.xpReward} XP
                </Badge>
              </div>
              <CardDescription className="text-xs leading-relaxed pt-1">
                {activeScenario.incidentBrief}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="p-3 rounded-lg bg-secondary/70 border border-border text-xs">
                <span className="font-mono text-[10px] text-muted-foreground block mb-1">
                  Objectif de mission
                </span>
                <span className="text-foreground font-medium">
                  {activeScenario.missionGoal}
                </span>
              </div>

              {/* Live Objectives Checklist with AutoAnimate */}
              <div ref={objectivesRef} className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground block">
                  Critères de vérification en direct
                </span>
                {activeScenario.objectives.map((obj) => {
                  const passed = obj.check(gitState, cmdHistory);
                  return (
                    <div
                      key={obj.id}
                      className={cn(
                        "p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-colors",
                        passed
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                          : "bg-background/60 border-border text-muted-foreground"
                      )}
                    >
                      {passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0 mt-0.5" />
                      )}
                      <span className="leading-snug">{obj.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Step-by-Step Replay Controls */}
              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">
                    Simulation pas à pas ({stepPlayIdx}/
                    {activeScenario.solutionSteps.length})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setHintsCount((c) =>
                        c < activeScenario.hints.length ? c + 1 : c
                      )
                    }
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    Indice ({hintsCount}/{activeScenario.hints.length})
                  </button>
                </div>

                <div className="flex gap-2">
                  <GlowButton
                    type="button"
                    onClick={handlePlayNextStep}
                    disabled={
                      stepPlayIdx >= activeScenario.solutionSteps.length
                    }
                    variant="indigo"
                    size="sm"
                    className="flex-1"
                  >
                    <StepForward className="w-3.5 h-3.5" />
                    <span>
                      {stepPlayIdx < activeScenario.solutionSteps.length
                        ? `Exécuter étape ${stepPlayIdx + 1}`
                        : "Toutes les étapes jouées"}
                    </span>
                  </GlowButton>
                  <Button
                    onClick={handleResetScenario}
                    variant="outline"
                    size="sm"
                    icon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Reset
                  </Button>
                </div>

                {/* Kibo UI Snippet showing executed steps */}
                {stepPlayIdx > 0 && (
                  <Snippet defaultValue={`step-${stepPlayIdx - 1}`}>
                    <SnippetHeader>
                      <SnippetTabsList className="h-7">
                        {activeScenario.solutionSteps
                          .slice(0, stepPlayIdx)
                          .map((_, idx) => (
                            <SnippetTabsTrigger
                              key={idx}
                              value={`step-${idx}`}
                            >
                              Étape {idx + 1}
                            </SnippetTabsTrigger>
                          ))}
                      </SnippetTabsList>
                      <SnippetCopyButton
                        value={
                          activeScenario.solutionSteps[stepPlayIdx - 1].command
                        }
                      />
                    </SnippetHeader>
                    {activeScenario.solutionSteps
                      .slice(0, stepPlayIdx)
                      .map((st, idx) => (
                        <SnippetTabsContent key={idx} value={`step-${idx}`}>
                          {`$ ${st.command}\n# ${st.description}`}
                        </SnippetTabsContent>
                      ))}
                  </Snippet>
                )}

                {hintsCount > 0 && (
                  <div className="space-y-1.5">
                    {activeScenario.hints.slice(0, hintsCount).map((h, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-mono"
                      >
                        {h}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Gitgraph.js Canvas + Interactive Terminal */}
        <div className="lg:col-span-8 space-y-4">
          {justSolvedBanner && (
            <Card className="relative overflow-hidden border-emerald-500/50 bg-emerald-950/20 p-4">
              <BorderBeam
                size={160}
                duration={8}
                colorFrom="#10b981"
                colorTo="#38bdf8"
              />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                    <span>
                      Incident {activeScenario.incidentCode} Résolu !
                    </span>
                    <Badge variant="emerald">
                      +{activeScenario.xpReward} XP
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activeScenario.postMortemTakeaway}
                  </p>
                </div>
              </div>
            </Card>
          )}

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
