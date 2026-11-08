"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Send, RotateCcw } from "lucide-react";
import { CommandOutput } from "@/types/git";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Status, StatusIndicator, StatusLabel } from "@/components/ui/kibo-ui";

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
      const nextIdx =
        historyIndex + 1 < userCommands.length ? historyIndex + 1 : historyIndex;
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
    <Card className="overflow-hidden flex flex-col font-mono text-xs border-border bg-card/95">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border space-y-0">
        <div className="flex items-center gap-2.5">
          <TerminalIcon className="w-4 h-4 text-sky-400" />
          <CardTitle className="text-xs font-semibold font-sans">
            Git Interactive Shell
          </CardTitle>
          <Status status="online" className="py-0 px-2">
            <StatusIndicator />
            <StatusLabel className="text-[10px] font-mono">git 2.47</StatusLabel>
          </Status>
        </div>
        <Button
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </CardHeader>

      <CardContent className="p-0 flex flex-col">
        <div
          ref={scrollRef}
          className="p-4 flex-1 min-h-[200px] max-h-[280px] overflow-y-auto space-y-3 bg-background/60 select-text"
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-emerald-400 font-bold">
                  devops@lab:~/repo$
                </span>
                <span className="text-foreground font-semibold">
                  {item.command}
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">
                  {item.timestamp}
                </span>
              </div>
              <pre
                className={`p-2.5 rounded-lg text-[11px] whitespace-pre-wrap leading-relaxed border ${
                  item.type === "error"
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    : item.type === "warning"
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : item.type === "success"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-secondary/50 text-foreground border-border"
                }`}
              >
                {item.output}
              </pre>
            </div>
          ))}
        </div>

        {/* Quick Command Pills */}
        <div className="px-3 py-2 bg-muted/20 border-t border-border flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] text-muted-foreground shrink-0 mr-1 font-sans">
            Quick run:
          </span>
          {quickCommands.map((q) => (
            <button
              key={q.cmd}
              type="button"
              onClick={() => {
                onExecute(q.cmd);
                inputRef.current?.focus();
              }}
              className="shrink-0 px-2.5 py-1 rounded-md bg-secondary hover:bg-accent text-secondary-foreground border border-border text-[10.5px] transition-colors"
            >
              {q.cmd}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-background border-t border-border"
        >
          <span className="text-emerald-400 font-bold shrink-0">git&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a git command (e.g. git commit -m 'feat: ...', git merge feature, git switch -c dev)..."
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none text-xs"
          />
          <Button type="submit" size="sm" className="h-7 px-2.5">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
