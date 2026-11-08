"use client";

import React, { useState, useEffect } from "react";
import { timedQuizData } from "@/data/timedQuizData";
import {
  TimedQuizQuestion,
  DifficultyLevel,
  MistakeRecord,
} from "@/types/game";
import {
  Timer,
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Play,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface TimedQuizArenaProps {
  currentStreak: number;
  onCorrectAnswer: (pointsEarned: number) => void;
  onWrongAnswer: (mistake: Omit<MistakeRecord, "id" | "timestamp">) => void;
  onCompletePerfectQuiz: () => void;
}

interface SessionMistake {
  question: TimedQuizQuestion;
  chosenIndex: number | null; // null if timeout
}

export const TimedQuizArena: React.FC<TimedQuizArenaProps> = ({
  currentStreak,
  onCorrectAnswer,
  onWrongAnswer,
  onCompletePerfectQuiz,
}) => {
  const [selectedTier, setSelectedTier] = useState<DifficultyLevel | "All">("Junior");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [questionPool, setQuestionPool] = useState<TimedQuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [sessionCorrect, setSessionCorrect] = useState<number>(0);
  const [sessionMistakes, setSessionMistakes] = useState<SessionMistake[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const activeQuestion = questionPool[currentIdx];

  const startQuiz = (tier: DifficultyLevel | "All", customPool?: TimedQuizQuestion[]) => {
    const pool =
      customPool ||
      timedQuizData.filter((q) => tier === "All" || q.difficulty === tier);
    setQuestionPool(pool);
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsLocked(false);
    setTimeLeft(pool[0]?.timeLimitSec || 30);
    setSessionScore(0);
    setSessionCorrect(0);
    setSessionMistakes([]);
    setIsFinished(false);
    setIsPlaying(true);
  };

  // Countdown timer effect
  useEffect(() => {
    if (!isPlaying || isLocked || isFinished || !activeQuestion) return;

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isLocked, isFinished, timeLeft, activeQuestion]);

  const handleTimeout = () => {
    if (!activeQuestion || isLocked) return;
    setIsLocked(true);
    setSelectedOpt(-1);

    setSessionMistakes((prev) => [
      ...prev,
      { question: activeQuestion, chosenIndex: null },
    ]);

    onWrongAnswer({
      mode: "quiz",
      difficulty: activeQuestion.difficulty,
      category: activeQuestion.category,
      prompt: activeQuestion.question,
      userAnswer: "⏱ Temps écoulé (Timeout)",
      correctAnswer: activeQuestion.options[activeQuestion.correctIndex],
      explanation: activeQuestion.explanation,
    });
  };

  const handleChooseOption = (optIdx: number) => {
    if (isLocked || !activeQuestion) return;
    setSelectedOpt(optIdx);
    setIsLocked(true);

    const isCorrect = optIdx === activeQuestion.correctIndex;
    if (isCorrect) {
      const speedBonus = Math.round(
        (timeLeft / activeQuestion.timeLimitSec) * 60
      );
      const streakMult = currentStreak >= 4 ? 1.5 : 1;
      const earned = Math.round(
        (activeQuestion.basePoints + speedBonus) * streakMult
      );

      setSessionScore((s) => s + earned);
      setSessionCorrect((c) => c + 1);
      onCorrectAnswer(earned);

      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#10b981", "#f59e0b"],
      });
    } else {
      setSessionMistakes((prev) => [
        ...prev,
        { question: activeQuestion, chosenIndex: optIdx },
      ]);

      onWrongAnswer({
        mode: "quiz",
        difficulty: activeQuestion.difficulty,
        category: activeQuestion.category,
        prompt: activeQuestion.question,
        userAnswer: activeQuestion.options[optIdx],
        correctAnswer: activeQuestion.options[activeQuestion.correctIndex],
        explanation: activeQuestion.explanation,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questionPool.length) {
      const nextQ = questionPool[currentIdx + 1];
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setIsLocked(false);
      setTimeLeft(nextQ.timeLimitSec);
    } else {
      setIsFinished(true);
      if (sessionMistakes.length === 0 && questionPool.length >= 4) {
        onCompletePerfectQuiz();
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#f59e0b", "#10b981", "#06b6d4"],
        });
      }
    }
  };

  // Lobby Selection Screen
  if (!isPlaying) {
    const tiers: {
      level: DifficultyLevel | "All";
      title: string;
      desc: string;
      timeLabel: string;
      pointsLabel: string;
      badge: "emerald" | "gold" | "rose" | "cyan";
    }[] = [
      {
        level: "Junior",
        title: "Niveau Junior DevOps",
        desc: "Les 3 zones Git, snapshots SHA-1, pull vs fetch, principes CAMS, REST Stateless et conteneurs vs VM.",
        timeLabel: "30s / question",
        pointsLabel: "100 XP + Bonus vitesse",
        badge: "emerald",
      },
      {
        level: "Mid",
        title: "Niveau Mid Engineer",
        desc: "Diff --staged, Fast-Forward vs 3-Way Merge, modes de Reset, Git Flow vs Trunk-Based, GitLab CI et réseaux Bridge.",
        timeLabel: "35s / question",
        pointsLabel: "150 XP + Bonus vitesse",
        badge: "gold",
      },
      {
        level: "DevOps Lead",
        title: "Niveau DevOps Lead",
        desc: "Rebase --onto, pièges Detached HEAD, workflows Linux, pilotes macvlan/overlay, DNS Service Discovery et cache layers.",
        timeLabel: "40s / question",
        pointsLabel: "200 XP + Bonus vitesse",
        badge: "rose",
      },
      {
        level: "All",
        title: "Marathon Complet (24 Questions)",
        desc: "Enchaînez l'intégralité des 24 questions Junior, Mid et DevOps Lead sous pression chronométrée.",
        timeLabel: "30-40s / question",
        pointsLabel: "Score Maximum",
        badge: "cyan",
      },
    ];

    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="p-6 rounded-2xl border border-[#1e2330] bg-[#12151d]/90 backdrop-blur-xl">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
            Mode 3 &bull; Speed &amp; Mastery Timed Quiz
          </span>
          <h1 className="text-2xl font-extrabold text-zinc-100 mt-2">
            Quiz &amp; QCM Chronométrés par Niveau d&apos;Expertise
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sélectionnez votre palier. Chaque bonne réponse rapide multiplie votre score XP et alimente votre Streak. Chaque erreur est analysée dans le rapport Post-Mortem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((t) => (
            <div
              key={t.level}
              className="p-6 rounded-2xl border border-[#1e2330] bg-[#12151d]/90 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant={t.badge}>{t.level}</Badge>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    {t.timeLabel}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-zinc-100">{t.title}</h2>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1e2330]">
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {t.pointsLabel}
                </span>
                <Button
                  onClick={() => {
                    setSelectedTier(t.level);
                    startQuiz(t.level);
                  }}
                  variant="primary"
                  size="sm"
                  icon={<Play className="w-3.5 h-3.5 fill-current" />}
                >
                  Lancer le Chrono
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Post-Match Detailed Summary & Error Recap
  if (isFinished) {
    const accuracy = Math.round((sessionCorrect / questionPool.length) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl border border-[#1e2330] bg-[#12151d]/95 text-center space-y-5 shadow-subtle-card">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-gold-glow">
            <Trophy className="w-7 h-7" />
          </div>

          <div>
            <Badge variant={accuracy >= 80 ? "emerald" : "gold"}>
              Palier : {selectedTier} &bull; Précision {accuracy}%
            </Badge>
            <h2 className="text-2xl font-extrabold text-zinc-100 mt-2">
              Bilan du Sprint Chronométré
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto font-mono">
            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2330]">
              <span className="text-[10px] text-zinc-500 uppercase block">Score Gagné</span>
              <span className="text-xl font-extrabold text-amber-400">+{sessionScore} XP</span>
            </div>
            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2330]">
              <span className="text-[10px] text-zinc-500 uppercase block">Bonnes Réponses</span>
              <span className="text-xl font-extrabold text-emerald-400">
                {sessionCorrect}/{questionPool.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#090a0f] border border-[#1e2330]">
              <span className="text-[10px] text-zinc-500 uppercase block">Erreurs</span>
              <span className="text-xl font-extrabold text-red-400">
                {sessionMistakes.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {sessionMistakes.length > 0 && (
              <Button
                onClick={() =>
                  startQuiz(
                    selectedTier,
                    sessionMistakes.map((m) => m.question)
                  )
                }
                variant="primary"
                size="sm"
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Re-tester uniquement mes {sessionMistakes.length} erreur(s)
              </Button>
            )}
            <Button
              onClick={() => startQuiz(selectedTier)}
              variant="secondary"
              size="sm"
            >
              Recommencer ce niveau
            </Button>
            <Button
              onClick={() => setIsPlaying(false)}
              variant="outline"
              size="sm"
            >
              Changer de niveau
            </Button>
          </div>
        </div>

        {/* Detailed Error Recap Section */}
        {sessionMistakes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-red-400 font-mono uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              Récapitulatif Détaillé des Erreurs ({sessionMistakes.length})
            </div>

            {sessionMistakes.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-red-500/30 bg-[#12151d]/95 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="rose">{item.question.difficulty}</Badge>
                  <span className="font-mono text-zinc-400">
                    {item.question.category}
                  </span>
                </div>
                <div className="text-sm font-bold text-zinc-100">
                  {item.question.question}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300">
                    <span className="text-[10px] uppercase block text-red-400 font-bold mb-1">
                      ✗ Votre réponse :
                    </span>
                    {item.chosenIndex === null
                      ? "Temps écoulé (Timeout)"
                      : item.question.options[item.chosenIndex]}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300">
                    <span className="text-[10px] uppercase block text-emerald-400 font-bold mb-1">
                      ✓ Réponse attendue :
                    </span>
                    {item.question.options[item.question.correctIndex]}
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed pt-1">
                  💡 <strong>Explication technique :</strong> {item.question.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active Timed Question Screen
  const timerPercent = Math.round(
    (timeLeft / activeQuestion.timeLimitSec) * 100
  );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-[#1e2330] bg-[#12151d]/90">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(false)}
            className="text-xs font-mono text-zinc-400 hover:text-zinc-200 px-2.5 py-1 rounded-lg bg-[#090a0f] border border-[#1e2330]"
          >
            ← Quitter
          </button>
          <Badge
            variant={
              activeQuestion.difficulty === "Junior"
                ? "emerald"
                : activeQuestion.difficulty === "Mid"
                ? "gold"
                : "rose"
            }
          >
            {activeQuestion.difficulty}
          </Badge>
          <span className="text-xs font-mono text-zinc-400">
            {activeQuestion.category}
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <span className="text-zinc-400">
            Question{" "}
            <strong className="text-zinc-100">
              {currentIdx + 1}/{questionPool.length}
            </strong>
          </span>
          <span className="text-amber-400 font-bold">
            Session : +{sessionScore} XP
          </span>
          <div
            className={cn(
              "px-3 py-1 rounded-lg border font-bold flex items-center gap-1.5",
              timeLeft <= 7
                ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                : timeLeft <= 15
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
                : "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
            )}
          >
            <Timer className="w-3.5 h-3.5" />
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-2 rounded-full bg-[#12151d] overflow-hidden border border-[#1e2330]">
        <div
          className={cn(
            "h-full transition-all duration-1000 rounded-full",
            timeLeft <= 7
              ? "bg-red-500"
              : timeLeft <= 15
              ? "bg-amber-500"
              : "bg-gradient-to-r from-amber-400 to-emerald-400"
          )}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Question Card */}
      <motion.div
        key={activeQuestion.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-[#1e2330] bg-[#12151d]/95 space-y-5 shadow-subtle-card"
      >
        <h2 className="text-base sm:text-lg font-bold text-zinc-100 leading-relaxed">
          {activeQuestion.question}
        </h2>

        {activeQuestion.codeSnippet && (
          <pre className="p-3.5 rounded-xl bg-[#090a0f] border border-[#1e2330] font-mono text-xs text-amber-300 overflow-x-auto">
            {activeQuestion.codeSnippet}
          </pre>
        )}

        <div className="space-y-2.5">
          {activeQuestion.options.map((opt, idx) => {
            const isCorrectOpt = idx === activeQuestion.correctIndex;
            const isSelected = selectedOpt === idx;

            let styleClass =
              "border-[#1e2330] bg-[#090a0f]/70 hover:bg-[#161b26] hover:border-zinc-700 text-zinc-200";

            if (isLocked) {
              if (isCorrectOpt) {
                styleClass =
                  "border-emerald-500/70 bg-emerald-950/30 text-emerald-200 font-semibold";
              } else if (isSelected && !isCorrectOpt) {
                styleClass = "border-red-500/70 bg-red-950/30 text-red-200";
              } else {
                styleClass =
                  "border-[#1e2330]/50 bg-[#090a0f]/30 text-zinc-500 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleChooseOption(idx)}
                disabled={isLocked}
                className={cn(
                  "w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3",
                  styleClass
                )}
              >
                <span className="w-6 h-6 rounded-lg bg-[#12151d] border border-[#1e2330] font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 text-amber-400">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
                {isLocked && isCorrectOpt && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                {isLocked && isSelected && !isCorrectOpt && (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback & Next Button */}
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-4 rounded-xl border space-y-3 text-xs",
              selectedOpt === activeQuestion.correctIndex
                ? "bg-emerald-950/25 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/25 border-red-500/40 text-red-200"
            )}
          >
            <div className="flex items-center justify-between font-bold">
              <span>
                {selectedOpt === activeQuestion.correctIndex
                  ? "✓ Excellente réponse !"
                  : selectedOpt === -1
                  ? "⏱ Temps écoulé ! Question enregistrée dans le Journal d'Erreurs."
                  : "✗ Réponse incorrecte — enregistrée dans le Journal d'Erreurs."}
              </span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              {activeQuestion.explanation}
            </p>
            <div className="flex justify-end">
              <Button
                onClick={handleNextQuestion}
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                {currentIdx + 1 === questionPool.length
                  ? "Voir le Bilan & Récapitulatif"
                  : "Question Suivante"}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
