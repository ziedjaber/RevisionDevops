"use client";

import React from "react";
import { GameMode, PlayerStats } from "@/types/game";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
  Pill,
  PillIndicator,
  PillStatus,
} from "@/components/ui/kibo-ui";
import { ArrowUpRight } from "lucide-react";

export function AnimatedEngineeringBg() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.18]"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

interface WorkspaceOverviewHeaderProps {
  activeMode: GameMode;
  stats: PlayerStats;
}

const MODE_META: Record<
  GameMode,
  { tag: string; announcement: string; title: string; subtitle: string }
> = {
  arena: {
    tag: "Mode 1 · Arena",
    announcement: "Powered by Gitgraph.js (@gitgraph/core) & Kibo UI Snippets",
    title: "Production Incident Arena",
    subtitle:
      "Resolve real-world Git & DevOps incidents step by step on the live Gitgraph.js commit DAG.",
  },
  drills: {
    tag: "Mode 2 · CLI Drills",
    announcement: "20 interactive Git & DevOps terminal drills",
    title: "Interactive CLI Command Drills",
    subtitle:
      "Type the exact command for each scenario to build your streak multiplier and unlock badges.",
  },
  quiz: {
    tag: "Mode 3 · Speed Quiz",
    announcement: "24 timed questions across Junior, Mid and DevOps Lead tiers",
    title: "Timed DevOps & Git Assessment",
    subtitle:
      "Benchmark your mastery under time pressure with automatic Post-Mortem error tracking.",
  },
  sandbox: {
    tag: "Mode 4 · Gitgraph.js",
    announcement: "Switch between Metro (Bezier) & BlackArrow templates live",
    title: "Gitgraph.js Interactive Commit Simulator",
    subtitle:
      "Experiment freely with branches, fast-forward vs 3-way merges, rebase, tags and the Kibo UI 3-zone file tree.",
  },
  profile: {
    tag: "Diagnostics",
    announcement: "Review every recorded CLI mistake alongside your 12 skill badges",
    title: "Skill Badges & Post-Mortem Error Vault",
    subtitle:
      "Track your XP progression, unlocked milestones and side-by-side command diagnostics.",
  },
};

export function WorkspaceOverviewHeader({
  activeMode,
  stats,
}: WorkspaceOverviewHeaderProps) {
  const meta = MODE_META[activeMode];

  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Kibo UI Announcement component */}
        <Announcement themed>
          <AnnouncementTag>{meta.tag}</AnnouncementTag>
          <AnnouncementTitle>
            <span>{meta.announcement}</span>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </AnnouncementTitle>
        </Announcement>

        <div className="flex items-center gap-2">
          <Pill variant="outline" className="text-xs py-0.5">
            <PillStatus>
              <PillIndicator variant="success" pulse />
              <span>Resolved</span>
            </PillStatus>
            <span className="font-mono">
              {stats.solvedArenaIds.length}/6 incidents ·{" "}
              {stats.completedDrillIds.length}/20 drills
            </span>
          </Pill>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {meta.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{meta.subtitle}</p>
      </div>
    </div>
  );
}
