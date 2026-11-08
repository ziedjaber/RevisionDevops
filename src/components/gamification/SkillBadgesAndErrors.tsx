"use client";

import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { badgesData } from "@/data/badgesData";
import { PlayerStats } from "@/types/game";
import { getRankTitle } from "@/components/layout/TopCommandBar";
import {
  Sparkles,
  Flame,
  Zap,
  Compass,
  GitMerge,
  GitPullRequest,
  ShieldAlert,
  Terminal,
  Cpu,
  Award,
  Trophy,
  Crown,
  AlertOctagon,
  Trash2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Pill,
  PillStatus,
  PillIndicator,
  Snippet,
  SnippetHeader,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
  SnippetCopyButton,
} from "@/components/ui/kibo-ui";
import { BorderBeam } from "@/components/ui/magic-ui";
import { Card3DTilt } from "@/components/ui/inspira-ui";
import { CultSpringTabs, CultTabItem } from "@/components/ui/cult-ui";
import { cn } from "@/lib/utils";

interface SkillBadgesAndErrorsProps {
  stats: PlayerStats;
  onClearMistakes: () => void;
  onRemoveMistake: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Zap,
  Compass,
  GitMerge,
  GitPullRequest,
  ShieldAlert,
  Terminal,
  Cpu,
  Award,
  Trophy,
  Crown,
};

const MISTAKE_TABS: CultTabItem<"All" | "arena" | "drills" | "quiz">[] = [
  { id: "All", label: "Toutes" },
  { id: "arena", label: "Arena" },
  { id: "drills", label: "CLI Drills" },
  { id: "quiz", label: "Quiz" },
];

