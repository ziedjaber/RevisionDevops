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
  Sparkles,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import {
  Pill,
  PillStatus,
  PillIndicator,
  PillDelta,
  Status,
  StatusIndicator,
  StatusLabel,
} from "@/components/ui/kibo-ui";

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
  if (xp >= 2500) {
    return {
      title: "Principal DevOps Architect",
      nextXp: 5000,
      color: "text-amber-400",
    };
  }
  if (xp >= 1200) {
    return {
      title: "Staff Release Engineer",
      nextXp: 2500,
      color: "text-emerald-400",
    };
  }
  if (xp >= 500) {
    return {
      title: "Site Reliability Engineer",
      nextXp: 1200,
      color: "text-sky-400",
    };
  }
  return {
    title: "Junior DevOps Engineer",
    nextXp: 500,
    color: "text-foreground",
  };
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
    icon: React.ElementType;
    count?: string;
  }[] = [
    {
      id: "arena",
      label: "1. Incident Arena",
      icon: ShieldAlert,
      count: `${stats.solvedArenaIds.length}/6`,
    },
    {
      id: "drills",
      label: "2. Command Drills",
      icon: Terminal,
      count: `${stats.completedDrillIds.length}/20`,
    },
    {
      id: "quiz",
      label: "3. Speed Quiz",
      icon: Timer,
      count: "24",
    },
    {
      id: "sandbox",
      label: "4. Gitgraph.js Lab",
      icon: GitBranch,
      count: "DAG",
    },
    {
      id: "profile",
      label: "Post-Mortem & Badges",
      icon: Award,
      count:
        stats.mistakes.length > 0
          ? `${stats.mistakes.length}`
          : `${stats.unlockedBadgeIds.length}/12`,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand + Kibo UI Status & Telemetry Pills */}
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-foreground shadow-sm">
              <GitBranch className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-bold tracking-tight text-foreground">
                RevisionDevops
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex font-mono text-[10px]">
                shadcn/ui + Kibo + Gitgraph.js
              </Badge>
            </div>
          </div>

          {/* Right Kibo UI Pills & Status */}
          <div className="flex items-center gap-2">
            {/* Kibo UI Status indicator */}
            <Status status="online" className="hidden md:inline-flex">
              <StatusIndicator />
              <StatusLabel className="font-mono text-xs text-foreground">
                {rank.title}
              </StatusLabel>
            </Status>

            {/* Kibo UI Pill for Streak */}
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

            {/* Kibo UI Pill for XP */}
            <Pill variant="secondary" className="text-xs py-1">
              <PillStatus>
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-mono">XP</span>
              </PillStatus>
              <span className="font-mono font-bold text-foreground">
                {stats.xp.toLocaleString("en-US")}
              </span>
            </Pill>
          </div>
        </div>

        {/* Bottom Row: shadcn/ui Tabs Navigation */}
        <div className="py-2 overflow-x-auto">
          <Tabs
            value={activeMode}
            onValueChange={(v) => onSelectMode(v as GameMode)}
          >
            <TabsList className="h-9 w-max min-w-full sm:w-auto justify-start">
              {modes.map((m) => {
                const Icon = m.icon;
                return (
                  <TabsTrigger
                    key={m.id}
                    value={m.id}
                    className="gap-2 px-3 py-1.5 text-xs"
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{m.label}</span>
                    {m.count && (
                      <span className="ml-1 rounded bg-muted-foreground/15 px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
                        {m.count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </div>
    </header>
  );
};
