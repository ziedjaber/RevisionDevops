"use client";

import React, { useState } from "react";
import { GitRepoState, GitCommit } from "@/types/git";
import { motion } from "framer-motion";

interface GitGraphCanvasProps {
  state: GitRepoState;
  onSelectCommit?: (commit: GitCommit) => void;
  compact?: boolean;
}

export const GitGraphCanvas: React.FC<GitGraphCanvasProps> = ({
  state,
  onSelectCommit,
  compact = false,
}) => {
  const [selectedCommitHash, setSelectedCommitHash] = useState<string | null>(null);

  const allCommits = Object.values(state.commits);
  const NODE_SPACING_X = compact ? 95 : 110;
  const LANE_SPACING_Y = compact ? 64 : 72;
  const PADDING_LEFT = 75;
  const PADDING_TOP = 82;

  const sortedCommits = [...allCommits];
  const commitPositions: Record<string, { x: number; y: number; lane: number }> = {};

  sortedCommits.forEach((c, idx) => {
    const x = PADDING_LEFT + idx * NODE_SPACING_X;
    const y = PADDING_TOP + (c.lane || 0) * LANE_SPACING_Y;
    commitPositions[c.hash] = { x, y, lane: c.lane || 0 };
  });

  const width = Math.max(640, PADDING_LEFT + sortedCommits.length * NODE_SPACING_X + 130);
  const maxLane = Math.max(0, ...sortedCommits.map((c) => c.lane || 0));
  const height = PADDING_TOP + (maxLane + 1) * LANE_SPACING_Y + 60;

  const handleNodeClick = (commit: GitCommit) => {
    setSelectedCommitHash(commit.hash);
    if (onSelectCommit) onSelectCommit(commit);
  };

  const selectedCommit = selectedCommitHash ? state.commits[selectedCommitHash] : null;

  return (
    <div className="flex flex-col space-y-3">
      <div className="relative rounded-2xl border border-[#1e2330] bg-[#0d1117]/95 backdrop-blur-xl overflow-x-auto overflow-y-hidden shadow-subtle-card">
        {/* Subtle technical grid */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#f59e0b 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Legend bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-[#1e2330] bg-[#12151d]/90 text-[11px] font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" />
              Commit SHA-1
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] inline-block" />
              Pointeur HEAD
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] inline-block" />
              Merge (2 parents)
            </span>
            {state.head.type === "detached" && (
              <span className="flex items-center gap-1.5 text-red-400 font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block" />
                ALERTE : HEAD DÉTACHÉE
              </span>
            )}
          </div>
          <span className="text-zinc-500">Cliquez sur un nœud pour inspecter son snapshot</span>
        </div>

        <svg width={width} height={height} className="relative z-10 select-none">
          <defs>
            <filter id="glowNode" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connecting edges */}
          {sortedCommits.map((child) => {
            const childPos = commitPositions[child.hash];
            if (!childPos) return null;

            return child.parents.map((parentHash) => {
              const parentPos = commitPositions[parentHash];
              if (!parentPos) return null;

              const isStraight = parentPos.y === childPos.y;
              const pathData = isStraight
                ? `M ${parentPos.x} ${parentPos.y} L ${childPos.x} ${childPos.y}`
                : `M ${parentPos.x} ${parentPos.y} C ${parentPos.x + 45} ${parentPos.y}, ${childPos.x - 45} ${childPos.y}, ${childPos.x} ${childPos.y}`;

              return (
                <path
                  key={`${parentHash}-${child.hash}`}
                  d={pathData}
                  fill="none"
                  stroke={child.isMerge ? "#8b5cf6" : "#10b981"}
                  strokeWidth="2.5"
                  strokeDasharray={child.isMerge ? "5 3" : undefined}
                  className="transition-all duration-500 opacity-75"
                />
              );
            });
          })}

          {/* Commit Nodes */}
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
            const tagsHere = Object.entries(state.tags).filter(([, hash]) => hash === c.hash);

            return (
              <g
                key={c.hash}
                className="cursor-pointer group"
                onClick={() => handleNodeClick(c)}
              >
                {(isHeadTarget || isSelected) && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="20"
                    fill="none"
                    stroke={
                      state.head.type === "detached" && isHeadTarget
                        ? "#ef4444"
                        : isSelected
                        ? "#f59e0b"
                        : "#06b6d4"
                    }
                    strokeWidth="2.5"
                    strokeOpacity="0.85"
                    filter="url(#glowNode)"
                  />
                )}

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={c.isMerge ? "14" : "12"}
                  fill={
                    state.head.type === "detached" && isHeadTarget
                      ? "#450a0a"
                      : c.isMerge
                      ? "#2e1065"
                      : "#064e3b"
                  }
                  stroke={
                    state.head.type === "detached" && isHeadTarget
                      ? "#ef4444"
                      : c.isMerge
                      ? "#8b5cf6"
                      : isHeadTarget
                      ? "#06b6d4"
                      : "#10b981"
                  }
                  strokeWidth="2.5"
                />

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill={
                    state.head.type === "detached" && isHeadTarget
                      ? "#f87171"
                      : c.isMerge
                      ? "#c4b5fd"
                      : "#34d399"
                  }
                />

                {/* Short SHA-1 */}
                <text
                  x={pos.x}
                  y={pos.y + 27}
                  textAnchor="middle"
                  fill="#e2e8f0"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  {c.shortHash}
                </text>

                {/* Commit message preview */}
                <text
                  x={pos.x}
                  y={pos.y + 41}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9.5"
                  fontFamily="sans-serif"
                >
                  {c.message.length > 16 ? c.message.slice(0, 15) + "…" : c.message}
                </text>

                {/* Branch Badges & HEAD */}
                <g transform={`translate(${pos.x}, ${pos.y - 24})`}>
                  {branchesHere.map((branch, bIdx) => {
                    const isHeadBranch =
                      state.head.type === "branch" && state.head.target === branch.name;
                    const labelText = isHeadBranch ? `HEAD → ${branch.name}` : branch.name;
                    const boxW = Math.max(78, labelText.length * 6.5 + 16);
                    return (
                      <g
                        key={branch.name}
                        transform={`translate(0, ${-bIdx * 22})`}
                        className="select-none"
                      >
                        <rect
                          x={-boxW / 2}
                          y="-16"
                          width={boxW}
                          height="18"
                          rx="6"
                          fill="#12151d"
                          stroke={isHeadBranch ? "#06b6d4" : "#f59e0b"}
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fill={isHeadBranch ? "#22d3ee" : "#fbbf24"}
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {labelText}
                        </text>
                      </g>
                    );
                  })}

                  {/* Detached HEAD badge */}
                  {state.head.type === "detached" && state.head.target === c.hash && (
                    <g transform={`translate(0, ${-branchesHere.length * 22})`}>
                      <rect
                        x="-58"
                        y="-16"
                        width="116"
                        height="18"
                        rx="6"
                        fill="#450a0a"
                        stroke="#ef4444"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#fca5a5"
                        fontSize="9.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        ⚡ HEAD (détachée)
                      </text>
                    </g>
                  )}

                  {/* Tags */}
                  {tagsHere.map(([tagName], tIdx) => (
                    <g
                      key={tagName}
                      transform={`translate(0, ${
                        -(branchesHere.length + (state.head.type === "detached" && state.head.target === c.hash ? 1 : 0) + tIdx) * 21
                      })`}
                    >
                      <rect
                        x="-34"
                        y="-15"
                        width="68"
                        height="16"
                        rx="5"
                        fill="#1e1b4b"
                        stroke="#8b5cf6"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#ddd6fe"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
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

      {/* Commit Inspector */}
      {selectedCommit && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl border border-[#1e2330] bg-[#12151d]/95 flex flex-wrap items-center justify-between gap-4 text-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                SHA-1: {selectedCommit.hash}
              </span>
              <span className="text-zinc-100 font-semibold">{selectedCommit.message}</span>
            </div>
            <div className="text-zinc-400 flex items-center gap-3 text-[11px] font-mono">
              <span>
                Parents :{" "}
                <strong className="text-cyan-400">
                  {selectedCommit.parents.length > 0
                    ? selectedCommit.parents.join(" + ")
                    : "root-commit (aucun parent)"}
                </strong>
              </span>
              <span>&bull;</span>
              <span>Auteur : {selectedCommit.author}</span>
            </div>
          </div>
          <button
            onClick={() => setSelectedCommitHash(null)}
            className="px-2.5 py-1 text-zinc-400 hover:text-zinc-200 bg-[#090a0f] border border-[#1e2330] rounded-lg font-mono text-[11px]"
          >
            Fermer
          </button>
        </motion.div>
      )}
    </div>
  );
};
