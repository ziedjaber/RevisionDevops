"use client";

import React, { useState, useEffect } from "react";
import { TopCommandBar } from "@/components/layout/TopCommandBar";
import { AnimatedEngineeringBg } from "@/components/layout/AnimatedEngineeringBg";
import { ProductionArena } from "@/components/arena/ProductionArena";
import { CommandDrillMode } from "@/components/drills/CommandDrillMode";
import { TimedQuizArena } from "@/components/quiz/TimedQuizArena";
import { GitSimulator } from "@/components/simulator/GitSimulator";
import { SkillBadgesAndErrors } from "@/components/gamification/SkillBadgesAndErrors";
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
import { motion, AnimatePresence } from "framer-motion";

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
  if (stats.solvedArenaIds.includes("inc-101-detached-head"))
    unlocked.add("detached-survivor");
  if (stats.solvedArenaIds.includes("inc-202-3way-merge"))
    unlocked.add("merge-arbiter");
  if (stats.solvedArenaIds.includes("inc-301-linear-rebase"))
    unlocked.add("rebase-surgeon");
  if (stats.solvedArenaIds.includes("inc-404-gitflow-hotfix"))
    unlocked.add("hotfix-commander");
  if (stats.completedDrillIds.length >= 8) unlocked.add("drill-sergeant");
  if (stats.completedDrillIds.length >= 16) unlocked.add("drill-overlord");
  if (stats.quizPerfectRuns >= 1) unlocked.add("quiz-sharpshooter");
  if (stats.xp >= 1000) unlocked.add("xp-1000");
  if (stats.solvedArenaIds.length >= 6) unlocked.add("arena-champion");

  return Array.from(unlocked);
}

export default function DrillChallengePlatform() {
  const [activeMode, setActiveMode] = useState<GameMode>("arena");
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [recentBadgeName, setRecentBadgeName] = useState<string | null>(null);

  // Load saved gamification state
  useEffect(() => {
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

      // Check if a new badge was just unlocked
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

  // Handlers for Mode 1: Production Arena
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

  // Handlers for Mode 2: Command Drills
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

  // Handlers for Mode 3: Timed Quiz
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

  // Shared Mistake Recorder (Resets currentStreak & logs detailed Post-Mortem)
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
    <div className="relative min-h-screen flex flex-col bg-[#0b0f17] text-slate-100">
      {/* Subtle Animated SVG Engineering Grid & Particles */}
      <AnimatedEngineeringBg />

      {/* Top Gamification & Mode Switcher Bar */}
      <TopCommandBar
        activeMode={activeMode}
        onSelectMode={setActiveMode}
        stats={stats}
      />

      {/* Badge Unlocked Floating Toast */}
      <AnimatePresence>
        {recentBadgeName && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border border-indigo-500/50 bg-slate-900/95 backdrop-blur-xl shadow-blue-glow flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block">
                Nouveau Badge Débloqué !
              </span>
              <span className="text-sm font-extrabold text-slate-100">
                {recentBadgeName}
              </span>
            </div>
            <button
              onClick={() => setRecentBadgeName(null)}
              className="text-slate-500 hover:text-slate-200 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      </main>
    </div>
  );
}
