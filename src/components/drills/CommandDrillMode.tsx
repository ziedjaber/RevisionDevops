"use client";

import React, { useState, useRef, useEffect } from "react";
import { commandDrillsData } from "@/data/commandDrills";
import { CommandDrill, DifficultyLevel, MistakeRecord } from "@/types/game";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Eye,
  Flame,
  Send,
  Terminal,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
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
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface CommandDrillModeProps {
  completedDrillIds: string[];
  currentStreak: number;
  onPassDrill: (drill: CommandDrill, bonusXp: number) => void;
  onFailDrill: (mistake: Omit<MistakeRecord, "id" | "timestamp">) => void;
}

export const CommandDrillMode: React.FC<CommandDrillModeProps> = ({
  completedDrillIds,
  currentStreak,
  onPassDrill,
  onFailDrill,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "All" | DifficultyLevel
  >("All");
  const [selectedDrillId, setSelectedDrillId] = useState<string>(
    commandDrillsData[0].id
  );

  const filteredDrills = commandDrillsData.filter(
    (d) => selectedDifficulty === "All" || d.difficulty === selectedDifficulty
  );

  const activeDrill =
    filteredDrills.find((d) => d.id === selectedDrillId) ||
    filteredDrills[0] ||
    commandDrillsData[0];

  const [inputCmd, setInputCmd] = useState("");
  const [status, setStatus] = useState<
    "idle" | "correct" | "wrong" | "revealed"
  >("idle");
  const [showHint, setShowHint] = useState(false);
  const [lastAttempt, setLastAttempt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputCmd("");
    setStatus("idle");
    setShowHint(false);
    setLastAttempt("");
    inputRef.current?.focus();
  }, [activeDrill.id]);

  const streakMultiplier =
    currentStreak >= 5 ? 2 : currentStreak >= 3 ? 1.5 : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inputCmd.trim();
    if (!cleaned) return;

    if (status === "correct" || status === "revealed") {
      handleNextDrill();
      return;
    }

    setLastAttempt(cleaned);

    const isMatch = activeDrill.acceptedPatterns.some((patternStr) => {
      const regex = new RegExp(patternStr, "i");
      return regex.test(cleaned);
    });

    if (isMatch) {
      setStatus("correct");
      const bonusXp = Math.round(activeDrill.xpReward * (streakMultiplier - 1));
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.75 },
      });
      onPassDrill(activeDrill, bonusXp);
    } else {
      setStatus("wrong");
      onFailDrill({
        mode: "drills",
        difficulty: activeDrill.difficulty,
        category: activeDrill.category,
        prompt: activeDrill.prompt,
        userAnswer: cleaned,
        correctAnswer: activeDrill.canonicalCommand,
        explanation: activeDrill.explanation,
      });
    }
  };

  const handleNextDrill = () => {
    const currentIndex = filteredDrills.findIndex(
      (d) => d.id === activeDrill.id
    );
    const nextDrill =
      filteredDrills[(currentIndex + 1) % filteredDrills.length];
    if (nextDrill) {
      setSelectedDrillId(nextDrill.id);
    }
  };

  const handleRevealAnswer = () => {
    setStatus("revealed");
    setInputCmd(activeDrill.canonicalCommand);
  };

  const diffVariant = (d: DifficultyLevel) =>
    d === "Junior" ? "emerald" : d === "Mid" ? "amber" : "rose";

  return (
    <div className="space-y-6">
      {/* Top Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Pill variant="outline" className="text-xs">
          <PillStatus>
            <PillIndicator variant="info" />
            <span>Progress</span>
          </PillStatus>
          <span className="font-mono">
            {completedDrillIds.length} / {commandDrillsData.length} drills
            completed
          </span>
        </Pill>

        <Tabs
          value={selectedDifficulty}
          onValueChange={(v) => {
            const lvl = v as "All" | DifficultyLevel;
            setSelectedDifficulty(lvl);
            const first = commandDrillsData.find(
              (d) => lvl === "All" || d.difficulty === lvl
            );
            if (first) setSelectedDrillId(first.id);
          }}
        >
          <TabsList>
            <TabsTrigger value="All">All Tiers</TabsTrigger>
            <TabsTrigger value="Junior">Junior</TabsTrigger>
            <TabsTrigger value="Mid">Mid</TabsTrigger>
            <TabsTrigger value="DevOps Lead">DevOps Lead</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drill List */}
        <div className="lg:col-span-4 space-y-2 max-h-[580px] overflow-y-auto pr-1">
          {filteredDrills.map((drill, idx) => {
            const isSelected = drill.id === activeDrill.id;
            const isDone = completedDrillIds.includes(drill.id);
            return (
              <button
                key={drill.id}
                onClick={() => setSelectedDrillId(drill.id)}
                className={cn(
                  "w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-3",
                  isSelected
                    ? "bg-secondary border-primary/40 shadow-sm"
                    : "bg-card border-border hover:bg-accent/50"
                )}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <Badge variant={diffVariant(drill.difficulty)}>
                      {drill.difficulty}
                    </Badge>
                    <span className="text-[10px] font-mono text-emerald-400">
                      +{drill.xpReward} XP
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-foreground truncate">
                    {drill.scenarioContext}
                  </div>
                </div>
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Interactive Command Console (shadcn/ui Card + Kibo UI Snippet) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-muted/30 border-b border-border space-y-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400" />
                <CardTitle className="text-xs font-mono">
                  {activeDrill.category} ·{" "}
                  <span className="text-foreground">
                    {activeDrill.scenarioContext}
                  </span>
                </CardTitle>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                {streakMultiplier > 1 && (
                  <Badge variant="amber" className="gap-1">
                    <Flame className="w-3 h-3" />x{streakMultiplier}
                  </Badge>
                )}
                <Badge variant={diffVariant(activeDrill.difficulty)}>
                  {activeDrill.difficulty} (+{activeDrill.xpReward} XP)
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-muted-foreground">
                  CLI Challenge Prompt
                </span>
                <h2 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                  {activeDrill.prompt}
                </h2>
              </div>

              {/* Interactive Input Box */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl bg-background border font-mono text-sm transition-colors",
                    status === "correct"
                      ? "border-emerald-500/70"
                      : status === "wrong"
                      ? "border-rose-500/70"
                      : "border-border focus-within:border-primary/60"
                  )}
                >
                  <span className="text-emerald-400 font-bold select-none">
                    devops@lab:~$
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputCmd}
                    onChange={(e) => {
                      setInputCmd(e.target.value);
                      if (status === "wrong") setStatus("idle");
                    }}
                    placeholder="Type the exact command and press Enter..."
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none font-mono"
                    autoFocus
                  />
                  <Button type="submit" variant="default" size="sm">
                    {status === "correct" || status === "revealed" ? (
                      <>
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Execute <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Helper Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? "Hide hint" : "Show hint"}
                </button>

                <div className="flex items-center gap-3">
                  {status !== "correct" && status !== "revealed" && (
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Reveal solution
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextDrill}
                    className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Next drill
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200">
                  Hint: {activeDrill.hint}
                </div>
              )}

              {/* Feedback with Kibo UI Snippet */}
              {(status === "correct" || status === "revealed") && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {status === "correct"
                        ? `Command Verified (+${Math.round(
                            activeDrill.xpReward * streakMultiplier
                          )} XP)`
                        : "Canonical Solution"}
                    </span>
                  </div>

                  <Snippet defaultValue="command">
                    <SnippetHeader>
                      <SnippetTabsList className="h-7">
                        <SnippetTabsTrigger value="command">
                          Canonical Command
                        </SnippetTabsTrigger>
                        <SnippetTabsTrigger value="output">
                          Simulated Output
                        </SnippetTabsTrigger>
                      </SnippetTabsList>
                      <SnippetCopyButton value={activeDrill.canonicalCommand} />
                    </SnippetHeader>
                    <SnippetTabsContent value="command">
                      {`$ ${activeDrill.canonicalCommand}`}
                    </SnippetTabsContent>
                    <SnippetTabsContent value="output">
                      {activeDrill.simulatedOutput}
                    </SnippetTabsContent>
                  </Snippet>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeDrill.explanation}
                  </p>
                </div>
              )}

              {status === "wrong" && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                    <XCircle className="w-4 h-4" />
                    <span>Incorrect command syntax (logged to Post-Mortem)</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Your input: <code className="text-rose-300">{lastAttempt}</code>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
