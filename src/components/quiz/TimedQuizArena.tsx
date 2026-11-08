"use client";

import React, { useState, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { timedQuizData } from "@/data/timedQuizData";
import {
  TimedQuizQuestion,
  DifficultyLevel,
  MistakeRecord,
} from "@/types/game";
import {
  Timer,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Play,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Pill,
  PillStatus,
  PillIndicator,
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/ui/kibo-ui";
import { BorderBeam } from "@/components/ui/magic-ui";
import { Card3DTilt, GlowButton } from "@/components/ui/inspira-ui";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface TimedQuizArenaProps {
  currentStreak: number;
  onCorrectAnswer: (pointsEarned: number) => void;
  onWrongAnswer: (mistake: Omit<MistakeRecord, "id" | "timestamp">) => void;
  onCompletePerfectQuiz: () => void;
}

interface SessionMistake {
  question: TimedQuizQuestion;
  chosenIndex: number | null;
}

export const TimedQuizArena: React.FC<TimedQuizArenaProps> = ({
  currentStreak,
  onCorrectAnswer,
  onWrongAnswer,
  onCompletePerfectQuiz,
}) => {
  const [selectedTier, setSelectedTier] = useState<DifficultyLevel | "All">(
    "Junior"
  );
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
  const [recapListRef] = useAutoAnimate<HTMLDivElement>();

  const activeQuestion = questionPool[currentIdx];

  const startQuiz = (
    tier: DifficultyLevel | "All",
    customPool?: TimedQuizQuestion[]
  ) => {
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
      userAnswer: "Timeout (Temps écoulé)",
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
        particleCount: 28,
        spread: 45,
        origin: { y: 0.8 },
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
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
        });
      }
    }
  };

  if (!isPlaying) {
    const tiers: {
      level: DifficultyLevel | "All";
      title: string;
      desc: string;
      timeLabel: string;
      pointsLabel: string;
      badge: "emerald" | "amber" | "rose" | "blue";
    }[] = [
      {
        level: "Junior",
        title: "Junior DevOps Tier",
        desc: "Les 3 zones locales Git, snapshots SHA-1, pull vs fetch, principes CAMS, REST Stateless et DVCS vs CVCS.",
        timeLabel: "30s / question",
        pointsLabel: "100 XP + Bonus Vitesse",
        badge: "emerald",
      },
      {
        level: "Mid",
        title: "Mid Engineer Tier",
        desc: "Diff --staged, Fast-Forward vs 3-Way Merge, modes Reset, Commit --amend, GitFlow vs Trunk-Based et GitLab CI.",
        timeLabel: "35s / question",
        pointsLabel: "150 XP + Bonus Vitesse",
        badge: "amber",
      },
      {
        level: "DevOps Lead",
        title: "DevOps Lead Tier",
        desc: "Rebase --onto, pièges Detached HEAD, workflows noyau Linux, Cherry-Pick, Règle d'Or du Rebase et GitLab Runners.",
        timeLabel: "40s / question",
        pointsLabel: "200 XP + Bonus Vitesse",
        badge: "rose",
      },
      {
        level: "All",
        title: "Marathon Intégral (24 Questions)",
        desc: "Enchaînez les 24 questions Junior, Mid et DevOps Lead dans un benchmark complet chronométré.",
        timeLabel: "30-40s / question",
        pointsLabel: "Score Maximum",
        badge: "blue",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((t) => (
          <Card3DTilt
            key={t.level}
            className="flex flex-col justify-between"
          >
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant={t.badge}>{t.level}</Badge>
                <Pill variant="outline" className="text-xs py-0.5">
                  <Timer className="w-3 h-3 text-amber-400" />
                  <span className="font-mono">{t.timeLabel}</span>
                </Pill>
              </div>
              <CardTitle className="text-lg">{t.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                {t.desc}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {t.pointsLabel}
              </span>
              <GlowButton
                type="button"
                onClick={() => {
                  setSelectedTier(t.level);
                  startQuiz(t.level);
                }}
                variant="indigo"
                size="sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Lancer le chrono</span>
              </GlowButton>
            </CardFooter>
          </Card3DTilt>
        ))}
      </div>
    );
  }

  if (isFinished) {
    const accuracy = Math.round((sessionCorrect / questionPool.length) * 100);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="relative overflow-hidden p-8 text-center space-y-5">
          <BorderBeam
            size={200}
            duration={12}
            colorFrom="#10b981"
            colorTo="#6366f1"
          />
          <div className="w-12 h-12 mx-auto rounded-xl bg-secondary border border-border flex items-center justify-center text-emerald-400">
            <Trophy className="w-6 h-6" />
          </div>

          <div>
            <Badge variant={accuracy >= 80 ? "emerald" : "amber"}>
              Niveau : {selectedTier} · Précision {accuracy}%
            </Badge>
            <h2 className="text-2xl font-bold text-foreground mt-2">
              Bilan de l&apos;Évaluation Chronométrée
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto font-mono">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <span className="text-[10px] text-muted-foreground block">
                XP Gagnés
              </span>
              <span className="text-xl font-bold text-emerald-400">
                +{sessionScore} XP
              </span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <span className="text-[10px] text-muted-foreground block">
                Réussite
              </span>
              <span className="text-xl font-bold text-sky-400">
                {sessionCorrect}/{questionPool.length}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <span className="text-[10px] text-muted-foreground block">
                Erreurs
              </span>
              <span className="text-xl font-bold text-rose-400">
                {sessionMistakes.length}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {sessionMistakes.length > 0 && (
              <GlowButton
                type="button"
                onClick={() =>
                  startQuiz(
                    selectedTier,
                    sessionMistakes.map((m) => m.question)
                  )
                }
                variant="indigo"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rejouer les {sessionMistakes.length} erreur(s)</span>
              </GlowButton>
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
        </Card>

        {sessionMistakes.length > 0 && (
          <div ref={recapListRef} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-rose-400 font-mono">
              <AlertTriangle className="w-4 h-4" />
              Récapitulatif détaillé des erreurs ({sessionMistakes.length})
            </div>

            {sessionMistakes.map((item, idx) => (
              <Card key={idx} className="p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <Badge variant="rose">{item.question.difficulty}</Badge>
                  <span className="font-mono text-muted-foreground">
                    {item.question.category}
                  </span>
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {item.question.question}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                    <span className="text-[10px] block text-rose-400 font-semibold mb-1">
                      ✗ Votre réponse :
                    </span>
                    {item.chosenIndex === null
                      ? "Timeout"
                      : item.question.options[item.chosenIndex]}
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    <span className="text-[10px] block text-emerald-400 font-semibold mb-1">
                      ✓ Réponse attendue :
                    </span>
                    {item.question.options[item.question.correctIndex]}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed pt-1">
                  {item.question.explanation}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const timerPercent = Math.round(
    (timeLeft / activeQuestion.timeLimitSec) * 100
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Top Status Bar */}
      <Card className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsPlaying(false)}
            variant="outline"
            size="sm"
          >
            ← Quitter
          </Button>
          <Badge
            variant={
              activeQuestion.difficulty === "Junior"
                ? "emerald"
                : activeQuestion.difficulty === "Mid"
                ? "amber"
                : "rose"
            }
          >
            {activeQuestion.difficulty}
          </Badge>
          <span className="text-xs font-mono text-muted-foreground">
            {activeQuestion.category}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Pill variant="outline" className="py-0.5">
            <PillStatus>
              <PillIndicator variant="info" />
              <span>
                {currentIdx + 1}/{questionPool.length}
              </span>
            </PillStatus>
            <span className="text-emerald-400 font-semibold">
              +{sessionScore} XP
            </span>
          </Pill>

          <Status
            status={
              timeLeft <= 7
                ? "offline"
                : timeLeft <= 15
                ? "degraded"
                : "online"
            }
          >
            <StatusIndicator />
            <StatusLabel className="font-mono font-semibold text-foreground">
              {timeLeft}s
            </StatusLabel>
          </Status>
        </div>
      </Card>

      {/* shadcn/ui Progress Component */}
      <Progress value={timerPercent} />

      {/* Question Card with Magic UI BorderBeam */}
      <Card className="relative overflow-hidden p-6 space-y-5">
        <BorderBeam
          size={200}
          duration={14}
          colorFrom="#6366f1"
          colorTo="#38bdf8"
        />
        <h2 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed">
          {activeQuestion.question}
        </h2>

        {activeQuestion.codeSnippet && (
          <pre className="p-3.5 rounded-lg bg-secondary/70 border border-border font-mono text-xs text-sky-300 overflow-x-auto">
            {activeQuestion.codeSnippet}
          </pre>
        )}

        <div className="space-y-2.5">
          {activeQuestion.options.map((opt, idx) => {
            const isCorrectOpt = idx === activeQuestion.correctIndex;
            const isSelected = selectedOpt === idx;

            let styleClass =
              "border-border bg-background/60 hover:bg-accent hover:text-accent-foreground";

            if (isLocked) {
              if (isCorrectOpt) {
                styleClass =
                  "border-emerald-500/60 bg-emerald-500/10 text-emerald-200 font-medium";
              } else if (isSelected && !isCorrectOpt) {
                styleClass = "border-rose-500/60 bg-rose-500/10 text-rose-200";
              } else {
                styleClass =
                  "border-border/50 bg-background/30 text-muted-foreground opacity-60";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleChooseOption(idx)}
                disabled={isLocked}
                className={cn(
                  "w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-colors flex items-start gap-3",
                  styleClass
                )}
              >
                <span className="w-6 h-6 rounded-md bg-secondary border border-border font-mono text-xs font-semibold flex items-center justify-center shrink-0 text-foreground">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 leading-relaxed">{opt}</span>
                {isLocked && isCorrectOpt && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isLocked && isSelected && !isCorrectOpt && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {isLocked && (
          <div
            className={cn(
              "p-4 rounded-xl border space-y-3 text-xs",
              selectedOpt === activeQuestion.correctIndex
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                : "bg-rose-500/10 border-rose-500/30 text-rose-200"
            )}
          >
            <div className="font-semibold">
              {selectedOpt === activeQuestion.correctIndex
                ? "✓ Bonne réponse !"
                : selectedOpt === -1
                ? "Temps écoulé — enregistré dans le Post-Mortem"
                : "✗ Mauvaise réponse — enregistrée dans le Post-Mortem"}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {activeQuestion.explanation}
            </p>
            <div className="flex justify-end">
              <GlowButton
                type="button"
                onClick={handleNextQuestion}
                variant="indigo"
                size="sm"
              >
                <span>
                  {currentIdx + 1 === questionPool.length
                    ? "Voir le bilan"
                    : "Question suivante"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </GlowButton>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
