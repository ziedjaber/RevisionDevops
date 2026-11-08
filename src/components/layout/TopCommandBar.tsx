"use client";

import React from "react";
import { GameMode, PlayerStats } from "@/types/game";
import {
  ShieldAlert,
  Terminal,
  Timer,
  GitBranch,
  Award,
  Flame,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  Pill,
  PillStatus,
  PillDelta,
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/ui/kibo-ui";
import {
  CultSpringTabs,
  CultTabItem,
  CultQuickCommandModal,
} from "@/components/ui/cult-ui";
import { NumberTicker } from "@/components/ui/magic-ui";
import { ShinyText } from "@/components/ui/react-bits";

interface TopCommandBarProps {
  activeMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  stats: PlayerStats;
}

export function getRankTitle(xp: number): {
  title: string;
  nextXp: number;
  color: string;
} {
  if (xp >= 3500) {
    return {
      title: "Principal DevOps Architect",
      nextXp: 6000,
      color: "text-amber-400",
    };
  }
  if (xp >= 1500) {
    return {
      title: "Staff Release Engineer",
      nextXp: 3500,
      color: "text-emerald-400",
    };
  }
  if (xp >= 600) {
    return {
      title: "Site Reliability Engineer",
      nextXp: 1500,
      color: "text-sky-400",
    };
  }
  return {
    title: "Junior DevOps Engineer",
    nextXp: 600,
    color: "text-foreground",
  };
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  activeMode,
  onSelectMode,
  stats,
}) => {
  const rank = getRankTitle(stats.xp);

  const modes: CultTabItem<GameMode>[] = [
    {
      id: "arena",
      label: "1. Incident Arena",
      icon: ShieldAlert,
      badge: `${stats.solvedArenaIds.length}/12`,
    },
    {
      id: "drills",
      label: "2. Command Drills",
      icon: Terminal,
      badge: `${stats.completedDrillIds.length}/36`,
    },
    {
      id: "quiz",
      label: "3. Speed Quiz",
      icon: Timer,
      badge: "40",
    },
    {
      id: "sandbox",
      label: "4. Gitgraph.js Lab",
      icon: GitBranch,
      badge: "DAG",
    },
    {
      id: "profile",
      label: "Post-Mortem & Badges",
      icon: Award,
      badge:
        stats.mistakes.length > 0
          ? `${stats.mistakes.length}`
          : `${stats.unlockedBadgeIds.length}/18`,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand + Cult UI Quick Command Modal + Telemetry Pills */}
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/40 bg-indigo-500/10 text-foreground shadow-sm">
              <GitBranch className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold tracking-tight text-foreground">
                RevisionDevops
              </span>
              <Badge
                variant="outline"
                className="hidden lg:inline-flex font-mono text-[10px]"
              >
                <ShinyText>
                  shadcn · Magic UI · React Bits · Inspira · Cult · Gitgraph.js
                </ShinyText>
              </Badge>
            </div>
          </div>

          {/* Right: Cult UI Quick Command Modal + Kibo UI Pills & Magic UI NumberTicker */}
          <div className="flex items-center gap-2">
            <CultQuickCommandModal />

            <Status status="online" className="hidden md:inline-flex">
              <StatusIndicator />
              <StatusLabel className="font-mono text-xs text-foreground">
                {rank.title}
              </StatusLabel>
            </Status>

            <Pill variant="outline" className="text-xs py-1">
              <PillStatus>
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-mono">Streak</span>
              </PillStatus>
              <span className="font-mono font-semibold text-amber-400">
                x{stats.currentStreak}
              </span>
              <PillDelta delta={stats.currentStreak} />
            </Pill>

            <Pill variant="secondary" className="text-xs py-1">
              <PillStatus>
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono">XP</span>
              </PillStatus>
              <NumberTicker
                value={stats.xp}
                className="font-mono font-bold text-foreground"
              />
            </Pill>
          </div>
        </div>

        {/* Bottom Row: Cult UI Spring Tabs Navigation */}
        <div className="py-2 overflow-x-auto">
          <CultSpringTabs
            items={modes}
            value={activeMode}
            onChange={onSelectMode}
            layoutId="main-navigation-spring-tabs"
          />
        </div>
      </div>
    </header>
  );
};
