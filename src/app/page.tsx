"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopCommandBar } from "@/components/layout/TopCommandBar";
import {
  AnimatedEngineeringBg,
  WorkspaceOverviewHeader,
} from "@/components/layout/AnimatedEngineeringBg";
import { ProductionArena } from "@/components/arena/ProductionArena";
import { CommandDrillMode } from "@/components/drills/CommandDrillMode";
import { TimedQuizArena } from "@/components/quiz/TimedQuizArena";
import { GitSimulator } from "@/components/simulator/GitSimulator";
import { SkillBadgesAndErrors } from "@/components/gamification/SkillBadgesAndErrors";
import { CultFloatingDock } from "@/components/ui/cult-ui";
import { BorderBeam, Meteors } from "@/components/ui/magic-ui";
import { badgesData } from "@/data/badgesData";
import {
  GameMode,
  PlayerStats,
  ArenaScenario,
  CommandDrill,
  MistakeRecord,
} from "@/types/game";
import { generateShortId } from "@/lib/utils";
import { Award, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const INITIAL_STATS: PlayerStats = {
  xp: 0,
  currentStreak: 0,
  maxStreak: 0,
  solvedArenaIds: [],
  completedDrillIds: [],
  quizPerfectRuns: 0,
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  unlockedBadgeIds: [],
  mistakes: [],
};

function computeUnlockedBadges(stats: PlayerStats): string[] {
  const unlocked = new Set<string>(stats.unlockedBadgeIds);

  if (
    stats.solvedArenaIds.length +
      stats.completedDrillIds.length +
      stats.totalCorrectAnswers >=
    1
  ) {
    unlocked.add("first-blood");
  }
  if (stats.maxStreak >= 3) unlocked.add("streak-3");
  if (stats.maxStreak >= 7) unlocked.add("streak-7");
  if (stats.maxStreak >= 12) unlocked.add("streak-12");

  if (stats.solvedArenaIds.includes("inc-101-detached-head"))
    unlocked.add("detached-survivor");
  if (stats.solvedArenaIds.includes("inc-103-commit-amend"))
    unlocked.add("amend-fixer");
  if (stats.solvedArenaIds.includes("inc-202-3way-merge"))
    unlocked.add("merge-arbiter");
  if (stats.solvedArenaIds.includes("inc-203-stash-context-switch"))
    unlocked.add("stash-ninja");
  if (stats.solvedArenaIds.includes("inc-204-soft-reset-squash"))
    unlocked.add("soft-squasher");
  if (stats.solvedArenaIds.includes("inc-301-linear-rebase"))
    unlocked.add("rebase-surgeon");
  if (stats.solvedArenaIds.includes("inc-405-rebase-onto-surgeon"))
    unlocked.add("onto-specialist");
  if (stats.solvedArenaIds.includes("inc-404-gitflow-hotfix"))
    unlocked.add("hotfix-commander");

  if (stats.completedDrillIds.length >= 10) unlocked.add("drill-sergeant");
  if (stats.completedDrillIds.length >= 24) unlocked.add("drill-overlord");
  if (stats.completedDrillIds.length >= 36) unlocked.add("drill-grandmaster");

  if (stats.quizPerfectRuns >= 1) unlocked.add("quiz-sharpshooter");
  if (stats.xp >= 1500) unlocked.add("xp-1000");
  if (stats.solvedArenaIds.length >= 12) unlocked.add("arena-champion");

  return Array.from(unlocked);
}

export default function DrillChallengePlatform() {
  const [activeMode, setActiveMode] = React.useState<GameMode>("arena");
  const [stats, setStats] = React.useState<PlayerStats>(INITIAL_STATS);
  const [recentBadgeName, setRecentBadgeName] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("devops_drill_arena_stats_v2");
      if (saved) {
        setStats(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    }
  }, []);

  const updateStats = (updater: (prev: PlayerStats) => PlayerStats) => {
    setStats((prev) => {
      const updated = updater(prev);
      const nextBadges = computeUnlockedBadges(updated);

      const newlyAdded = nextBadges.find(
        (id) => !prev.unlockedBadgeIds.includes(id)
      );
      if (newlyAdded) {
        const badgeObj = badgesData.find((b) => b.id === newlyAdded);
        if (badgeObj) setRecentBadgeName(badgeObj.name);
      }

      const finalState: PlayerStats = {
        ...updated,
        unlockedBadgeIds: nextBadges,
      };

      try {
        localStorage.setItem(
          "devops_drill_arena_stats_v2",
          JSON.stringify(finalState)
        );
      } catch (e) {}

      return finalState;
    });
  };

  const handleSolveArenaScenario = (scenario: ArenaScenario) => {
    updateStats((prev) => {
      const alreadySolved = prev.solvedArenaIds.includes(scenario.id);
      const nextStreak = prev.currentStreak + 1;
      return {
        ...prev,
        xp: prev.xp + (alreadySolved ? 50 : scenario.xpReward),
        currentStreak: nextStreak,
        maxStreak: Math.max(prev.maxStreak, nextStreak),
        solvedArenaIds: alreadySolved
          ? prev.solvedArenaIds
          : [...prev.solvedArenaIds, scenario.id],
      };
    });
  };

  const handlePassDrill = (drill: CommandDrill, bonusXp: number) => {
    updateStats((prev) => {
      const alreadyDone = prev.completedDrillIds.includes(drill.id);
      const nextStreak = prev.currentStreak + 1;
      const baseEarned = alreadyDone
        ? Math.round(drill.xpReward * 0.4)
        : drill.xpReward;
      return {
        ...prev,
        xp: prev.xp + baseEarned + bonusXp,
        currentStreak: nextStreak,
        maxStreak: Math.max(prev.maxStreak, nextStreak),
        completedDrillIds: alreadyDone
          ? prev.completedDrillIds
          : [...prev.completedDrillIds, drill.id],
      };
    });
  };

  const handleQuizCorrect = (pointsEarned: number) => {
    updateStats((prev) => {
      const nextStreak = prev.currentStreak + 1;
      return {
        ...prev,
        xp: prev.xp + pointsEarned,
        currentStreak: nextStreak,
        maxStreak: Math.max(prev.maxStreak, nextStreak),
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        totalCorrectAnswers: prev.totalCorrectAnswers + 1,
      };
    });
  };

  const handleCompletePerfectQuiz = () => {
    updateStats((prev) => ({
      ...prev,
      xp: prev.xp + 250,
      quizPerfectRuns: prev.quizPerfectRuns + 1,
    }));
  };

  const handleRecordMistake = (
    mistake: Omit<MistakeRecord, "id" | "timestamp">
  ) => {
    const now = new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    updateStats((prev) => ({
      ...prev,
      currentStreak: 0,
      totalQuestionsAnswered:
        mistake.mode === "quiz"
          ? prev.totalQuestionsAnswered + 1
          : prev.totalQuestionsAnswered,
      mistakes: [
        {
          ...mistake,
          id: generateShortId(),
          timestamp: now,
        },
        ...prev.mistakes,
      ],
    }));
  };

  const handleRemoveMistake = (id: string) => {
    updateStats((prev) => ({
      ...prev,
      mistakes: prev.mistakes.filter((m) => m.id !== id),
    }));
  };

  const handleClearMistakes = () => {
    updateStats((prev) => ({
      ...prev,
      mistakes: [],
    }));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground pb-16">
      <AnimatedEngineeringBg />

      {/* Top Navigation & Gamification Bar */}
      <TopCommandBar
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        stats={stats}
      />

      {/* Badge Unlocked Toast with Magic UI Meteors + BorderBeam + Spring Animation */}
      <AnimatePresence>
        {recentBadgeName && (
          <motion.div
            key={recentBadgeName}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-16 right-6 z-50"
          >
            <Card className="relative overflow-hidden p-4 border-emerald-500/50 bg-card shadow-lg flex items-center gap-3.5">
              <Meteors number={6} />
              <BorderBeam
                size={120}
                duration={6}
                colorFrom="#10b981"
                colorTo="#f59e0b"
              />
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold block">
                  Nouveau Badge Débloqué !
                </span>
                <span className="text-sm font-bold text-foreground">
                  {recentBadgeName}
                </span>
              </div>
              <Button
                onClick={() => setRecentBadgeName(null)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Spring Mode Transitions */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <WorkspaceOverviewHeader activeMode={activeMode} stats={stats} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeMode}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{
              type: "spring",
              stiffness: 340,
              damping: 30,
            }}
          >
            {activeMode === "arena" && (
              <ProductionArena
                solvedArenaIds={stats.solvedArenaIds}
                onSolveScenario={handleSolveArenaScenario}
                onRecordMistake={handleRecordMistake}
              />
            )}

            {activeMode === "drills" && (
              <CommandDrillMode
                completedDrillIds={stats.completedDrillIds}
                currentStreak={stats.currentStreak}
                onPassDrill={handlePassDrill}
                onFailDrill={handleRecordMistake}
              />
            )}

            {activeMode === "quiz" && (
              <TimedQuizArena
                currentStreak={stats.currentStreak}
                onCorrectAnswer={handleQuizCorrect}
                onWrongAnswer={handleRecordMistake}
                onCompletePerfectQuiz={handleCompletePerfectQuiz}
              />
            )}

            {activeMode === "sandbox" && <GitSimulator />}

            {activeMode === "profile" && (
              <SkillBadgesAndErrors
                stats={stats}
                onClearMistakes={handleClearMistakes}
                onRemoveMistake={handleRemoveMistake}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Cult UI Floating Keyboard Dock */}
      <CultFloatingDock activeMode={activeMode} onSelectMode={setActiveMode} />
    </div>
  );
}
