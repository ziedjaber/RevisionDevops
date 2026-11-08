"use client";

import React from "react";
import { GitBranch, GitMerge, ShieldAlert, RotateCcw, Compass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface GitPresetsProps {
  currentPreset: string;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
}

export const GitPresets: React.FC<GitPresetsProps> = ({
  currentPreset,
  onSelectPreset,
  onReset,
}) => {
  const presets = [
    {
      id: "initial",
      title: "Standard Repository",
      desc: "Branch main with 3 linear commits and modified files ready to stage.",
      icon: GitBranch,
      color: "text-emerald-400",
    },
    {
      id: "divergent",
      title: "Divergent Branches",
      desc: "main and feature/oauth have diverged. Practice 'git merge' or 'git rebase'.",
      icon: GitMerge,
      color: "text-sky-400",
    },
    {
      id: "gitflow",
      title: "GitFlow Architecture",
      desc: "main, develop and feature/cart in parallel with staged changes.",
      icon: Compass,
      color: "text-violet-400",
    },
    {
      id: "detached",
      title: "Detached HEAD State",
      desc: "HEAD points directly to an orphaned commit. Practice anchoring it to a branch.",
      icon: ShieldAlert,
      color: "text-rose-400",
    },
  ];

  return (
    <Card className="border-border bg-card/95">
      <CardHeader className="flex flex-row items-center justify-between px-5 py-3 border-b border-border bg-muted/30 space-y-0">
        <CardTitle className="text-xs font-mono text-muted-foreground">
          1-Click Repository Topologies
        </CardTitle>
        <Button
          onClick={onReset}
          variant="outline"
          size="sm"
          className="h-7 text-xs font-mono"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </CardHeader>

      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = currentPreset === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPreset(p.id)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all",
                isSelected
                  ? "bg-secondary border-primary/40 shadow-sm"
                  : "bg-background/60 border-border hover:bg-accent/50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={cn("w-4 h-4", p.color)} />
                <span className="text-xs font-semibold text-foreground">
                  {p.title}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {p.desc}
              </p>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
