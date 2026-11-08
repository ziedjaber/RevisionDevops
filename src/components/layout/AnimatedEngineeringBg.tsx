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
import { DotPattern } from "@/components/ui/magic-ui";
import {
  CommitNetworkParticles,
  AuroraTerminalBg,
  DecryptedText,
  ShinyText,
  SpotlightDivider,
} from "@/components/ui/react-bits";
import { ArrowUpRight } from "lucide-react";

/**
 * Global background combining:
 * - Magic UI DotPattern (subtle radial masked grid)
 * - React Bits Aurora backdrop
 * - tsParticles CommitNetworkParticles (interactive commit-node graph reacting to cursor)
 */
export function AnimatedEngineeringBg() {
  return (
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
    announcement:
      "Gitgraph.js + Magic UI BorderBeam + Inspira UI 3D Tilt Cards",
    title: "Production Incident Arena",
    subtitle:
      "Résolvez des incidents Git & DevOps réels pas à pas sur le graphe de commits interactif Gitgraph.js.",
  },
  drills: {
    tag: "Mode 2 · CLI Drills",
    announcement:
      "20 drills Git & CI/CD · Inspira UI Typewriter + GlowButton + AutoAnimate",
    title: "Interactive CLI Command Drills",
    subtitle:
      "Tapez et testez la commande exacte dans le terminal immersif React Bits Aurora pour augmenter votre multiplicateur de série.",
  },
  quiz: {
    tag: "Mode 3 · Speed Quiz",
    announcement:
      "24 questions chronométrées (Junior, Mid, DevOps Lead) + Canvas Confetti",
    title: "Timed DevOps & Git Assessment",
    subtitle:
      "Évaluez vos réflexes sous pression temporelle avec enregistrement automatique dans le coffre Post-Mortem.",
  },
  sandbox: {
    tag: "Mode 4 · Gitgraph.js",
    announcement:
      "Graphe de commits DAG + AutoAnimate 3-Zones Working Dir ↔ Index ↔ .git",
    title: "Gitgraph.js Interactive Commit Simulator",
    subtitle:
      "Expérimentez librement avec les branches, fast-forward vs 3-way merges, rebase, tags et les 3 zones locales animées par AutoAnimate.",
  },
  profile: {
    tag: "Diagnostics & Gamification",
    announcement:
      "12 Badges de compétences + Coffre d'erreurs Post-Mortem animé",
    title: "Skill Badges & Post-Mortem Error Vault",
    subtitle:
      "Suivez votre progression XP, vos badges débloqués et l'analyse comparative de vos erreurs CLI.",
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
              {stats.solvedArenaIds.length}/6 incidents ·{" "}
              {stats.completedDrillIds.length}/20 drills
            </span>
          </Pill>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          <DecryptedText text={meta.title} speed={18} />
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{meta.subtitle}</p>
      </div>

      <SpotlightDivider className="mt-1" />
    </div>
  );
}
