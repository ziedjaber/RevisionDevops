"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Send, RotateCcw, Sparkles } from "lucide-react";
import { CommandOutput } from "@/types/git";

interface GitTerminalProps {
  history: CommandOutput[];
  onExecute: (command: string) => void;
  onClear: () => void;
}

export const GitTerminal: React.FC<GitTerminalProps> = ({
  history,
  onExecute,
  onClear,
}) => {
  const [inputVal, setInputVal] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    onExecute(inputVal);
    setInputVal("");
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const userCommands = history.map((h) => h.command);

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (userCommands.length === 0) return;
      const nextIdx = historyIndex + 1 < userCommands.length ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInputVal(userCommands[userCommands.length - 1 - nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(userCommands[userCommands.length - 1 - nextIdx] || "");
      } else {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  const quickCommands = [
    { label: "status", cmd: "git status" },
    { label: "add .", cmd: "git add ." },
    { label: "commit", cmd: 'git commit -m "feat: implement caching layer"' },
    { label: "amend", cmd: 'git commit --amend -m "feat: improved auth & tests"' },
    { label: "branch", cmd: "git branch feature/payments" },
    { label: "switch", cmd: "git switch feature/payments" },
    { label: "merge", cmd: "git merge feature/payments" },
    { label: "rebase", cmd: "git rebase main" },
    { label: "detached HEAD", cmd: "git checkout c2b345b" },
    { label: "reset --soft", cmd: "git reset --soft HEAD~1" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0B0D14]/95 backdrop-blur-xl shadow-subtle-card overflow-hidden flex flex-col font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-zinc-400 font-semibold flex items-center gap-1.5 ml-2 text-[11px]">
            <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
            Git Interactive Terminal (bash)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClear}
            className="text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 text-[11px]"
            title="Effacer l'historique du terminal"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div
        ref={scrollRef}
        className="p-4 flex-1 min-h-[220px] max-h-[320px] overflow-y-auto space-y-3 select-text"
      >
        <div className="text-zinc-500 text-[11px] pb-1 border-b border-zinc-800/60 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Simulateur Git v2.47 initialisé. Tapez vos commandes ci-dessous ou cliquez sur les raccourcis.
        </div>

        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-emerald-400 font-bold">devops@lab:~/repo$</span>
              <span className="text-zinc-100 font-semibold">{item.command}</span>
              <span className="text-[10px] text-zinc-600 ml-auto">{item.timestamp}</span>
            </div>
            <pre
              className={`p-2 rounded-lg text-[11px] whitespace-pre-wrap leading-relaxed ${
                item.type === "error"
                  ? "bg-rose-950/30 text-rose-300 border border-rose-500/30"
                  : item.type === "warning"
                  ? "bg-amber-950/30 text-amber-300 border border-amber-500/30"
                  : item.type === "success"
                  ? "bg-emerald-950/20 text-emerald-300 border border-emerald-500/20"
                  : "bg-zinc-900/60 text-zinc-300 border border-zinc-800/60"
              }`}
            >
              {item.output}
            </pre>
          </div>
        ))}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-3 py-2 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] text-zinc-500 uppercase tracking-wider flex-shrink-0 mr-1">Raccourcis :</span>
        {quickCommands.map((q) => (
          <button
            key={q.cmd}
            onClick={() => {
              onExecute(q.cmd);
              inputRef.current?.focus();
            }}
            className="flex-shrink-0 px-2 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300 hover:text-amber-300 border border-zinc-700/60 text-[10.5px] transition-all"
          >
            {q.cmd}
          </button>
        ))}
      </div>

      {/* Terminal Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-3 py-2.5 bg-zinc-950 border-t border-zinc-800"
      >
        <span className="text-emerald-400 font-bold flex-shrink-0">git&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Entrez une commande (ex: git commit -m 'feat: ...', git merge feature, git checkout -b dev)..."
          className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none text-xs"
          autoFocus
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
          title="Exécuter la commande"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
