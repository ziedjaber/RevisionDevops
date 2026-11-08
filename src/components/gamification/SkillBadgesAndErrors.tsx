"use client";

import React, { useState } from "react";
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
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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

export const SkillBadgesAndErrors: React.FC<SkillBadgesAndErrorsProps> = ({
  stats,
  onClearMistakes,
  onRemoveMistake,
}) => {
  const [mistakeFilter, setMistakeFilter] = useState<"All" | "arena" | "drills" | "quiz">("All");

  const rank = getRankTitle(stats.xp);
  const rankProgress = Math.min(100, Math.round((stats.xp / rank.nextXp) * 100));

  const filteredMistakes = stats.mistakes.filter(
    (m) => mistakeFilter === "All" || m.mode === mistakeFilter
  );

  const tierStyles = {
    bronze: "border-amber-600/50 bg-slate-900/90 text-amber-400",
    silver: "border-blue-400/50 bg-slate-900/90 text-blue-300",
    gold: "border-amber-400/60 bg-slate-900/90 text-amber-300 shadow-amber-glow",
    diamond: "border-indigo-400/60 bg-slate-900/90 text-indigo-300 shadow-indigo-glow",
  };

  return (
    <div className="space-y-8">
      {/* Player Progression Overview Card */}
      <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl space-y-5 shadow-saas-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-bold">
              Profil de Compétences &amp; Gamification
            </span>
            <h1 className="text-2xl font-extrabold text-slate-100">
              {rank.title}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Progression vers le palier suivant : {stats.xp} / {rank.nextXp} XP
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Score Total</span>
              <span className="text-base font-extrabold text-emerald-400">
                {stats.xp} XP
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Record Streak</span>
              <span className="text-base font-extrabold text-amber-400">
                x{stats.maxStreak}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Arena Prod</span>
              <span className="text-base font-extrabold text-blue-400">
                {stats.solvedArenaIds.length}/6
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Command Drills</span>
              <span className="text-base font-extrabold text-indigo-400">
                {stats.completedDrillIds.length}/18
              </span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3b82f6] via-[#6366f1] to-[#10b981] transition-all duration-500 rounded-full"
            style={{ width: `${rankProgress}%` }}
          />
        </div>
      </div>

      {/* Section 1: Skill Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              Badges de Compétences Débloqués ({stats.unlockedBadgeIds.length}/{badgesData.length})
            </h2>
            <p className="text-xs text-slate-400">
              Les badges se débloquent automatiquement en résolvant des incidents, des drills et des séries sans faute.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badgesData.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
            const Icon = iconMap[badge.iconName] || Award;

            return (
              <div
                key={badge.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3",
                  isUnlocked
                    ? tierStyles[badge.tier]
                    : "border-slate-800 bg-slate-900/40 text-slate-500 opacity-60"
                )}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center border",
                        isUnlocked
                          ? "bg-slate-950/80 border-current"
                          : "bg-slate-950 border-slate-800 text-slate-600"
                      )}
                    >
                      {isUnlocked ? (
                        <Icon className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950/80 border border-current/20">
                      {badge.tier}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-100">
                    {badge.name}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span>{badge.conditionText}</span>
                  {isUnlocked && (
                    <span className="text-[#10b981] font-bold">✓ Débloqué</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Detailed Error Post-Mortem Log */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-[#f43f5e]" />
              Récapitulatif Détaillé des Erreurs ({stats.mistakes.length})
            </h2>
            <p className="text-xs text-slate-400">
              Chaque commande erronée ou question manquée est consignée ici avec son analyse corrective.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
              {(["All", "arena", "drills", "quiz"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMistakeFilter(m)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all",
                    mistakeFilter === m
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {m === "All"
                    ? "Toutes"
                    : m === "arena"
                    ? "Arena"
                    : m === "drills"
                    ? "Drills CLI"
                    : "Quiz"}
                </button>
              ))}
            </div>

            {stats.mistakes.length > 0 && (
              <Button
                onClick={onClearMistakes}
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Purger le journal
              </Button>
            )}
          </div>
        </div>

        {filteredMistakes.length === 0 ? (
          <div className="p-10 rounded-2xl border border-slate-800 bg-slate-900/70 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#10b981] mx-auto" />
            <div className="text-sm font-bold text-slate-200">
              Aucune erreur enregistrée dans cette catégorie !
            </div>
            <p className="text-xs text-slate-500">
              Entraînez-vous dans l&apos;Arena, les Command Drills ou le Quiz Chronométré pour tester vos réflexes.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMistakes.map((mistake) => (
              <div
                key={mistake.id}
                className="p-5 rounded-2xl border border-rose-500/30 bg-slate-900/90 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/15 text-[#f43f5e] border border-rose-500/30 font-mono uppercase text-[10px] font-bold">
                      {mistake.mode.toUpperCase()}
                    </span>
                    <Badge variant="gold">{mistake.difficulty}</Badge>
                    <span className="font-mono text-slate-400">
                      {mistake.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-slate-500">
                      {mistake.timestamp}
                    </span>
                    <button
                      onClick={() => onRemoveMistake(mistake.id)}
                      className="text-slate-400 hover:text-[#10b981] font-mono text-[11px]"
                    >
                      ✓ Marquer compris
                    </button>
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-100">
                  {mistake.prompt}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-rose-300">
                    <span className="text-[10px] uppercase block text-[#f43f5e] font-bold mb-1">
                      ✗ Votre tentative :
                    </span>
                    {mistake.userAnswer}
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300">
                    <span className="text-[10px] uppercase block text-[#10b981] font-bold mb-1">
                      ✓ Solution attendue :
                    </span>
                    {mistake.correctAnswer}
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  💡 <strong>Diagnostic :</strong> {mistake.explanation}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
