"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { chaptersData } from "@/data/chaptersData";
import { ChapterList } from "@/components/courses/ChapterList";
import { ChapterViewer } from "@/components/courses/ChapterViewer";
import { GitSimulator } from "@/components/simulator/GitSimulator";
import { ExerciseLab } from "@/components/exercises/ExerciseLab";
import { ExamQuiz } from "@/components/quiz/ExamQuiz";
import { ConfigGenerator } from "@/components/tools/ConfigGenerator";
import { GitCheatSheet } from "@/components/tools/GitCheatSheet";
import {
  GitBranch,
  Terminal,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  Boxes,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "courses" | "simulator" | "exercises" | "quiz" | "generator" | "cheatsheet"
  >("courses");

  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedChapters = localStorage.getItem("devops_lab_chapters");
      if (savedChapters) setCompletedChapters(JSON.parse(savedChapters));

      const savedExercises = localStorage.getItem("devops_lab_exercises");
      if (savedExercises) setCompletedExercises(JSON.parse(savedExercises));
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
  }, []);

  // Save progress changes
  const handleToggleChapter = (chapterId: number) => {
    setCompletedChapters((prev) => {
      const next = prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId];
      try {
        localStorage.setItem("devops_lab_chapters", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const handleToggleExercise = (exerciseId: string) => {
    setCompletedExercises((prev) => {
      const next = prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId];
      try {
        localStorage.setItem("devops_lab_exercises", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  const currentChapter = chaptersData.find((c) => c.id === selectedChapterId) || chaptersData[0];

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completedChaptersCount={completedChapters.length}
        completedExercisesCount={completedExercises.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section Banner */}
        <section className="relative p-8 sm:p-10 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-[#0E111B] to-zinc-950/90 backdrop-blur-xl shadow-subtle-card overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gold">
                <Sparkles className="w-3 h-3 mr-1 inline" />
                Plateforme Universitaire Interactive &bull; ISIMS
              </Badge>
              <Badge variant="cyan">Promotion 2026</Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight leading-tight">
              DevOps &amp; Git <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-cyan-400">Mastery Lab</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              La plateforme complète d&apos;entraînement basée sur le cours <strong className="text-zinc-100">&laquo; Plateformes Collaboratives - DevOps &amp; Gestion de version Git &raquo;</strong> du Pr. Bassem BOUAZIZ.
              Explorez les 8 chapitres, expérimentez avec le simulateur graphique de commits et résolvez des pannes de production réelles.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={() => setActiveTab("simulator")}
                variant="primary"
                size="md"
                icon={<Terminal className="w-4 h-4 text-zinc-950 fill-current" />}
              >
                Ouvrir le Simulateur Git Graph
              </Button>
              <Button
                onClick={() => setActiveTab("courses")}
                variant="outline"
                size="md"
                icon={<BookOpen className="w-4 h-4 text-amber-400" />}
              >
                Explorer les 8 Chapitres
              </Button>
              <Button
                onClick={() => setActiveTab("quiz")}
                variant="secondary"
                size="md"
                icon={<Award className="w-4 h-4 text-cyan-400" />}
              >
                Passer l&apos;Examen Blanc
              </Button>
            </div>

            {/* Stats Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-800/80 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans">Curriculum</span>
                <span className="text-zinc-100 font-bold text-sm">8 Chapitres</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans">Slides Lues</span>
                <span className="text-amber-400 font-bold text-sm">218 Slides</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans">Simulateur</span>
                <span className="text-cyan-400 font-bold text-sm">SHA-1 &amp; Lanes</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-500 block text-[10px] uppercase font-sans">Scénarios</span>
                <span className="text-emerald-400 font-bold text-sm">6 Cas Pratiques</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 1: Courses (8 Chapters) */}
        {activeTab === "courses" && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Chapters Navigation */}
              <div className="lg:col-span-4 sticky top-24">
                <ChapterList
                  chapters={chaptersData}
                  selectedChapterId={selectedChapterId}
                  completedChapterIds={completedChapters}
                  onSelectChapter={setSelectedChapterId}
                />
              </div>

              {/* Right Column: Active Chapter Content */}
              <div className="lg:col-span-8">
                <ChapterViewer
                  chapter={currentChapter}
                  isCompleted={completedChapters.includes(currentChapter.id)}
                  onToggleComplete={handleToggleChapter}
                  onNextChapter={
                    selectedChapterId < chaptersData.length
                      ? () => setSelectedChapterId(selectedChapterId + 1)
                      : undefined
                  }
                  onPrevChapter={
                    selectedChapterId > 1
                      ? () => setSelectedChapterId(selectedChapterId - 1)
                      : undefined
                  }
                />
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Interactive Git Graph Simulator */}
        {activeTab === "simulator" && (
          <section>
            <GitSimulator />
          </section>
        )}

        {/* Tab 3: Practical Exercises Lab */}
        {activeTab === "exercises" && (
          <section>
            <ExerciseLab
              completedExerciseIds={completedExercises}
              onToggleSolved={handleToggleExercise}
            />
          </section>
        )}

        {/* Tab 4: Exam & Certification Quiz */}
        {activeTab === "quiz" && (
          <section>
            <ExamQuiz />
          </section>
        )}

        {/* Tab 5: YAML Config Generator */}
        {activeTab === "generator" && (
          <section>
            <ConfigGenerator />
          </section>
        )}

        {/* Tab 6: Git Cheat Sheet */}
        {activeTab === "cheatsheet" && (
          <section>
            <GitCheatSheet />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
