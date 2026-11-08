"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Terminal,
  X,
  Command,
  Copy,
  Check,
  ShieldAlert,
  Timer,
  GitBranch,
  Award,
  Keyboard,
} from "lucide-react";
import { GameMode } from "@/types/game";

/**
 * Cult UI (nicoalbanese/cult-ui) — CultSpringTabs
 * Ultra-minimalist engineering tabs with instant spring layoutId transitions.
 */
export interface CultTabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ElementType;
  badge?: string;
}

interface CultSpringTabsProps<T extends string = string> {
  items: CultTabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  layoutId?: string;
  className?: string;
}

export function CultSpringTabs<T extends string = string>({
  items,
  value,
  onChange,
  layoutId = "cult-spring-tab-pill",
  className,
}: CultSpringTabsProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-slate-800/90 bg-slate-950/80 p-1 backdrop-blur-md",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "relative z-10 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
              isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                }}
                className="absolute inset-0 -z-10 rounded-lg border border-indigo-500/40 bg-gradient-to-r from-indigo-500/20 via-slate-800/90 to-emerald-500/15 shadow-sm"
              />
            )}
            {Icon && (
              <Icon
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isActive ? "text-indigo-400" : "text-slate-400"
                )}
              />
            )}
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.2 font-mono text-[10px]",
                  isActive
                    ? "bg-indigo-500/25 text-indigo-200 border border-indigo-400/30"
                    : "bg-slate-800/80 text-slate-400"
                )}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Cult UI (nicoalbanese/cult-ui) — CultQuickCommandModal
 * Expandable engineering quick-reference modal / popover with spring physics & Ctrl+K shortcut.
 */
const ESSENTIAL_GIT_COMMANDS = [
  { cmd: "git init", desc: "Initialiser un nouveau dépôt local .git (Slide S62)", zone: "Init" },
  { cmd: "git clone <url>", desc: "Cloner un dépôt distant complet avec origin (Slide S113)", zone: "Remote" },
  { cmd: "git add <file>", desc: "Working Dir → Staging Area (Index) (Slide S66)", zone: "Index" },
  { cmd: "git diff", desc: "Comparer Working Directory ↔ Index (Slide S68)", zone: "Diff" },
  { cmd: "git diff --staged", desc: "Comparer Index (--cached) ↔ HEAD (Slide S68)", zone: "Diff" },
  { cmd: "git diff HEAD", desc: "Comparer Working Directory ↔ HEAD (Slide S68)", zone: "Diff" },
  { cmd: 'git commit -a -m "msg"', desc: "Indexer et valider tous les fichiers suivis (Slide S67)", zone: "Commit" },
  { cmd: "git commit --amend", desc: "Remplacer le dernier commit par un nouveau SHA-1 (Slide S71)", zone: "Commit" },
  { cmd: "git switch -c <branch>", desc: "Ancrer un commit en Detached HEAD (Slide S77)", zone: "HEAD" },
  { cmd: "git reset HEAD <file>", desc: "Désindexer un fichier sans perdre le travail (Slide S80)", zone: "Reset" },
  { cmd: "git reset --soft HEAD~3", desc: "Reculer la branche en gardant l'Index intact (Slide S78)", zone: "Reset" },
  { cmd: "git reset --hard HEAD~3", desc: "Reculer la branche en écrasant Index + Working Dir (Slide S80)", zone: "Reset" },
  { cmd: "git merge --no-ff <branch>", desc: "Forcer un commit de fusion même si Fast-Forward possible", zone: "Merge" },
  { cmd: "git rebase --onto master 169a6", desc: "Greffer une sous-branche sur master (Slide S85)", zone: "Rebase" },
  { cmd: "git cherry-pick <sha>", desc: "Copier le patch d'un commit unique sur HEAD (Slide S83)", zone: "Cherry" },
  { cmd: "git push origin --delete <br>", desc: "Supprimer une branche sur le serveur distant (Slide S125)", zone: "Remote" },
];

export function CultQuickCommandModal() {
  const [open, setOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const filteredCommands = ESSENTIAL_GIT_COMMANDS.filter(
    (c) =>
      c.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors"
        title="Cult UI Quick Command Palette (Ctrl+K)"
      >
        <Command className="h-3.5 w-3.5 text-indigo-400" />
        <span className="hidden sm:inline">Mémo Git CLI</span>
        <kbd className="hidden md:inline-block rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
          Ctrl+K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Palette Rapide des 16 Commandes Git de Référence
                      <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono text-[10px] text-indigo-300">
                        Cult UI · Ctrl+K
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Filtrez par mot-clé et cliquez sur une commande pour la copier
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une commande (ex: rebase, reset, diff, amend, remote)..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-xs text-white placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1">
                {filteredCommands.map((item) => (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => handleCopy(item.cmd)}
                    className="group flex items-center justify-between gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-2.5 text-left hover:border-indigo-500/40 hover:bg-slate-950 transition-all"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <code className="block truncate font-mono text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                        $ {item.cmd}
                      </code>
                      <p className="truncate text-[11px] text-slate-400">
                        {item.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] text-slate-300">
                        {item.zone}
                      </span>
                      {copiedCmd === item.cmd ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Cult UI — CultFloatingDock
 * Minimalist bottom floating dock with keyboard shortcuts (Alt+1..5) for instant mode switching.
 */
export function CultFloatingDock({
  activeMode,
  onSelectMode,
}: {
  activeMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey) return;
      if (e.key === "1") onSelectMode("arena");
      if (e.key === "2") onSelectMode("drills");
      if (e.key === "3") onSelectMode("quiz");
      if (e.key === "4") onSelectMode("sandbox");
      if (e.key === "5") onSelectMode("profile");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelectMode]);

  const items: { id: GameMode; label: string; shortcut: string; icon: React.ElementType }[] = [
    { id: "arena", label: "Arena", shortcut: "Alt+1", icon: ShieldAlert },
    { id: "drills", label: "Drills", shortcut: "Alt+2", icon: Terminal },
    { id: "quiz", label: "Quiz", shortcut: "Alt+3", icon: Timer },
    { id: "sandbox", label: "Gitgraph", shortcut: "Alt+4", icon: GitBranch },
    { id: "profile", label: "Badges", shortcut: "Alt+5", icon: Award },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden md:flex items-center gap-1.5 rounded-2xl border border-slate-800/90 bg-slate-950/90 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
      <span className="flex items-center gap-1 pr-2 border-r border-slate-800 text-[10px] font-mono text-slate-400">
        <Keyboard className="h-3 w-3 text-indigo-400" />
        Dock
      </span>
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeMode === item.id;
        return (
          <motion.button
            key={item.id}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectMode(item.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono transition-colors",
              active
                ? "bg-indigo-500/20 text-indigo-200 border border-indigo-500/40"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            )}
          >
            <Icon className={cn("h-3.5 w-3.5", active ? "text-emerald-400" : "text-slate-400")} />
            <span>{item.label}</span>
            <kbd className="text-[9px] text-slate-500">{item.shortcut}</kbd>
          </motion.button>
        );
      })}
    </div>
  );
}
