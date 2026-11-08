"use client";

import React, { useState } from "react";
import { GitRepoState, GitCommit } from "@/types/git";
import { GitCommit as CommitIcon, GitBranch as BranchIcon, Tag as TagIcon, Eye, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GitGraphCanvasProps {
  state: GitRepoState;
  onSelectCommit?: (commit: GitCommit) => void;
}

export const GitGraphCanvas: React.FC<GitGraphCanvasProps> = ({ state, onSelectCommit }) => {
  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(null);

  // Sort commits topologically: oldest to newest
  const allCommits = Object.values(state.commits);

  // Compute node coordinates
  // X: time axis from left to right
  // Y: lane axis (each lane gets a distinct vertical track)
  const NODE_SPACING_X = 90;
  const LANE_SPACING_Y = 65;
  const PADDING_LEFT = 60;
  const PADDING_TOP = 80;

  // Topological sorting or creation order
  const sortedCommits = [...allCommits];

  // Map each commit to (x, y)
  const commitPositions: Record<string, { x: number; y: number; lane: number }> = {};

  sortedCommits.forEach((c, idx) => {
    const x = PADDING_LEFT + idx * NODE_SPACING_X;
    const y = PADDING_TOP + (c.lane || 0) * LANE_SPACING_Y;
    commitPositions[c.hash] = { x, y, lane: c.lane || 0 };
  });

  const width = Math.max(700, PADDING_LEFT + sortedCommits.length * NODE_SPACING_X + 120);
  const maxLane = Math.max(0, ...sortedCommits.map((c) => c.lane || 0));
  const height = PADDING_TOP + (maxLane + 1) * LANE_SPACING_Y + 70;

  const handleNodeClick = (commit: GitCommit) => {
    setSelectedCommitHash(commit.hash);
    if (onSelectCommit) onSelectCommit(commit);
  };

  const selectedCommit = selectedCommitHash ? state.commits[selectedCommitHash] : null;

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative rounded-2xl border border-zinc-800 bg-[#0B0D14]/90 backdrop-blur-xl overflow-x-auto overflow-y-hidden shadow-subtle-card">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#F59E0B 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <svg width={width} height={height} className="relative z-10 select-none">
          <defs>
            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Draw connecting edges between parent commits and child commits */}
          {sortedCommits.map((child) => {
            const childPos = commitPositions[child.hash];
            if (!childPos) return null;

            return child.parents.map((parentHash) => {
              const parentPos = commitPositions[parentHash];
              if (!parentPos) return null;

              // Bezier curve connecting parent to child
              const isStraight = parentPos.y === childPos.y;
              const pathData = isStraight
                ? `M ${parentPos.x} ${parentPos.y} L ${childPos.x} ${childPos.y}`
                : `M ${parentPos.x} ${parentPos.y} C ${parentPos.x + 40} ${parentPos.y}, ${childPos.x - 40} ${childPos.y}, ${childPos.x} ${childPos.y}`;

              return (
                <path
                  key={`${parentHash}-${child.hash}`}
                  d={pathData}
                  fill="none"
                  stroke={child.isMerge ? "#EC4899" : "#06B6D4"}
                  strokeWidth="2.5"
                  strokeDasharray={child.isMerge ? "4 2" : undefined}
                  className="transition-all duration-500 opacity-70 hover:opacity-100"
                />
              );
            });
          })}

          {/* Draw Commit Nodes */}
          {sortedCommits.map((c) => {
            const pos = commitPositions[c.hash];
            if (!pos) return null;

            const isHeadTarget =
              state.head.type === "branch"
                ? state.branches[state.head.target]?.targetHash === c.hash
                : state.head.target === c.hash;

            const isSelected = selectedCommitHash === c.hash;

            // Find branches pointing to this commit
            const branchesHere = Object.values(state.branches).filter(
              (b) => b.targetHash === c.hash
            );

            // Find tags on this commit
            const tagsHere = Object.entries(state.tags).filter(([, hash]) => hash === c.hash);

            return (
              <g
                key={c.hash}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(c)}
              >
                {/* Outer Glow ring if HEAD or Selected */}
                {(isHeadTarget || isSelected) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="19"
                    fill="none"
                    stroke={isSelected ? "#F59E0B" : "#06B6D4"}
                    strokeWidth="2.5"
                    strokeOpacity="0.8"
                    filter="url(#glow)"
                    className="animate-pulse"
                  />
                )}

                {/* Commit Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={c.isMerge ? "14" : "12"}
                  fill={c.isMerge ? "#831843" : "#0F172A"}
                  stroke={c.isMerge ? "#EC4899" : isHeadTarget ? "#06B6D4" : "#475569"}
                  strokeWidth="2.5"
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                {/* Inner dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill={c.isMerge ? "#F472B6" : isHeadTarget ? "#38BDF8" : "#94A3B8"}
                />

                {/* Short SHA label below commit */}
                <text
                  x={pos.x}
                  y={pos.y + 26}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {c.shortHash}
                </text>

                {/* Branch Badges & HEAD Badge above commit */}
                <g transform={`translate(${pos.x}, ${pos.y - 24})`}>
                  {branchesHere.map((branch, bIdx) => {
                    const isHeadBranch = state.head.type === "branch" && state.head.target === branch.name;
                    return (
                      <g
                        key={branch.name}
                        transform={`translate(0, ${-bIdx * 22})`}
                        className="select-none"
                      >
                        <rect
                          x="-38"
                          y="-16"
                          width="76"
                          height="18"
                          rx="9"
                          fill="#1E293B"
                          stroke={isHeadBranch ? "#F59E0B" : branch.color}
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fill={isHeadBranch ? "#FCD34D" : "#E2E8F0"}
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {isHeadBranch ? `HEAD➔${branch.name}` : branch.name}
                        </text>
                      </g>
                    );
                  })}

                  {/* Detached HEAD badge */}
                  {state.head.type === "detached" && state.head.target === c.hash && (
                    <g transform={`translate(0, ${-branchesHere.length * 22})`}>
                      <rect
                        x="-48"
                        y="-16"
                        width="96"
                        height="18"
                        rx="9"
                        fill="#7F1D1D"
                        stroke="#EF4444"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#FECACA"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        HEAD (détachée)
                      </text>
                    </g>
                  )}

                  {/* Tags */}
                  {tagsHere.map(([tagName], tIdx) => (
                    <g
                      key={tagName}
                      transform={`translate(0, ${-(branchesHere.length + (state.head.type === "detached" ? 1 : 0) + tIdx) * 20})`}
                    >
                      <rect
                        x="-30"
                        y="-15"
                        width="60"
                        height="16"
                        rx="8"
                        fill="#064E3B"
                        stroke="#10B981"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#A7F3D0"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        🏷 {tagName}
                      </text>
                    </g>
                  ))}
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Commit Detail Inspector */}
      {selectedCommit && (
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                {selectedCommit.hash}
              </span>
              <span className="text-zinc-200 font-medium text-sm">{selectedCommit.message}</span>
            </div>
            <div className="text-zinc-400 flex items-center gap-3 text-[11px]">
              <span>Auteur : <strong className="text-zinc-300">{selectedCommit.author}</strong></span>
              <span>&bull;</span>
              <span>Parents : <span className="font-mono text-cyan-400">{selectedCommit.parents.length > 0 ? selectedCommit.parents.join(", ") : "aucun (root commit)"}</span></span>
              <span>&bull;</span>
              <span>Date : {selectedCommit.timestamp}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedCommitHash(null)}
            className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 bg-zinc-800 rounded-lg"
          >
            Fermer l&apos;inspecteur
          </button>
        </div>
      )}
    </div>
  );
};
