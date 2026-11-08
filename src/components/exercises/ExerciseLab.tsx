"use client";

import React, { useState } from "react";
import { exercisesData } from "./exercisesData";
import { ExerciseCard } from "./ExerciseCard";
import { Filter, CheckCircle2, Trophy, Terminal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface ExerciseLabProps {
  completedExerciseIds: string[];
  onToggleSolved: (id: string) => void;
}

export const ExerciseLab: React.FC<ExerciseLabProps> = ({
  completedExerciseIds,
  onToggleSolved,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const categories = [
    "All",
    "Merge & Rebase",
    "Branching & Workflows",
    "Disaster Recovery",
    "GitLab CI",
    "Docker & Compose",
  ];

  const difficulties = ["All", "Débutant", "Intermédiaire", "Avancé"];

  const filteredExercises = exercisesData.filter((ex) => {
    const matchCategory = selectedCategory === "All" || ex.category === selectedCategory;
    const matchDiff = selectedDifficulty === "All" || ex.difficulty === selectedDifficulty;
    return matchCategory && matchDiff;
  });

  const total = exercisesData.length;
  const completed = completedExerciseIds.length;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and Progress Banner */}
      <div className="p-6 rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-[#121624] to-zinc-900/90 backdrop-blur-xl shadow-subtle-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="gold">Laboratoire Pratique</Badge>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs text-zinc-400">Scénarios DevOps &amp; Git Réels</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-100">
              Exercices &amp; Résolutions de Problèmes Concrets
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Chaque exercice vous confronte à un incident industriel classique (conflit de merge, crash de pipeline CI, conteneurs déconnectés, commit orphelin).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center min-w-[140px]">
            <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Score Lab</span>
            </div>
            <div className="text-2xl font-extrabold font-mono text-zinc-100">
              {completed}/{total}
            </div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{percent}% Résolu</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-zinc-800 mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 transition-all duration-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                selectedCategory === cat
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-zinc-400 hover:text-zinc-200 bg-zinc-800/40"
              )}
            >
              {cat === "All" ? "Toutes les catégories" : cat}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDifficulty(d)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                selectedDifficulty === d
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-zinc-500 hover:text-zinc-300 bg-zinc-800/20"
              )}
            >
              {d === "All" ? "Tous niveaux" : d}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Cards Grid */}
      <div className="space-y-5">
        {filteredExercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isSolved={completedExerciseIds.includes(exercise.id)}
            onToggleSolved={onToggleSolved}
          />
        ))}

        {filteredExercises.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-zinc-800 bg-zinc-900/40 text-zinc-500 text-sm">
            Aucun exercice ne correspond aux filtres sélectionnés.
          </div>
        )}
      </div>
    </div>
  );
};
