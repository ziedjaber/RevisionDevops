"use client";

import React from "react";
import {
  Flame,
  Trophy,
  Terminal,
  ShieldAlert,
  Timer,
  GitBranch,
  Award,
  AlertOctagon,
} from "lucide-react";
import { GameMode, PlayerStats } from "@/types/game";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TopCommandBarProps {
  activeMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: PlayerStats;
}

export function getRankTitle(xp: number): { title: string; nextXp: number } {
  if (xp >= 1500) return { title: "Principal DevOps Lead", nextXp: 2500 };
  if (xp >= 900) return { title: "Senior CI/CD Architect", nextXp: 1500 };
  if (xp >= 400) return { title: "Mid Git & Docker Engineer", nextXp: 900 };
  return { title: "Junior DevOps Operator", nextXp: 400 };
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  activeMode,
  onSelectMode,
  stats,
}) => {
  const rank = getRankTitle(stats.xp);

  const modes: {
    id: GameMode;
    label: string;
    sub: string;
    icon: React.ElementType;
    badgeCount?: number;
    badgeColor?: string;
  }[] = [
    {
      id: "arena",
      label: "1. Arena de Prod",
      sub: `${stats.solvedArenaIds.length}/6 résolus`,
      icon: ShieldAlert,
    },
    {
      id: "drills",
      label: "2. Command Drills",
      sub: `${stats.completedDrillIds.length}/18 validés`,
      icon: Terminal,
    },
    {
      id: "quiz",
      label: "3. Quiz Chronométré",
      sub: "Junior • Mid • Lead",
      icon: Timer,
    },
    {
      id: "sandbox",
      label: "4. Graphe Git Libre",
      sub: "Simulateur SHA-1",
      icon: GitBranch,
    },
    {
      id: "profile",
      label: "Badges & Erreurs",
      sub: `${stats.unlockedBadgeIds.length}/12 badges`,
      icon: Award,
      badgeCount: stats.mistakes.length,
      badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1e2330] bg-[#090a0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand + Live Gamification HUD */}
        <div className="flex flex-wrap items-center justify-between py-3 gap-4 border-b border-[#1e2330]/60">
          {/* Brand */}
          <div
            onClick={() => onSelectMode("arena")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-[#12151d] to-emerald-500/10 border border-amber-500/40 flex items-center justify-center shadow-gold-glow transition-transform duration-200 group-hover:scale-105">
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-zinc-100">
                  DEVOPS &amp; GIT{" "}
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent font-mono">
                    DRILL ARENA
                  </span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  100% Practice
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Rang actuel : <strong className="text-amber-300">{rank.title}</strong>
              </p>
            </div>
          </div>

          {/* Gamification Live HUD */}
          <div className="flex items-center gap-3">
            {/* Streak Counter */}
            <motion.div
              key={stats.currentStreak}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={cn(
                "px-3.5 py-1.5 rounded-xl border flex items-center gap-2 font-mono text-xs transition-all",
                stats.currentStreak >= 3
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-gold-glow"
                  : "bg-[#12151d] border-[#1e2330] text-zinc-400"
              )}
            >
              <Flame
                className={cn(
                  "w-4 h-4",
                  stats.currentStreak >= 3
                    ? "text-amber-400 fill-amber-400 animate-pulse"
                    : "text-zinc-500"
                )}
              />
              <div>
                <span className="text-[10px] uppercase block text-zinc-500 leading-none">
                  Streak
                </span>
                <span className="font-extrabold text-sm text-zinc-100">
                  x{stats.currentStreak}
                </span>
              </div>
              {stats.maxStreak > 0 && (
                <span className="text-[10px] text-zinc-500 border-l border-[#1e2330] pl-2">
                  Max: {stats.maxStreak}
                </span>
              )}
            </motion.div>

            {/* XP Counter */}
            <motion.div
              key={stats.xp}
              initial={{ y: -4, opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              className="px-4 py-1.5 rounded-xl bg-[#12151d] border border-amber-500/30 flex items-center gap-2.5 shadow-gold-glow/30"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="font-mono">
                <span className="text-[10px] uppercase block text-zinc-500 leading-none">
                  Score Total
                </span>
                <span className="text-sm font-extrabold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  {stats.xp} XP
                </span>
              </div>
            </motion.div>

            {/* Error Vault Quick Button */}
            <button
              onClick={() => onSelectMode("profile")}
              className={cn(
                "px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-mono transition-all",
                stats.mistakes.length > 0
                  ? "bg-red-500/10 border-red-500/40 text-red-300 hover:bg-red-500/20"
                  : "bg-[#12151d] border-[#1e2330] text-zinc-400 hover:text-zinc-200"
              )}
              title="Consulter le récapitulatif détaillé des erreurs"
            >
              <AlertOctagon
                className={cn(
                  "w-4 h-4",
                  stats.mistakes.length > 0 ? "text-red-400" : "text-zinc-500"
                )}
              />
              <span className="hidden md:inline">Erreurs :</span>
              <span className="font-bold">{stats.mistakes.length}</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: 4 Training Modes + Profile/Errors Navigation */}
        <nav className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-none">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl border text-left transition-all duration-200 flex items-center gap-2.5 relative",
                  isActive
                    ? "bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border-amber-500/50 text-amber-300 shadow-gold-glow/30"
                    : "bg-[#12151d]/80 border-[#1e2330] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive ? "text-amber-400" : "text-zinc-500"
                  )}
                />
                <div>
                  <div
                    className={cn(
                      "text-xs font-bold leading-tight",
                      isActive ? "text-amber-300" : "text-zinc-200"
                    )}
                  >
                    {m.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {m.sub}
                  </div>
                </div>
                {m.badgeCount !== undefined && m.badgeCount > 0 && (
                  <span
                    className={cn(
                      "ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full border",
                      m.badgeColor
                    )}
                  >
                    {m.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
