"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Terminal, Sparkles, X, Command, Copy, Check } from "lucide-react";

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
              isActive
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
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
 * Expandable engineering quick-reference modal / popover with spring physics.
 */
const ESSENTIAL_GIT_COMMANDS = [
  { cmd: "git add <file>", desc: "Working Dir → Staging Area (Index)", zone: "Index" },
  { cmd: "git diff --staged", desc: "Comparer Index ↔ HEAD (Slide S68)", zone: "Diff" },
  { cmd: "git commit --amend", desc: "Remplacer le dernier commit (Slide S71)", zone: "Commit" },
  { cmd: "git switch -c <branch>", desc: "Ancrer un commit en Detached HEAD (Slide S77)", zone: "HEAD" },
  { cmd: "git reset --soft HEAD~3", desc: "Reculer la branche en gardant l'Index (Slide S78)", zone: "Reset" },
  { cmd: "git rebase --onto master 169a6", desc: "Greffer une sous-branche sur master (Slide S85)", zone: "Rebase" },
  { cmd: "git cherry-pick <sha>", desc: "Copier un commit unique sur HEAD (Slide S83)", zone: "Cherry" },
  { cmd: "git fetch origin", desc: "Mettre à jour origin/* sans fusionner (Slide S115)", zone: "Remote" },
];

export function CultQuickCommandModal() {
  const [open, setOpen] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1 text-xs font-mono text-slate-300 hover:border-indigo-500/50 hover:text-white transition-colors"
        title="Cult UI Quick Command Palette"
      >
        <Command className="h-3.5 w-3.5 text-indigo-400" />
        <span className="hidden sm:inline">Mémo Git CLI</span>
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
              className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    <Terminal className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      Palette Rapide des Commandes Git
                      <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 font-mono text-[10px] text-indigo-300">
                        Cult UI
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Cliquez sur une commande pour la copier dans votre presse-papiers
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

              <div className="mt-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
                {ESSENTIAL_GIT_COMMANDS.map((item) => (
                  <button
                    key={item.cmd}
                    type="button"
                    onClick={() => handleCopy(item.cmd)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-left hover:border-indigo-500/40 hover:bg-slate-950 transition-all"
                  >
                    <div className="space-y-0.5">
                      <code className="font-mono text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                        $ {item.cmd}
                      </code>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
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