export const SkillBadgesAndErrors: React.FC<SkillBadgesAndErrorsProps> = ({
  stats,
  onClearMistakes,
  onRemoveMistake,
}) => {
  const [mistakeFilter, setMistakeFilter] = useState<
    "All" | "arena" | "drills" | "quiz"
  >("All");
  const [mistakesListRef] = useAutoAnimate<HTMLDivElement>();

  const rank = getRankTitle(stats.xp);
  const rankProgress = Math.min(
    100,
    Math.round((stats.xp / rank.nextXp) * 100)
  );

  const filteredMistakes = stats.mistakes.filter(
    (m) => mistakeFilter === "All" || m.mode === mistakeFilter
  );

  return (
    <div className="space-y-8">
      {/* Player Progression Overview Card (shadcn/ui Card + Magic UI BorderBeam + Progress) */}
      <Card className="relative overflow-hidden">
        <BorderBeam
          size={200}
          duration={16}
          colorFrom="#f59e0b"
          colorTo="#10b981"
        />
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4 space-y-0">
          <div className="space-y-1">
            <CardDescription className="font-mono text-xs">
              Progression Grade &amp; XP
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{rank.title}</CardTitle>
            <p className="text-xs text-muted-foreground font-mono">
              Prochain palier : {stats.xp} / {rank.nextXp} XP
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill variant="outline">
              <PillStatus>
                <PillIndicator variant="success" />
                <span>Total XP</span>
              </PillStatus>
              <span className="font-mono font-bold">{stats.xp}</span>
            </Pill>
            <Pill variant="outline">
              <PillStatus>
                <PillIndicator variant="warning" />
                <span>Max Streak</span>
              </PillStatus>
              <span className="font-mono font-bold">x{stats.maxStreak}</span>
            </Pill>
            <Pill variant="outline">
              <PillStatus>
                <PillIndicator variant="info" />
                <span>Badges</span>
              </PillStatus>
              <span className="font-mono font-bold">
                {stats.unlockedBadgeIds.length}/{badgesData.length}
              </span>
            </Pill>
          </div>
        </CardHeader>

        <CardContent>
          <Progress value={rankProgress} />
        </CardContent>
      </Card>

      {/* Section 1: Skill Badges Grid with Inspira UI 3D Tilt */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-400" />
              Badges de Compétences ({stats.unlockedBadgeIds.length}/
              {badgesData.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Les badges se débloquent automatiquement lors de vos victoires en
              Arena, Command Drills et Quiz sans faute.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badgesData.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
            const Icon = iconMap[badge.iconName] || Award;

            return (
              <Card3DTilt
                key={badge.id}
                active={isUnlocked}
                className={cn(
                  "flex flex-col justify-between transition-all",
                  !isUnlocked && "opacity-60"
                )}
              >
                <CardHeader className="space-y-2 pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center border",
                        isUnlocked
                          ? "bg-secondary border-border text-emerald-400"
                          : "bg-muted border-border text-muted-foreground"
                      )}
                    >
                      {isUnlocked ? (
                        <Icon className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <Badge variant={isUnlocked ? "emerald" : "secondary"}>
                      {badge.tier}
                    </Badge>
                  </div>

                  <CardTitle className="text-sm">{badge.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {badge.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span>{badge.conditionText}</span>
                  {isUnlocked && (
                    <span className="text-emerald-400 font-semibold">
                      ✓ Débloqué
                    </span>
                  )}
                </CardFooter>
              </Card3DTilt>
            );
          })}
        </div>
      </div>

      {/* Section 2: Detailed Error Post-Mortem Log with AutoAnimate & Kibo UI Snippet */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              Post-Mortem Error Vault ({stats.mistakes.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Chaque erreur de commande ou réponse manquée est archivée ici avec
              comparaison côte à côte.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CultSpringTabs
              items={MISTAKE_TABS}
              value={mistakeFilter}
              onChange={setMistakeFilter}
              layoutId="postmortem-filter-spring-tabs"
            />

            {stats.mistakes.length > 0 && (
              <Button
                onClick={onClearMistakes}
                variant="destructive"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Purger
              </Button>
            )}
          </div>
        </div>

        {filteredMistakes.length === 0 ? (
          <Card className="p-10 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-foreground">
              Aucune erreur enregistrée dans cette catégorie
            </div>
            <p className="text-xs text-muted-foreground">
              Entraînez-vous dans l&apos;Incident Arena, les Command Drills ou le
              Quiz Chronométré pour tester vos réflexes.
            </p>
          </Card>
        ) : (
          <div ref={mistakesListRef} className="space-y-3">
            {filteredMistakes.map((mistake) => (
              <Card key={mistake.id} className="p-5 space-y-3 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="rose">{mistake.mode}</Badge>
                    <Badge variant="amber">{mistake.difficulty}</Badge>
                    <span className="font-mono text-muted-foreground">
                      {mistake.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {mistake.timestamp}
                    </span>
                    <Button
                      onClick={() => onRemoveMistake(mistake.id)}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-mono text-emerald-400"
                    >
                      ✓ Marquer maîtrisé
                    </Button>
                  </div>
                </div>

                <div className="text-sm font-semibold text-foreground">
                  {mistake.prompt}
                </div>

                <Snippet defaultValue="expected">
                  <SnippetHeader>
                    <SnippetTabsList className="h-7">
                      <SnippetTabsTrigger value="expected">
                        ✓ Solution attendue
                      </SnippetTabsTrigger>
                      <SnippetTabsTrigger value="attempt">
                        ✗ Votre saisie
                      </SnippetTabsTrigger>
                    </SnippetTabsList>
                    <SnippetCopyButton value={mistake.correctAnswer} />
                  </SnippetHeader>
                  <SnippetTabsContent
                    value="expected"
                    className="text-emerald-300"
                  >
                    {mistake.correctAnswer}
                  </SnippetTabsContent>
                  <SnippetTabsContent value="attempt" className="text-rose-300">
                    {mistake.userAnswer}
                  </SnippetTabsContent>
                </Snippet>

                <p className="text-muted-foreground leading-relaxed">
                  {mistake.explanation}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
