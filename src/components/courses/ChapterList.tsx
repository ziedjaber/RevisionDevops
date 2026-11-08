"use client";

import React from "react";
import { Chapter } from "@/types/course";
import {
  History,
  Layers,
  Network,
  Boxes,
  Infinity as InfinityIcon,
  GitBranch,
  PlayCircle,
  Container,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChapterListProps {
  chapters: Chapter[];
  selectedChapterId: number;
  completedChapterIds: number[];
  onSelectChapter: (id: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  History,
  Layers,
  Network,
  Boxes,
  Infinity: InfinityIcon,
  GitBranch,
  PlayCircle,
  Container,
};

export const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  selectedChapterId,
  completedChapterIds,
  onSelectChapter,
}) => {
  const completedCount = completedChapterIds.length;
  const progressPercent = Math.round((completedCount / chapters.length) * 100);

  return (
    <div className="space-y-4">
      {/* Overall Course Progress Card */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-zinc-300">Progression du Cours (ISIMS)</span>
          <span className="text-amber-400 font-mono">{progressPercent}% ({completedCount}/{chapters.length})</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Chapters Vertical Nav */}
      <div className="space-y-2">
        {chapters.map((ch) => {
          const Icon = iconMap[ch.iconName] || History;
          const isSelected = ch.id === selectedChapterId;
          const isDone = completedChapterIds.includes(ch.id);

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className={cn(
                "w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 group",
                isSelected
                  ? "bg-zinc-800/90 border-amber-500/50 shadow-gold-glow/20"
                  : "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/90 hover:border-zinc-700"
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-zinc-800 text-zinc-400 group-hover:text-zinc-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      Chapitre {ch.id}
                    </span>
                    <span className="text-[10px] text-zinc-500">&bull;</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{ch.slidesRef}</span>
                  </div>
                  <div
                    className={cn(
                      "text-xs font-semibold truncate",
                      isSelected ? "text-zinc-100" : "text-zinc-300 group-hover:text-zinc-100"
                    )}
                  >
                    {ch.shortTitle}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ch.estimatedTime}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
