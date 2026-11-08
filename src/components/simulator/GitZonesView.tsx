"use client";

import React from "react";
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
  TreeProvider,
  TreeView,
  TreeNode,
  TreeNodeTrigger,
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNodeContent,
} from "@/components/ui/kibo-ui";
import { FolderGit2, FileCode2, Database, Layers } from "lucide-react";

interface GitZonesViewProps {
  state: GitRepoState;
}

export const GitZonesView: React.FC<GitZonesViewProps> = ({ state }) => {
  const commits = Object.values(state.commits);
  const branches = Object.values(state.branches);

  return (
    <Card className="border-border bg-card/95">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3.5 space-y-0">
        <div>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span>Kibo UI Repository Tree &amp; 3 Local Git Zones</span>
          </CardTitle>
          <CardDescription className="text-xs mt-0.5">
            Inspect the Working Directory, Staging Index and .git Object Store in real time
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
        {/* 1. Working Directory Kibo Tree */}
        <div className="rounded-lg border border-border bg-background/60 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-rose-400" />
                <span>1. Working Directory</span>
              </span>
              <Badge variant="rose" className="font-mono text-[10px]">
                {state.workingDirectory.length} modified
              </Badge>
            </div>

            <TreeProvider
              defaultExpandedIds={["wd-root"]}
              showLines
              showIcons
            >
              <TreeView>
                <TreeNode nodeId="wd-root" level={0} isLast>
                  <TreeNodeTrigger>
                    <TreeExpander hasChildren />
                    <TreeIcon hasChildren />
                    <TreeLabel>workspace/</TreeLabel>
                  </TreeNodeTrigger>
                  <TreeNodeContent hasChildren>
                    {state.workingDirectory.length === 0 ? (
                      <TreeNode nodeId="wd-clean" level={1} isLast>
                        <TreeNodeTrigger>
                          <TreeExpander />
                          <TreeIcon />
                          <TreeLabel className="text-muted-foreground">
                            working tree clean
                          </TreeLabel>
                        </TreeNodeTrigger>
                      </TreeNode>
                    ) : (
                      state.workingDirectory.map((file, idx) => (
                        <TreeNode
                          key={file}
                          nodeId={`wd-${file}`}
                          level={1}
                          isLast={idx === state.workingDirectory.length - 1}
                        >
                          <TreeNodeTrigger>
                            <TreeExpander />
                            <TreeIcon
                              icon={
                                <FileCode2 className="h-3.5 w-3.5 text-rose-400" />
                              }
                            />
                            <TreeLabel className="text-rose-300">
                              {file}
                            </TreeLabel>
                            <span className="text-[10px] font-mono text-rose-400 ml-2">
                              M
                            </span>
                          </TreeNodeTrigger>
                        </TreeNode>
                      ))
                    )}
                  </TreeNodeContent>
                </TreeNode>
              </TreeView>
            </TreeProvider>
          </div>

          <div className="mt-2 pt-2 border-t border-border px-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>git add &lt;file&gt;</span>
            <span>→ Index</span>
          </div>
        </div>

        {/* 2. Staging Area (Index) Kibo Tree */}
        <div className="rounded-lg border border-border bg-background/60 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-sky-400" />
                <span>2. Staging Area (Index)</span>
              </span>
              <Badge variant="cyan" className="font-mono text-[10px]">
                {state.stagingArea.length} staged
              </Badge>
            </div>

            <TreeProvider
              defaultExpandedIds={["stage-root"]}
              showLines
              showIcons
            >
              <TreeView>
                <TreeNode nodeId="stage-root" level={0} isLast>
                  <TreeNodeTrigger>
                    <TreeExpander hasChildren />
                    <TreeIcon hasChildren />
                    <TreeLabel>.git/index</TreeLabel>
                  </TreeNodeTrigger>
                  <TreeNodeContent hasChildren>
                    {state.stagingArea.length === 0 ? (
                      <TreeNode nodeId="stage-empty" level={1} isLast>
                        <TreeNodeTrigger>
                          <TreeExpander />
                          <TreeIcon />
                          <TreeLabel className="text-muted-foreground">
                            no staged files
                          </TreeLabel>
                        </TreeNodeTrigger>
                      </TreeNode>
                    ) : (
                      state.stagingArea.map((file, idx) => (
                        <TreeNode
                          key={file}
                          nodeId={`stage-${file}`}
                          level={1}
                          isLast={idx === state.stagingArea.length - 1}
                        >
                          <TreeNodeTrigger>
                            <TreeExpander />
                            <TreeIcon
                              icon={
                                <FileCode2 className="h-3.5 w-3.5 text-emerald-400" />
                              }
                            />
                            <TreeLabel className="text-emerald-300">
                              {file}
                            </TreeLabel>
                            <span className="text-[10px] font-mono text-emerald-400 ml-2">
                              A
                            </span>
                          </TreeNodeTrigger>
                        </TreeNode>
                      ))
                    )}
                  </TreeNodeContent>
                </TreeNode>
              </TreeView>
            </TreeProvider>
          </div>

          <div className="mt-2 pt-2 border-t border-border px-1 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>git commit -m &quot;...&quot;</span>
            <span>→ .git/objects</span>
          </div>
        </div>

        {/* 3. Local Repository (.git) Kibo Tree */}
        <div className="rounded-lg border border-border bg-background/60 p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-emerald-400" />
                <span>3. Local Repository (.git)</span>
              </span>
              <Badge variant="emerald" className="font-mono text-[10px]">
                {commits.length} objects
              </Badge>
            </div>

            <TreeProvider
              defaultExpandedIds={["git-root", "git-refs"]}
              showLines
              showIcons
            >
              <TreeView>
                <TreeNode nodeId="git-root" level={0} isLast>
                  <TreeNodeTrigger>
                    <TreeExpander hasChildren />
                    <TreeIcon hasChildren />
                    <TreeLabel>.git/</TreeLabel>
                  </TreeNodeTrigger>
                  <TreeNodeContent hasChildren>
                    <TreeNode nodeId="git-refs" level={1}>
                      <TreeNodeTrigger>
                        <TreeExpander hasChildren />
                        <TreeIcon hasChildren />
                        <TreeLabel>refs/heads/</TreeLabel>
                      </TreeNodeTrigger>
                      <TreeNodeContent hasChildren>
                        {branches.map((b, i) => (
                          <TreeNode
                            key={b.name}
                            nodeId={`ref-${b.name}`}
                            level={2}
                            isLast={i === branches.length - 1}
                          >
                            <TreeNodeTrigger>
                              <TreeExpander />
                              <TreeIcon />
                              <TreeLabel>
                                {b.name} → {b.targetHash}
                              </TreeLabel>
                            </TreeNodeTrigger>
                          </TreeNode>
                        ))}
                      </TreeNodeContent>
                    </TreeNode>

                    <TreeNode nodeId="git-stash" level={1} isLast>
                      <TreeNodeTrigger>
                        <TreeExpander />
                        <TreeIcon />
                        <TreeLabel>
                          refs/stash ({state.stash.length})
                        </TreeLabel>
                      </TreeNodeTrigger>
                    </TreeNode>
                  </TreeNodeContent>
                </TreeNode>
              </TreeView>
            </TreeProvider>
          </div>

          <div className="mt-2 pt-2 border-t border-border px-1 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>SHA-1 integrity</span>
            <span>Verified</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
