"use client";

import React, { useState } from "react";
import { Play, CheckCircle2, Loader2, AlertTriangle, RefreshCw, Terminal } from "lucide-react";
import { Button } from "@/types/../components/ui/Button";

interface StageState {
  name: string;
  status: "idle" | "running" | "success" | "error";
  duration: string;
  logLines: string[];
}

export const PipelineVisualizer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<number>(0);

  const [stages, setStages] = useState<StageState[]>([
    {
      name: "build",
      status: "idle",
      duration: "18s",
      logLines: [
        "$ npm ci --cache .npm --prefer-offline",
        "added 342 packages in 4.12s",
        "$ npm run build",
        "> devops-app@1.0.0 build",
        "> next build",
        "✓ Compiled successfully in 12.4s",
        "✓ Generating static pages (14/14)",
        "Saving cache for successful job...",
        "Uploading artifacts: dist/ ... OK",
      ],
    },
    {
      name: "test",
      status: "idle",
      duration: "24s",
      logLines: [
        "$ npm run test:coverage",
        "PASS src/auth/jwt.test.ts",
        "PASS src/services/pricing.test.ts",
        "PASS src/controllers/order.test.ts",
        "Test Suites: 8 passed, 8 total",
        "Tests:       42 passed, 42 total",
        "Snapshots:   0 total",
        "Time:        6.21s",
        "All files | 94.2% Statements | 89.1% Branch",
      ],
    },
    {
      name: "notify",
      status: "idle",
      duration: "3s",
      logLines: [
        "$ curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"CI Passed for MR #42\"}' $SLACK_WEBHOOK",
        "HTTP/2 200 OK",
        "Notification dispatched to #devops-channel and GitLab MR updated with green pipeline badge.",
      ],
    },
    {
      name: "deploy_staging",
      status: "idle",
      duration: "35s",
      logLines: [
        "$ docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY",
        "Login Succeeded",
        "$ docker build -t registry.isims.tn/devops/app:$CI_COMMIT_SHA .",
        "Successfully tagged registry.isims.tn/devops/app:$CI_COMMIT_SHA",
        "$ docker push registry.isims.tn/devops/app:$CI_COMMIT_SHA",
        "Pushed 3 layers, SHA: 8f9b2a1",
        "$ helm upgrade --install devops-staging ./helm/app --set image.tag=$CI_COMMIT_SHA",
        "Release 'devops-staging' has been upgraded. Happy Helming!",
        "Environment available at: https://staging.devops-lab.isims.tn",
      ],
    },
  ]);

  const runPipeline = async () => {
    setIsRunning(true);
    setCurrentStageIdx(0);

    // Reset all stages to idle
    setStages((prev) =>
      prev.map((s) => ({ ...s, status: "idle" }))
    );

    for (let i = 0; i < stages.length; i++) {
      setCurrentStageIdx(i);
      setActiveTab(i);
      setStages((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "running" } : s))
      );

      // simulate execution delay
      await new Promise((res) => setTimeout(res, 900));

      setStages((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: "success" } : s))
      );
    }

    setIsRunning(false);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Simulateur d&apos;Exécution</span>
          <h3 className="text-lg font-bold text-zinc-100">Pipeline GitLab CI Interactive (.gitlab-ci.yml)</h3>
        </div>
        <Button
          onClick={runPipeline}
          disabled={isRunning}
          variant="primary"
          size="sm"
          icon={isRunning ? <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> : <Play className="w-4 h-4 text-zinc-950 fill-current" />}
        >
          {isRunning ? "Pipeline en cours..." : "Lancer la Pipeline CI"}
        </Button>
      </div>

      {/* Visual Pipeline Stages */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stages.map((stage, idx) => {
          const isSelected = activeTab === idx;
          return (
            <button
              key={stage.name}
              onClick={() => setActiveTab(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? "border-amber-500/50 bg-zinc-900/90 shadow-gold-glow/20"
                  : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-zinc-200">stage: {stage.name}</span>
                {stage.status === "running" && (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                )}
                {stage.status === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {stage.status === "idle" && (
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-700"></span>
                )}
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>{stage.status === "running" ? "En cours..." : stage.status === "success" ? "Réussi" : "En attente"}</span>
                <span className="font-mono text-zinc-500">{stage.duration}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Runner Terminal Log Output */}
      <div className="rounded-xl bg-black/90 border border-zinc-800 p-4 font-mono text-xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-zinc-400 text-[11px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>GitLab Runner #4829 (docker executor) &bull; Job: {stages[activeTab]?.name}</span>
          </div>
          <span className="text-emerald-400 font-semibold">
            {stages[activeTab]?.status === "running" ? "Running" : stages[activeTab]?.status === "success" ? "Job Succeeded" : "Ready"}
          </span>
        </div>

        <div className="space-y-1.5 text-zinc-300 max-h-48 overflow-y-auto">
          {stages[activeTab]?.logLines.map((line, i) => (
            <div
              key={i}
              className={`leading-relaxed ${
                line.startsWith("$")
                  ? "text-cyan-400 font-bold"
                  : line.includes("PASS") || line.includes("OK") || line.includes("successfully") || line.includes("Succeeded")
                  ? "text-emerald-400"
                  : "text-zinc-400"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
