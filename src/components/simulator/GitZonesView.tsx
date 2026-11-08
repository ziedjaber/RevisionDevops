"use client";

import React from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { GitRepoState } from "@/types/git";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Pill,
  PillStatus,
  PillIndicator,
} from "@/components/ui/kibo-ui";
import { BorderBeam } from "@/components/ui/magic-ui";
import { FolderGit2, FileCode2, Database, Layers, GitCommitHorizontal } from "lucide-react";

interface GitZonesViewProps {
  state: GitRepoState;
}

export const GitZonesView: React.FC<GitZonesViewProps> = ({ state }) => {
  const commits = Object.values(state.commits);
  const branches = Object.values(state.branches);

  // AutoAnimate hooks (formkit/auto-animate) — zero-config DOM transition animations
  const [wdListRef] = useAutoAnimate<HTMLUListElement>();
  const [indexListRef] = useAutoAnimate<HTMLUListElement>();
  const [repoListRef] = useAutoAnimate<HTMLUListElement>();

  return (
    <Card className="relative overflow-hidden border-border bg-card/95">
      <BorderBeam size={160} duration={16} colorFrom="#38bdf8" colorTo="#10b981" />
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3.5 space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span>3 Zones Locales Git · AutoAnimate DOM Transitions</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Observez les fichiers et commits se déplacer dynamiquement entre Working Directory, Staging Index et .git
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Pill variant="outline" className="text-xs py-0.5">
            <PillStatus>
              <PillIndicator
                variant={
                  state.head.type === "detached" ? "error" : "warning"
                }
                pulse={state.head.type === "detached"}
              />
              <span>HEAD</span>
            </PillStatus>
            <span className="font-mono">
              {state.head.type === "branch"
                ? state.head.target
                : state.head.target.slice(0, 7)}
            </span>
          </Pill>
        </div>
      </CardHeader>

      <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Working Directory */}
        <div className="rounded-xl border border-border bg-background/60 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-rose-400" />
                <span>1. Working Directory</span>
              </span>
              <Badge variant="rose" className="font-mono text-[10px]">
                {state.workingDirectory.length} modifié(s)
              </Badge>
            </div>

            <ul ref={wdListRef} className="space-y-1.5 min-h-[92px]">
              {state.workingDirectory.length === 0 ? (
                <li
                  key="wd-clean"
                  className="rounded-lg border border-dashed border-slate-800 px-3 py-2 text-xs font-mono text-muted-foreground"
                >
                  working tree clean
                </li>
              ) : (
                state.workingDirectory.map((file) => (
                  <li
                    key={file}
                    className="flex items-center justify-between rounded-lg border border-rose-500/25 bg-rose-500/10 px-2.5 py-1.5 text-xs font-mono text-rose-200"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileCode2 className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{file}</span>
                    </span>
                    <span className="text-[10px] font-bold text-rose-400 ml-2">
                      M
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-border px-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>git add &lt;file&gt;</span>
            <span>→ Index</span>
          </div>
        </div>

        {/* 2. Staging Area (Index) */}
        <div className="rounded-xl border border-border bg-background/60 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-sky-400" />
                <span>2. Staging Area (Index)</span>
              </span>
              <Badge variant="cyan" className="font-mono text-[10px]">
                {state.stagingArea.length} indexé(s)
              </Badge>
            </div>

            <ul ref={indexListRef} className="space-y-1.5 min-h-[92px]">
              {state.stagingArea.length === 0 ? (
                <li
                  key="index-empty"
                  className="rounded-lg border border-dashed border-slate-800 px-3 py-2 text-xs font-mono text-muted-foreground"
                >
                  aucun fichier dans l&apos;Index
                </li>
              ) : (
                state.stagingArea.map((file) => (
                  <li
                    key={file}
                    className="flex items-center justify-between rounded-lg border border-sky-500/30 bg-sky-500/10 px-2.5 py-1.5 text-xs font-mono text-sky-200"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileCode2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{file}</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 ml-2">
                      STAGED
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-border px-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>git commit -m &quot;...&quot;</span>
            <span>→ .git/objects</span>
          </div>
        </div>

        {/* 3. Local Repository (.git) */}
        <div className="rounded-xl border border-border bg-background/60 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-emerald-400" />
                <span>3. Local Repository (.git)</span>
              </span>
              <Badge variant="emerald" className="font-mono text-[10px]">
                {commits.length} commits
              </Badge>
            </div>

            <ul ref={repoListRef} className="space-y-1.5 min-h-[92px] max-h-[135px] overflow-y-auto pr-1">
              {branches.map((b) => (
                <li
                  key={`branch-${b.name}-${b.targetHash}`}
                  className="flex items-center justify-between rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-mono text-emerald-200"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <GitCommitHorizontal className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="font-semibold">{b.name}</span>
                  </span>
                  <span className="text-[10px] text-emerald-300/90">
                    {b.targetHash.slice(0, 7)}
                  </span>
                </li>
              ))}
              {state.stash.length > 0 && (
                <li
                  key="stash-count"
                  className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-mono text-amber-200"
                >
                  <span>refs/stash</span>
                  <span>{state.stash.length} entry</span>
                </li>
              )}
            </ul>
          </div>

          <div className="mt-3 pt-2 border-t border-border px-1 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>SHA-1 snapshots</span>
            <span>Intégrité OK</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
