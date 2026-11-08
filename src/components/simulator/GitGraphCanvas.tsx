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
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl overflow-x-auto overflow-y-hidden shadow-saas-card">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Legend bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" />
              Commit SHA-1
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
              Pointeur HEAD
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] inline-block" />
              Branche / Merge
            </span>
            {state.head.type === "detached" && (
              <span className="flex items-center gap-1.5 text-[#f43f5e] font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e] inline-block" />
                WARNING : HEAD DÉTACHÉE
              </span>
            )}
          </div>
          <span className="text-slate-400">Cliquez sur un commit pour inspecter son snapshot</span>
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
                  stroke={child.isMerge ? "#6366f1" : "#10b981"}
                  strokeWidth="2.5"
                  strokeDasharray={child.isMerge ? "5 3" : undefined}
                  className="transition-all duration-500 opacity-80"
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
                        ? "#f43f5e"
                        : isHeadTarget
                        ? "#f59e0b"
                        : "#3b82f6"
                    }
                    strokeWidth="2.5"
                    strokeOpacity="0.9"
                    filter="url(#glowNode)"
                  />
                )}

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={c.isMerge ? "14" : "12"}
                  fill={
                    state.head.type === "detached" && isHeadTarget
                      ? "#4c0519"
                      : c.isMerge
                      ? "#1e1b4b"
                      : "#064e3b"
                  }
                  stroke={
                    state.head.type === "detached" && isHeadTarget
                      ? "#f43f5e"
                      : isHeadTarget
                      ? "#f59e0b"
                      : c.isMerge
                      ? "#6366f1"
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
                      ? "#fb7185"
                      : isHeadTarget
                      ? "#fbbf24"
                      : c.isMerge
                      ? "#818cf8"
                      : "#34d399"
                  }
                />

                {/* Short SHA-1 */}
                <text
                  x={pos.x}
                  y={pos.y + 27}
                  textAnchor="middle"
                  fill="#f1f5f9"
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
                  fill="#94a3b8"
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
                          fill="#0f172a"
                          stroke={isHeadBranch ? "#f59e0b" : "#3b82f6"}
                          strokeWidth="1.5"
                        />
                        <text
                          x="0"
                          y="-4"
                          textAnchor="middle"
                          fill={isHeadBranch ? "#fbbf24" : "#93c5fd"}
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
                        fill="#4c0519"
                        stroke="#f43f5e"
                        strokeWidth="1.5"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#fda4af"
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
                        fill="#064e3b"
                        stroke="#10b981"
                        strokeWidth="1.2"
                      />
                      <text
                        x="0"
                        y="-4"
                        textAnchor="middle"
                        fill="#a7f3d0"
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
          className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4 text-xs"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                SHA-1: {selectedCommit.hash}
              </span>
              <span className="text-slate-100 font-semibold">{selectedCommit.message}</span>
            </div>
            <div className="text-slate-400 flex items-center gap-3 text-[11px] font-mono">
              <span>
                Parents :{" "}
                <strong className="text-blue-400">
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
            className="px-2.5 py-1 text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px]"
          >
            Fermer
          </button>
        </motion.div>
      )}
    </div>
  );
};
