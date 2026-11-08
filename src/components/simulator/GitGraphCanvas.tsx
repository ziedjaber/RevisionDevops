"use client";

import React, { useState, useMemo } from "react";
import { GitRepoState, GitCommit } from "@/types/git";
import {
  MergeStyle,
  TemplateName,
  templateExtend,
  toSvgPath,
  Coordinate,
} from "@gitgraph/core";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Pill,
  PillIndicator,
  PillStatus,
  Status,
  StatusIndicator,
  StatusLabel,
  Snippet,
  SnippetHeader,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
  SnippetCopyButton,
} from "@/components/ui/kibo-ui";
import { GitCommitHorizontal, GitBranch, Tag as TagIcon, X } from "lucide-react";

interface GitGraphCanvasProps {
  state: GitRepoState;
  onSelectCommit?: (commit: GitCommit) => void;
  compact?: boolean;
}

const METRO_PALETTE = [
  "#10b981", // emerald (main)
  "#008fb5", // gitgraph metro cyan/blue
  "#f1c109", // gitgraph metro amber
  "#a855f7", // purple
  "#f43f5e", // rose
];

const BLACKARROW_PALETTE = [
  "#6963FF", // gitgraph blackarrow indigo
  "#47E8D4", // gitgraph blackarrow teal
  "#6BDB52", // gitgraph blackarrow green
  "#E84BA5", // gitgraph blackarrow pink
  "#FFA657", // gitgraph blackarrow orange
];

