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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | DifficultyLevel>("All");
  const [selectedDrillId, setSelectedDrillId] = useState<string>(commandDrillsData[0].id);

  const filteredDrills = commandDrillsData.filter(
    (d) => selectedDifficulty === "All" || d.difficulty === selectedDifficulty
  );

  const activeDrill =
    filteredDrills.find((d) => d.id === selectedDrillId) ||
    filteredDrills[0] ||
    commandDrillsData[0];

  const [inputCmd, setInputCmd] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong" | "revealed">("idle");
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

  const streakMultiplier = currentStreak >= 5 ? 2 : currentStreak >= 3 ? 1.5 : 1;

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
        colors: ["#10b981", "#3b82f6"],
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
    const currentIndex = filteredDrills.findIndex((d) => d.id === activeDrill.id);
    const nextDrill = filteredDrills[(currentIndex + 1) % filteredDrills.length];
    if (nextDrill) {
      setSelectedDrillId(nextDrill.id);
    }
  };

  const handleRevealAnswer = () => {
    setStatus("revealed");
    setInputCmd(activeDrill.canonicalCommand);
  };

  const diffVariant = (d: DifficultyLevel) =>
    d === "Junior" ? "emerald" : d === "Mid" ? "gold" : "rose";

  return (
    <div className="space-y-6">
      {/* Header & Difficulty Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-saas-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">
              Mode 2 &bull; Interactive CLI Command Drills
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {completedDrillIds.length}/{commandDrillsData.length} validés
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">
            Terminal Interactif &mdash; Entraînement Intensif aux Commandes
          </h1>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
          {(["All", "Junior", "Mid", "DevOps Lead"] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedDifficulty(lvl);
                const first = commandDrillsData.find(
                  (d) => lvl === "All" || d.difficulty === lvl
                );
                if (first) setSelectedDrillId(first.id);
              }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all",
                selectedDifficulty === lvl
                  ? "bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {lvl === "All" ? "Tous Niveaux" : lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Drill List (4 cols) */}
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
                    ? "bg-slate-900 border-blue-500/60 shadow-tech-glow"
                    : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                )}
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-slate-500">
                      #{idx + 1}
                    </span>
                    <Badge variant={diffVariant(drill.difficulty)}>
                      {drill.difficulty}
                    </Badge>
                    <span className="text-[10px] font-mono text-emerald-400">
                      +{drill.xpReward} XP
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {drill.scenarioContext}
                  </div>
                </div>
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Interactive Command Console (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <motion.div
            key={activeDrill.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-saas-card"
          >
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 bg-slate-950/80 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  {activeDrill.category} &bull;{" "}
                  <strong className="text-blue-400">{activeDrill.scenarioContext}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                {streakMultiplier > 1 && (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-400" />
                    Multiplicateur x{streakMultiplier}
                  </span>
                )}
                <Badge variant={diffVariant(activeDrill.difficulty)}>
                  {activeDrill.difficulty} (+{activeDrill.xpReward} XP)
                </Badge>
              </div>
            </div>

            {/* Mission Prompt Body */}
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-bold">
                  Mission CLI :
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
                  {activeDrill.prompt}
                </h2>
              </div>

              {/* Interactive Terminal Input Box */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-950 border-2 font-mono text-sm transition-all",
                    status === "correct"
                      ? "border-emerald-500/70 shadow-emerald-glow"
                      : status === "wrong"
                      ? "border-rose-500/70 shadow-rose-glow"
                      : "border-slate-800 focus-within:border-blue-500/70"
                  )}
                >
                  <span className="text-[#10b981] font-bold select-none">
                    devops@drill:~$
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputCmd}
                    onChange={(e) => {
                      setInputCmd(e.target.value);
                      if (status === "wrong") setStatus("idle");
                    }}
                    placeholder="Tapez la commande exacte ici et appuyez sur Entrée..."
                    className="flex-1 bg-transparent text-slate-100 placeholder-slate-600 focus:outline-none font-mono"
                    autoFocus
                  />
                  <Button type="submit" variant="primary" size="sm">
                    {status === "correct" || status === "revealed" ? (
                      <>
                        Suivant <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </>
                    ) : (
                      <>
                        Exécuter <Send className="w-3.5 h-3.5 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Action Helper Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? "Masquer l'indice" : "Afficher un indice"}
                </button>

                <div className="flex items-center gap-3">
                  {status !== "correct" && status !== "revealed" && (
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Révéler la solution
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNextDrill}
                    className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Passer au drill suivant
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="p-3 rounded-xl bg-amber-950/25 border border-amber-500/30 text-xs font-mono text-amber-200">
                  💡 <strong>Indice :</strong> {activeDrill.hint}
                </div>
              )}

              {/* Feedback Output Console */}
              {status === "correct" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#10b981] flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      COMMANDE VALIDÉE ! (+
                      {Math.round(activeDrill.xpReward * streakMultiplier)} XP)
                    </span>
                    <span className="font-mono text-[11px] text-emerald-300">
                      $ {activeDrill.canonicalCommand}
                    </span>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                    {activeDrill.simulatedOutput}
                  </pre>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeDrill.explanation}
                  </p>
                </motion.div>
              )}

              {status === "wrong" && (
                <motion.div
                  initial={{ x: -8 }}
                  animate={{ x: 0 }}
                  className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/40 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-[#f43f5e]">
                    <span className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      Syntaxe ou commande incorrecte (Consignée dans le Journal d&apos;Erreurs)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono">
                    Votre saisie : <code className="text-rose-300">{lastAttempt}</code>
                  </p>
                  <p className="text-xs text-slate-400">
                    Vérifiez les options ou cliquez sur « Afficher un indice » ci-dessus.
                  </p>
                </motion.div>
              )}

              {status === "revealed" && (
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2">
                  <div className="text-xs font-mono text-amber-300 font-bold">
                    Solution canonique : $ {activeDrill.canonicalCommand}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeDrill.explanation}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
