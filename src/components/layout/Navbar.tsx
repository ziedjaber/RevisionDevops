"use client";

import React from "react";
import { GitBranch, BookOpen, Terminal, CheckCircle2, Award, FileCode2, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTab: "courses" | "simulator" | "exercises" | "quiz" | "generator" | "cheatsheet";
  onTabChange: (tab: "courses" | "simulator" | "exercises" | "quiz" | "generator" | "cheatsheet") => void;
  completedChaptersCount: number;
  completedExercisesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  completedChaptersCount,
  completedExercisesCount,
}) => {
  const navItems = [
    { id: "courses", label: "Cours (8 Chapitres)", icon: BookOpen },
    { id: "simulator", label: "Simulateur Git Graph", icon: Terminal, highlight: true },
    { id: "exercises", label: "Lab d'Exercices", icon: CheckCircle2 },
    { id: "quiz", label: "Examen & Quiz", icon: Award },
    { id: "generator", label: "Générateur YAML", icon: FileCode2 },
    { id: "cheatsheet", label: "Aide-Mémoire", icon: Bookmark },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#090A0F]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            onClick={() => onTabChange("courses")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-zinc-800 to-cyan-500/20 border border-amber-500/40 flex items-center justify-center shadow-gold-glow/40 transition-transform duration-200 group-hover:scale-105">
              <GitBranch className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold tracking-tight text-zinc-100 group-hover:text-amber-400 transition-colors">
                  DevOps &amp; Git <span className="text-amber-400 font-mono">Mastery Lab</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ISIMS 2026
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">
                Plateformes Collaboratives &bull; Pr. Bassem BOUAZIZ
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                    isActive
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isActive ? "text-amber-400" : "text-zinc-500")} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono">{completedChaptersCount}/8</span>
              </div>
              <span className="text-zinc-600">|</span>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{completedExercisesCount}/6</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                  isActive
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                    : "text-zinc-400 bg-zinc-900 border border-zinc-800"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