export const GitGraphCanvas: React.FC<GitGraphCanvasProps> = ({
  state,
  onSelectCommit,
  compact = false,
}) => {
  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(
    null
  );
  const [templateMode, setTemplateMode] = useState<"metro" | "blackarrow">(
    "metro"
  );

  // Authentic @gitgraph/core template configuration
  const gitgraphTemplate = useMemo(() => {
    return templateExtend(
      templateMode === "metro"
        ? TemplateName.Metro
        : TemplateName.BlackArrow,
      {
        colors:
          templateMode === "metro" ? METRO_PALETTE : BLACKARROW_PALETTE,
        branch: {
          lineWidth: templateMode === "metro" ? 7 : 4,
          mergeStyle:
            templateMode === "metro"
              ? MergeStyle.Bezier
              : MergeStyle.Straight,
          spacing: compact ? 58 : 68,
        },
        commit: {
          spacing: compact ? 96 : 114,
          dot: {
            size: templateMode === "metro" ? 13 : 14,
            strokeWidth: templateMode === "metro" ? 3 : 4,
          },
        },
      }
    );
  }, [templateMode, compact]);

  const sortedCommits = useMemo(() => Object.values(state.commits), [state.commits]);

  const PADDING_LEFT = 76;
  const PADDING_TOP = 84;
  const NODE_SPACING_X = gitgraphTemplate.commit.spacing;
  const LANE_SPACING_Y = gitgraphTemplate.branch.spacing;

  const commitPositions = useMemo(() => {
    const map: Record<string, { x: number; y: number; lane: number }> = {};
    sortedCommits.forEach((c, idx) => {
      const lane = c.lane || 0;
      const x = PADDING_LEFT + idx * NODE_SPACING_X;
      const y = PADDING_TOP + lane * LANE_SPACING_Y;
      map[c.hash] = { x, y, lane };
    });
    return map;
  }, [sortedCommits, NODE_SPACING_X, LANE_SPACING_Y]);

  const width = Math.max(
    680,
    PADDING_LEFT + sortedCommits.length * NODE_SPACING_X + 140
  );
  const maxLane = Math.max(0, ...sortedCommits.map((c) => c.lane || 0));
  const height = PADDING_TOP + (maxLane + 1) * LANE_SPACING_Y + 64;

  const handleNodeClick = (commit: GitCommit) => {
    setSelectedCommitHash(commit.hash);
    if (onSelectCommit) onSelectCommit(commit);
  };

  const selectedCommit = selectedCommitHash
    ? state.commits[selectedCommitHash]
    : null;

  const isDetached = state.head.type === "detached";
  const repoHealthStatus = isDetached
    ? "offline"
    : state.workingDirectory.length > 0
    ? "degraded"
    : "online";

  return (
    <div className="flex flex-col space-y-3">
      <Card className="overflow-hidden border-border bg-card/95 backdrop-blur">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3.5 space-y-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <GitCommitHorizontal className="h-4 w-4 text-emerald-400" />
              <span>Gitgraph.js Commit DAG</span>
            </CardTitle>

            {/* Kibo UI Status Component */}
            <Status status={repoHealthStatus}>
              <StatusIndicator />
              <StatusLabel className="font-mono text-[11px] text-foreground">
                {isDetached
                  ? `HEAD detached at ${state.head.target.slice(0, 7)}`
                  : `HEAD → ${state.head.target}`}
              </StatusLabel>
            </Status>

            {/* Kibo UI Pill Component */}
            <Pill variant="outline" className="hidden sm:inline-flex text-[11px] py-0.5">
              <PillStatus>
                <PillIndicator variant="info" />
                <span>{Object.keys(state.branches).length} branches</span>
              </PillStatus>
              <span className="font-mono text-muted-foreground">
                {sortedCommits.length} commits
              </span>
            </Pill>
          </div>

          {/* shadcn/ui Tabs to switch Gitgraph.js Template */}
          <div className="flex items-center gap-2">
            <Tabs
              value={templateMode}
              onValueChange={(v) =>
                setTemplateMode(v as "metro" | "blackarrow")
              }
            >
              <TabsList className="h-8">
                <TabsTrigger value="metro" className="text-[11px] font-mono px-2.5">
                  Metro (Bezier)
                </TabsTrigger>
                <TabsTrigger value="blackarrow" className="text-[11px] font-mono px-2.5">
                  BlackArrow
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto overflow-y-hidden relative">
          {/* Subtle dot matrix background */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <svg
            width={width}
            height={height}
            className="relative z-10 select-none block"
          >
            {/* Render paths using @gitgraph/core's official toSvgPath() */}
            {sortedCommits.map((child) => {
              const childPos = commitPositions[child.hash];
              if (!childPos) return null;

              return child.parents.map((parentHash, pIdx) => {
                const parentPos = commitPositions[parentHash];
                if (!parentPos) return null;

                const coords: Coordinate[][] = [
                  [
                    { x: parentPos.x, y: parentPos.y },
                    { x: childPos.x, y: childPos.y },
                  ],
                ];

                const isBezier =
                  gitgraphTemplate.branch.mergeStyle === MergeStyle.Bezier;
                const d = toSvgPath(coords, isBezier, false);
                const strokeColor =
                  gitgraphTemplate.colors[
                    childPos.lane % gitgraphTemplate.colors.length
                  ];

                return (
                  <g key={`${parentHash}-${child.hash}-${pIdx}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={gitgraphTemplate.branch.lineWidth}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={child.isMerge && pIdx > 0 ? "7 4" : undefined}
                      className="transition-all duration-300"
                    />
                  </g>
                );
              });
            })}

            {/* Render Commit Dots, Gitgraph.js Branch Labels, and Pointed Tags */}
            {sortedCommits.map((c) => {
              const pos = commitPositions[c.hash];
              if (!pos) return null;

              const isHeadTarget =
                state.head.type === "branch"
                  ? state.branches[state.head.target]?.targetHash === c.hash
                  : state.head.target === c.hash;

              const isSelected = selectedCommitHash === c.hash;
              const branchesHere = Object.values(state.branches).filter(
                (b) => b.targetHash === c.hash
              );
              const tagsHere = Object.entries(state.tags).filter(
                ([, hash]) => hash === c.hash
              );

              const laneColor =
                isDetached && isHeadTarget
                  ? "#f43f5e"
                  : gitgraphTemplate.colors[
                      pos.lane % gitgraphTemplate.colors.length
                    ];

              const dotRadius = gitgraphTemplate.commit.dot.size;

              return (
                <g
                  key={c.hash}
                  className="cursor-pointer group"
                  onClick={() => handleNodeClick(c)}
                >
                  {/* Selection / Active HEAD Halo */}
                  {(isHeadTarget || isSelected) && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={dotRadius + 7}
                      fill="none"
                      stroke={isDetached && isHeadTarget ? "#f43f5e" : "#f59e0b"}
                      strokeWidth="2"
                      strokeDasharray={isSelected ? "4 2" : undefined}
                    />
                  )}

                  {/* Gitgraph.js Commit Dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={dotRadius}
                    fill={
                      templateMode === "metro" ? laneColor : "#09090b"
                    }
                    stroke={
                      templateMode === "metro" ? "#09090b" : laneColor
                    }
                    strokeWidth={gitgraphTemplate.commit.dot.strokeWidth}
                  />

                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="4"
                    fill="#fafafa"
                  />

                  {/* Commit Hash Abbrev */}
                  <text
                    x={pos.x}
                    y={pos.y + dotRadius + 16}
                    textAnchor="middle"
                    fill="#fafafa"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                  >
                    {c.shortHash}
                  </text>

                  {/* Commit Subject */}
                  <text
                    x={pos.x}
                    y={pos.y + dotRadius + 30}
                    textAnchor="middle"
                    fill="#a1a1aa"
                    fontSize="10"
                    fontFamily="sans-serif"
                  >
                    {c.message.length > 17
                      ? c.message.slice(0, 16) + "…"
                      : c.message}
                  </text>

                  {/* Gitgraph.js Branch Labels */}
                  <g transform={`translate(${pos.x}, ${pos.y - dotRadius - 10})`}>
                    {branchesHere.map((branch, bIdx) => {
                      const isHeadBranch =
                        state.head.type === "branch" &&
                        state.head.target === branch.name;
                      const labelText = isHeadBranch
                        ? `HEAD → ${branch.name}`
                        : branch.name;
                      const boxW = Math.max(74, labelText.length * 6.5 + 18);
                      return (
                        <g
                          key={branch.name}
                          transform={`translate(0, ${-bIdx * 23})`}
                        >
                          <rect
                            x={-boxW / 2}
                            y="-18"
                            width={boxW}
                            height="20"
                            rx="6"
                            fill="#18181b"
                            stroke={isHeadBranch ? "#f59e0b" : laneColor}
                            strokeWidth="1.5"
                          />
                          <text
                            x="0"
                            y="-5"
                            textAnchor="middle"
                            fill={isHeadBranch ? "#fbbf24" : "#fafafa"}
                            fontSize="10"
                            fontWeight="600"
                            fontFamily="monospace"
                          >
                            {labelText}
                          </text>
                        </g>
                      );
                    })}

                    {/* Detached HEAD Label */}
                    {isDetached && state.head.target === c.hash && (
                      <g
                        transform={`translate(0, ${
                          -branchesHere.length * 23
                        })`}
                      >
                        <rect
                          x="-56"
                          y="-18"
                          width="112"
                          height="20"
                          rx="6"
                          fill="#4c0519"
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="-5"
                          textAnchor="middle"
                          fill="#fda4af"
                          fontSize="10"
                          fontWeight="600"
                          fontFamily="monospace"
                        >
                          HEAD (detached)
                        </text>
                      </g>
                    )}

                    {/* Authentic Gitgraph.js Pointed SVG Tag (from @gitgraph/react Tag.tsx) */}
                    {tagsHere.map(([tagName], tIdx) => {
                      const tagYOffset =
                        -(
                          branchesHere.length +
                          (isDetached && state.head.target === c.hash ? 1 : 0) +
                          tIdx
                        ) *
                          23 -
                        9;
                      const tagW = Math.max(54, tagName.length * 6.5 + 22);
                      const tagH = 18;
                      const pointerW = 7;
                      const r = 4;
                      const halfW = tagW / 2;
                      const halfH = tagH / 2;
                      const tagPath = [
                        `M ${-halfW},0`,
                        `L ${-halfW + pointerW},${halfH}`,
                        `H ${halfW - r}`,
                        `Q ${halfW},${halfH} ${halfW},${halfH - r}`,
                        `V ${-(halfH - r)}`,
                        `Q ${halfW},${-halfH} ${halfW - r},${-halfH}`,
                        `H ${-halfW + pointerW}`,
                        `Z`,
                      ].join(" ");

                      return (
                        <g
                          key={tagName}
                          transform={`translate(0, ${tagYOffset})`}
                        >
                          <path
                            d={tagPath}
                            fill="#18181b"
                            stroke="#10b981"
                            strokeWidth="1.25"
                          />
                          <text
                            x={pointerW / 2}
                            y="3.5"
                            textAnchor="middle"
                            fill="#34d399"
                            fontSize="9.5"
                            fontWeight="600"
                            fontFamily="monospace"
                          >
                            {tagName}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                </g>
              );
            })}
          </svg>
        </CardContent>
      </Card>

      {/* Selected Commit Inspector with Kibo UI Snippet */}
      {selectedCommit && (
        <Card className="border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="emerald" className="font-mono">
                  {selectedCommit.hash}
                </Badge>
                <span className="text-sm font-semibold text-foreground">
                  {selectedCommit.message}
                </span>
              </div>
              <CardDescription className="font-mono text-xs flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3 w-3" />
                  Parents:{" "}
                  {selectedCommit.parents.length > 0
                    ? selectedCommit.parents.join(", ")
                    : "root-commit"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <TagIcon className="h-3 w-3" />
                  Author: {selectedCommit.author}
                </span>
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setSelectedCommitHash(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Kibo UI Snippet for quick CLI checkout / cherry-pick */}
          <Snippet defaultValue="checkout">
            <SnippetHeader>
              <SnippetTabsList className="h-7">
                <SnippetTabsTrigger value="checkout">
                  Checkout
                </SnippetTabsTrigger>
                <SnippetTabsTrigger value="cherry-pick">
                  Cherry-pick
                </SnippetTabsTrigger>
                <SnippetTabsTrigger value="reset">
                  Reset
                </SnippetTabsTrigger>
              </SnippetTabsList>
              <SnippetCopyButton
                value={`git checkout ${selectedCommit.shortHash}`}
              />
            </SnippetHeader>
            <SnippetTabsContent value="checkout">
              {`git checkout ${selectedCommit.shortHash}`}
            </SnippetTabsContent>
            <SnippetTabsContent value="cherry-pick">
              {`git cherry-pick ${selectedCommit.shortHash}`}
            </SnippetTabsContent>
            <SnippetTabsContent value="reset">
              {`git reset --hard ${selectedCommit.shortHash}`}
            </SnippetTabsContent>
          </Snippet>
        </Card>
      )}
    </div>
  );
};
