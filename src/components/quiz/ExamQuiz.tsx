"use client";

import React, { useState } from "react";
import { quizQuestions } from "./quizData";
import { QuizQuestion } from "@/types/course";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import confetti from "canvas-confetti";

export const ExamQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ: QuizQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted[currentIndex]) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleValidateCurrent = () => {
    if (selectedAnswers[currentIndex] === undefined) return;
    setIsSubmitted((prev) => ({ ...prev, [currentIndex]: true }));

    const isCorrect = selectedAnswers[currentIndex] === currentQ.correctIndex;
    if (isCorrect) {
      confetti({
        particleCount: 35,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#10B981", "#06B6D4"],
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#F59E0B", "#10B981", "#06B6D4"],
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsSubmitted({});
    setCurrentIndex(0);
    setQuizFinished(false);
  };

  // Score computation
  const correctCount = Object.entries(selectedAnswers).filter(([qIdx, ansIdx]) => {
    return quizQuestions[parseInt(qIdx, 10)]?.correctIndex === ansIdx;
  }).length;

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  if (quizFinished) {
    const isPassed = scorePercentage >= 70;
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl border border-zinc-800 bg-[#0F121C]/90 backdrop-blur-xl shadow-subtle-card text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shadow-gold-glow">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant={isPassed ? "emerald" : "gold"}>
            {isPassed ? "Certification DevOps & Git Obtenue" : "Examen Blanc Terminé"}
          </Badge>
          <h2 className="text-2xl font-bold text-zinc-100">Résultat de votre Évaluation</h2>
          <p className="text-sm text-zinc-400">
            Basé sur le programme d&apos;examen &laquo; Plateformes Collaboratives - DevOps &amp; Git &raquo; (ISIMS).
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 inline-block min-w-[240px]">
          <div className="text-4xl font-extrabold font-mono text-zinc-100">
            {correctCount} / {totalQuestions}
          </div>
          <div
            className={`text-sm font-bold mt-1 ${
              isPassed ? "text-emerald-400" : "text-amber-400"
            }`}
          >
            {scorePercentage}% de réponses correctes
          </div>
        </div>

        <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
          {isPassed
            ? "Félicitations ! Vous maîtrisez les concepts fondamentaux et avancés : culture CAMS, 3 zones Git, Fast-Forward, Rebase, GitLab CI et conteneurs Docker."
            : "Bonne tentative ! Certains concepts (Rebase vs Merge, Service Discovery Docker, Stateless REST) méritent une relecture des fiches de cours correspondantes."}
        </p>

        <div className="flex justify-center gap-3 pt-4">
          <Button onClick={handleRestart} variant="primary" icon={<RotateCcw className="w-4 h-4" />}>
            Recommencer le Test
          </Button>
        </div>
      </div>
    );
  }

  const isCurrentSubmitted = isSubmitted[currentIndex];
  const userSelectedOption = selectedAnswers[currentIndex];
  const isCorrect = userSelectedOption === currentQ.correctIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <div>
          <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
            Examen Blanc &bull; Contrôle des Connaissances
          </span>
          <h2 className="text-lg font-bold text-zinc-100">
            Certification DevOps &amp; Versioning Git (ISIMS)
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400">
            Question <strong className="text-amber-400">{currentIndex + 1}</strong> sur {totalQuestions}
          </span>
          <Badge variant="cyan">Chapitre {currentQ.chapterId}</Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-cyan-400 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0F121C]/90 backdrop-blur-xl shadow-subtle-card space-y-5">
        <h3 className="text-base font-semibold text-zinc-100 leading-snug">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, oIdx) => {
            const isChosen = userSelectedOption === oIdx;
            const isCorrectOption = oIdx === currentQ.correctIndex;

            let optionStyle =
              "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/90 hover:border-zinc-700 text-zinc-300";

            if (isCurrentSubmitted) {
              if (isCorrectOption) {
                optionStyle = "border-emerald-500/60 bg-emerald-950/30 text-emerald-200 font-semibold";
              } else if (isChosen && !isCorrectOption) {
                optionStyle = "border-rose-500/60 bg-rose-950/30 text-rose-200";
              } else {
                optionStyle = "border-zinc-850 bg-zinc-950/40 text-zinc-500 opacity-60";
              }
            } else if (isChosen) {
              optionStyle = "border-amber-500/60 bg-amber-950/30 text-amber-200 shadow-gold-glow/10 font-semibold";
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                disabled={isCurrentSubmitted}
                className={`w-full p-4 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0">
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span className="flex-1 mt-0.5 leading-relaxed">{opt}</span>
                {isCurrentSubmitted && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                {isCurrentSubmitted && isChosen && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Validation Button if not yet submitted */}
        {!isCurrentSubmitted && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleValidateCurrent}
              disabled={userSelectedOption === undefined}
              variant="primary"
              size="md"
            >
              Vérifier la Réponse
            </Button>
          </div>
        )}

        {/* Detailed Explanation upon submission */}
        {isCurrentSubmitted && (
          <div
            className={`p-4 rounded-xl border space-y-2 text-xs leading-relaxed ${
              isCorrect
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                : "bg-rose-950/20 border-rose-500/30 text-rose-200"
            }`}
          >
            <div className="flex items-center justify-between font-bold">
              <span>{isCorrect ? "✓ Exact ! Excellente analyse." : "✗ Réponse incorrecte."}</span>
              {currentQ.referenceSlide && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                  Référence : {currentQ.referenceSlide}
                </span>
              )}
            </div>
            <p className="text-zinc-300">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          variant="outline"
          size="sm"
        >
          Question Précédente
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isCurrentSubmitted}
          variant="primary"
          size="sm"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {currentIndex === totalQuestions - 1 ? "Voir les Résultats" : "Question Suivante"}
        </Button>
      </div>
    </div>
  );
};
