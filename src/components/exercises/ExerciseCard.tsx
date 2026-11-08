"use client";

import React, { useState } from "react";
import { ExerciseScenario } from "@/types/course";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  Play,
  Terminal,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import confetti from "canvas-confetti";

interface ExerciseCardProps {
  exercise: ExerciseScenario;
  isSolved: boolean;
  onToggleSolved: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isSolved,
  onToggleSolved,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [userCommand, setUserCommand] = useState("");
  const [validationFeedback, setValidationFeedback] = useState<{
    status: "idle" | "success" | "partial" | "error";
    message: string;
  }>({ status: "idle", message: "" });

  const difficultyVariant =
    exercise.difficulty === "Débutant"
      ? "emerald"
      : exercise.difficulty === "Intermédiaire"
      ? "gold"
      : "rose";

  const handleRevealHint = () => {
    if (hintsRevealed < exercise.hints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  const handleTestCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCommand.trim()) return;

    const pattern = new RegExp(exercise.validationCriteria.commandPattern || "", "i");
    const isPatternMatched = pattern.test(userCommand);

    if (isPatternMatched) {
      setValidationFeedback({
        status: "success",
        message:
          "✓ Bravo ! Commande exacte ou très proche de la solution recommandée.",
      });
      if (!isSolved) {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#10B981", "#F59E0B"],
        });
        onToggleSolved(exercise.id);
      }
    } else {
      setValidationFeedback({
        status: "partial",
        message:
          "Syntaxes différentes détectées. Vérifiez la commande ou consultez un indice ci-dessous !",
      });
    }
  };

  const handleSolvedClick = () => {
    if (!isSolved) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#10B981", "#06B6D4", "#F59E0B"],
      });
    }
    onToggleSolved(exercise.id);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0F121C]/80 backdrop-blur-xl p-6 shadow-subtle-card space-y-5 transition-all">
      {/* Exercise Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={difficultyVariant}>{exercise.difficulty}</Badge>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs font-mono text-cyan-400">{exercise.category}</span>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs text-zinc-400">Durée : {exercise.duration}</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100">{exercise.title}</h3>
        </div>

        <button
          onClick={handleSolvedClick}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
            isSolved
              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200 hover:border-amber-500/40"
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${isSolved ? "text-emerald-400" : "text-zinc-500"}`} />
          {isSolved ? "Exercice Résolu ✓" : "Marquer comme résolu"}
        </button>
      </div>

      {/* Context & Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 space-y-1">
          <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
            Contexte Métier Réel :
          </span>
          <p className="text-zinc-300 leading-relaxed">{exercise.context}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
          <span className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">
            Problème & Blocage :
          </span>
          <p className="text-rose-200 leading-relaxed">{exercise.problem}</p>
        </div>
      </div>

      {/* Objective Goal */}
      <div className="p-3 px-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-200">
        <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <div>
          <strong className="text-cyan-300">Objectif à atteindre :</strong> {exercise.goal}
        </div>
      </div>

      {/* Interactive Command Validator */}
      <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            Testeur de commande / solution :
          </span>
          <span className="text-zinc-500 text-[10px]">Tapez la commande Git/DevOps attendue</span>
        </div>
        <form onSubmit={handleTestCommand} className="flex gap-2">
          <input
            type="text"
            value={userCommand}
            onChange={(e) => setUserCommand(e.target.value)}
            placeholder="Ex: git merge ..., git switch -c ..., git rebase ..."
            className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500"
          />
          <Button type="submit" variant="primary" size="sm">
            Valider
          </Button>
        </form>

        {validationFeedback.status !== "idle" && (
          <div
            className={`p-2 rounded-lg text-xs font-sans ${
              validationFeedback.status === "success"
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-950/40 text-amber-300 border border-amber-500/30"
            }`}
          >
            {validationFeedback.message}
          </div>
        )}
      </div>

      {/* Hints (Progressive Unveiling) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleRevealHint}
            disabled={hintsRevealed >= exercise.hints.length}
            className="text-xs text-amber-400 hover:text-amber-300 disabled:text-zinc-600 font-semibold flex items-center gap-1 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {hintsRevealed >= exercise.hints.length
              ? "Tous les indices ont été dévoilés"
              : `Dévoiler un indice progressif (${hintsRevealed}/${exercise.hints.length})`}
          </button>
        </div>

        {hintsRevealed > 0 && (
          <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/50">
            {exercise.hints.slice(0, hintsRevealed).map((hint, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/60 text-xs text-amber-200/90">
                💡 <strong>Indice {idx + 1} :</strong> {hint}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step by Step Solution Accordion */}
      <div className="pt-2 border-t border-zinc-800">
        <button
          onClick={() => setShowSolution(!showSolution)}
          className="w-full flex items-center justify-between py-2 text-xs font-semibold text-zinc-300 hover:text-amber-400 transition-colors"
        >
          <span>{showSolution ? "Masquer la solution détaillée" : "Afficher la solution complète pas à pas"}</span>
          {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSolution && (
          <div className="mt-3 space-y-3 pt-3 border-t border-zinc-800/80">
            {exercise.stepByStepSolution.map((step) => (
              <div key={step.step} className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center border border-amber-500/30">
                    {step.step}
                  </span>
                  <span className="text-xs font-bold text-zinc-100">{step.title}</span>
                </div>

                {step.command && (
                  <pre className="p-2.5 rounded-lg bg-black text-cyan-300 font-mono text-[11px] overflow-x-auto border border-zinc-800">
                    $ {step.command}
                  </pre>
                )}

                <p className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                  {step.explanation}
                </p>
              </div>
            ))}

            {/* Trap Callout */}
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-300 font-bold mb-0.5">Le piège à éviter :</strong>
                <span>{exercise.trapToAvoid}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
