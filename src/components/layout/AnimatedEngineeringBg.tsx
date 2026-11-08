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
import { DotPattern, CommandMarquee } from "@/components/ui/magic-ui";
import {
  CommitNetworkParticles,
  AuroraTerminalBg,
  DecryptedText,
  ShinyText,
  SpotlightDivider,
  ClickSparkOverlay,
  CursorSpotlight,
} from "@/components/ui/react-bits";
import { FlipWords } from "@/components/ui/inspira-ui";
import { ArrowUpRight } from "lucide-react";

const MARQUEE_COMMANDS = [
  "$ git rebase --onto master server client",
  "$ git reset --soft HEAD~3",
  "$ git cherry-pick 2c33a99",
  "$ git diff --staged",
  "$ git commit --amend",
  "$ git switch -c fix/memory-leak",
  "$ git push origin --delete serverfix",
  "$ git checkout --track origin/serverfix",
];

/**
 * Global background combining:
 * - Magic UI DotPattern (subtle radial masked grid)
 * - React Bits Aurora backdrop
 * - tsParticles CommitNetworkParticles (interactive commit-node graph reacting to cursor)
 */
export function AnimatedEngineeringBg() {
  return (
    <>
      <ClickSparkOverlay />
      <CursorSpotlight />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <AuroraTerminalBg intensity="subtle" />
        <DotPattern
          width={24}
          height={24}
          cx={1}
          cy={1}
          cr={1}
          className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)] opacity-45"
        />
        <CommitNetworkParticles className="opacity-75" />
      </div>
    </>
  );
}

interface WorkspaceOverviewHeaderProps {
  activeMode: GameMode;
  stats: PlayerStats;
}

const MODE_META: Record<
  GameMode,
  {
    tag: string;
    announcement: string;
    title: string;
    subtitle: string;
    flipWords: string[];
  }
> = {
  arena: {
    tag: "Mode 1 · 12 Incidents",
    announcement:
      "12 Scénarios Prod · Gitgraph.js + Magic UI BorderBeam + Inspira 3D Tilt",
    title: "Production Incident Arena",
    subtitle:
      "Résolvez 12 incidents Git & DevOps réels pas à pas sur le graphe de commits interactif :",
    flipWords: [
      "Detached HEAD",
      "Rebase --onto",
      "GitFlow Hotfix",
      "3-Way Merge",
      "Cherry-Pick",
      "Reset --soft",
    ],
  },
  drills: {
    tag: "Mode 2 · 36 CLI Drills",
    announcement:
      "36 Drills Git & CI/CD · Inspira UI Typewriter + GlowButton + AutoAnimate",
    title: "Interactive CLI Command Drills",
    subtitle:
      "Maîtrisez les 36 commandes essentielles en direct dans le terminal Aurora :",
    flipWords: [
      "git diff --staged",
      "git commit --amend",
      "git rm --cached",
      "git rebase --onto",
      "git remote show",
    ],
  },
  quiz: {
    tag: "Mode 3 · 40 Questions",
    announcement:
      "40 Questions Chronométrées (Junior, Mid, DevOps Lead) + Canvas Confetti",
    title: "Timed DevOps & Git Assessment",
    subtitle:
      "Évaluez votre maîtrise sous pression temporelle sur 40 questions couvrant :",
    flipWords: [
      "3 Zones Git",
      "CAMS & MTTR",
      "REST & Microservices",
      "GitFlow vs Trunk",
      "GitLab CI Runners",
    ],
  },
  sandbox: {
    tag: "Mode 4 · Gitgraph.js",
    announcement:
      "Graphe de commits DAG + AutoAnimate 3-Zones Working Dir ↔ Index ↔ .git",
    title: "Gitgraph.js Interactive Commit Simulator",
    subtitle:
      "Expérimentez librement avec les branches, merges, rebases, tags et les 3 zones locales :",
    flipWords: [
      "Working Directory",
      "Staging Area (Index)",
      "Local Repo (.git)",
      "Fast-Forward",
      "3-Way Merge",
    ],
  },
  profile: {
    tag: "18 Badges & Post-Mortem",
    announcement:
      "18 Badges de compétences + Coffre d'erreurs Post-Mortem animé",
    title: "Skill Badges & Post-Mortem Error Vault",
    subtitle:
      "Suivez votre progression XP, vos 18 badges et l'analyse comparative de vos erreurs :",
    flipWords: [
      "Bronze Tier",
      "Silver Tier",
      "Gold Tier",
      "Diamond Tier",
      "Zero-Error Run",
    ],
  },
};

export function WorkspaceOverviewHeader({
  activeMode,
  stats,
}: WorkspaceOverviewHeaderProps) {
  const meta = MODE_META[activeMode];

  return (
    <div className="mb-6 flex flex-col gap-3 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Announcement themed>
          <AnnouncementTag>{meta.tag}</AnnouncementTag>
          <AnnouncementTitle>
            <ShinyText className="font-mono text-[11px]">
              {meta.announcement}
            </ShinyText>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
          </AnnouncementTitle>
        </Announcement>

        <div className="flex items-center gap-2">
          <Pill variant="outline" className="text-xs py-0.5">
            <PillStatus>
              <PillIndicator variant="success" pulse />
              <span>Progression</span>
            </PillStatus>
            <span className="font-mono">
              {stats.solvedArenaIds.length}/12 incidents ·{" "}
              {stats.completedDrillIds.length}/36 drills ·{" "}
              {stats.unlockedBadgeIds.length}/18 badges
            </span>
          </Pill>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          <DecryptedText text={meta.title} speed={18} />
        </h1>
        <p className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-1.5">
          <span>{meta.subtitle}</span>
          <FlipWords words={meta.flipWords} />
        </p>
      </div>

      <CommandMarquee items={MARQUEE_COMMANDS} />
      <SpotlightDivider />
    </div>
  );
}
