"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
import { AuroraTerminalBg } from "@/components/ui/react-bits";
import {
  Card3DTilt,
  GlowButton,
  TypewriterTerminalText,
} from "@/components/ui/inspira-ui";
import { CultSpringTabs, CultTabItem } from "@/components/ui/cult-ui";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface CommandDrillModeProps {
  completedDrillIds: string[];
  currentStreak: number;
  onPassDrill: (drill: CommandDrill, bonusXp: number) => void;
  onFailDrill: (mistake: Omit<MistakeRecord, "id" | "timestamp">) => void;
}

const TIER_TABS: CultTabItem<"All" | DifficultyLevel>[] = [
  { id: "All", label: "Tous les niveaux" },
  { id: "Junior", label: "Junior" },
  { id: "Mid", label: "Mid" },
  { id: "DevOps Lead", label: "DevOps Lead" },
];

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
  const [listParentRef] = useAutoAnimate<HTMLDivElement>();

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
        particleCount: 45,
        spread: 55,
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
      {/* Top Filter Row with Cult UI Spring Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Pill variant="outline" className="text-xs">
          <PillStatus>
            <PillIndicator variant="info" />
            <span>Progression</span>
          </PillStatus>
          <span className="font-mono">
            {completedDrillIds.length} / {commandDrillsData.length} drills
            validés
          </span>
        </Pill>

        <CultSpringTabs
          items={TIER_TABS}
          value={selectedDifficulty}
          onChange={(lvl) => {
            setSelectedDifficulty(lvl);
            const first = commandDrillsData.find(
              (d) => lvl === "All" || d.difficulty === lvl
            );
            if (first) setSelectedDrillId(first.id);
          }}
          layoutId="drills-tier-spring-tabs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drill List with Inspira UI 3D Tilt Cards & AutoAnimate */}
        <div
          ref={listParentRef}
          className="lg:col-span-4 space-y-2.5 max-h-[580px] overflow-y-auto pr-1"
        >
          {filteredDrills.map((drill, idx) => {
            const isSelected = drill.id === activeDrill.id;
            const isDone = completedDrillIds.includes(drill.id);
            return (
              <Card3DTilt
                key={drill.id}
                active={isSelected}
                onClick={() => setSelectedDrillId(drill.id)}
                className="cursor-pointer p-3.5"
              >
                <div className="flex items-center justify-between gap-3">
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
                </div>
              </Card3DTilt>
            );
          })}
        </div>

        {/* Right Interactive Command Console (Magic UI BorderBeam + React Bits Aurora + Inspira UI) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="relative overflow-hidden">
            <BorderBeam
              size={220}
              duration={12}
              colorFrom="#6366f1"
              colorTo="#10b981"
            />
            <AuroraTerminalBg intensity="subtle" />

            <CardHeader className="relative z-10 flex flex-row flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-muted/30 border-b border-border space-y-0">
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

            <CardContent className="relative z-10 p-6 space-y-5">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-muted-foreground">
                  Mission CLI · JetBrains Mono
                </span>
                <h2 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
                  {activeDrill.prompt}
                </h2>
              </div>

              {/* Interactive Input Box with Inspira UI GlowButton + Shake/Pop Animation */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <motion.div
                  animate={
                    status === "wrong"
                      ? { x: [-9, 9, -7, 7, -4, 4, 0] }
                      : status === "correct"
                      ? { scale: [1, 1.015, 1] }
                      : { x: 0, scale: 1 }
                  }
                  transition={{ duration: 0.35 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl bg-background/90 border font-mono text-sm transition-colors",
                    status === "correct"
                      ? "border-emerald-500/70 shadow-[0_0_20px_-5px_rgba(16,185,129,0.35)]"
                      : status === "wrong"
                      ? "border-rose-500/70"
                      : "border-border focus-within:border-indigo-500/60"
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
                    placeholder="Tapez la commande Git exacte et appuyez sur Entrée..."
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none font-mono"
                    autoFocus
                  />
                  <GlowButton
                    type="submit"
                    variant={
                      status === "correct" || status === "revealed"
                        ? "emerald"
                        : "indigo"
                    }
                    size="sm"
                  >
                    {status === "correct" || status === "revealed" ? (
                      <>
                        <span>Drill suivant</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Tester la commande</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </GlowButton>
                </motion.div>
              </form>

              {/* Helper Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? "Masquer l'indice" : "Afficher un indice"}
                </button>

                <div className="flex items-center gap-3">
                  {status !== "correct" && status !== "revealed" && (
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      className="text-xs font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Voir la solution
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextDrill}
                    className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Passer au suivant
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200">
                  Indice : {activeDrill.hint}
                </div>
              )}

              {/* Feedback with Inspira UI Typewriter & Kibo UI Snippet */}
              {(status === "correct" || status === "revealed") && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {status === "correct"
                        ? `Commande validée (+${Math.round(
                            activeDrill.xpReward * streakMultiplier
                          )} XP)`
                        : "Solution canonique"}
                    </span>
                  </div>

                  <Snippet defaultValue="output">
                    <SnippetHeader>
                      <SnippetTabsList className="h-7">
                        <SnippetTabsTrigger value="output">
                          Sortie Terminal (Typewriter)
                        </SnippetTabsTrigger>
                        <SnippetTabsTrigger value="command">
                          Commande Canonique
                        </SnippetTabsTrigger>
                      </SnippetTabsList>
                      <SnippetCopyButton value={activeDrill.canonicalCommand} />
                    </SnippetHeader>
                    <SnippetTabsContent value="output">
                      <TypewriterTerminalText
                        text={`$ ${activeDrill.canonicalCommand}\n${activeDrill.simulatedOutput}`}
                        speed={12}
                        showCursor
                      />
                    </SnippetTabsContent>
                    <SnippetTabsContent value="command">
                      {`$ ${activeDrill.canonicalCommand}`}
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
                    <span>
                      Syntaxe incorrecte (enregistrée dans le Post-Mortem)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Votre saisie :{" "}
                    <code className="text-rose-300">{lastAttempt}</code>
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
