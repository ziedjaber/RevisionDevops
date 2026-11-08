"use client";

import React, { useState } from "react";
import { Chapter } from "@/types/course";
import {
  CheckCircle2,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { DockerVsVmDiagram } from "./DockerVsVmDiagram";
import { GitFlowDiagram } from "./GitFlowDiagram";
import { PipelineVisualizer } from "./PipelineVisualizer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import confetti from "canvas-confetti";

interface ChapterViewerProps {
  chapter: Chapter;
  isCompleted: boolean;
  onToggleComplete: (chapterId: number) => void;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export const ChapterViewer: React.FC<ChapterViewerProps> = ({
  chapter,
  isCompleted,
  onToggleComplete,
  onNextChapter,
  onPrevChapter,
}) => {
  const [copiedSnippetIdx, setCopiedSnippetIdx] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetIdx(id);
    setTimeout(() => setCopiedSnippetIdx(null), 2000);
  };

  const handleCompleteClick = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#F59E0B", "#06B6D4", "#10B981"],
      });
    }
    onToggleComplete(chapter.id);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Chapter Hero Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-[#0F121C] to-zinc-950/90 backdrop-blur-xl shadow-subtle-card overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="gold">Chapitre {chapter.id} sur 8</Badge>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs text-zinc-400 font-mono">{chapter.slidesRef}</span>
              <span className="text-zinc-600">&bull;</span>
              <span className="text-xs text-zinc-400">{chapter.estimatedTime} de lecture</span>
            </div>
            <button
              onClick={handleCompleteClick}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isCompleted
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:border-amber-500/40"
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? "text-emerald-400" : "text-zinc-500"}`} />
              {isCompleted ? "Chapitre Maîtrisé ✓" : "Marquer comme terminé"}
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            {chapter.title}
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">
            {chapter.summary}
          </p>

          {/* Key Objectives */}
          <div className="pt-4 border-t border-zinc-800/80">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Objectifs Pédagogiques Clés :
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              {chapter.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Embedded Interactive Diagram if applicable */}
      {chapter.diagramType === "architecture" && <ArchitectureDiagram />}
      {chapter.diagramType === "docker" && <DockerVsVmDiagram />}
      {chapter.diagramType === "gitflow" && <GitFlowDiagram />}
      {chapter.diagramType === "cicd" && <PipelineVisualizer />}

      {/* Detailed Sections */}
      <div className="space-y-6">
        {chapter.sections.map((section) => (
          <div
            key={section.id}
            className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md space-y-4"
          >
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">{section.title}</h3>
              {section.badge && <Badge variant="cyan">{section.badge}</Badge>}
            </div>

            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-2">
              {section.content}
            </div>

            {/* Key Points */}
            {section.keyPoints && section.keyPoints.length > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Points essentiels à retenir :
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {section.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Callouts */}
            {section.callout && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                  section.callout.type === "warning"
                    ? "bg-rose-950/20 border-rose-500/30 text-rose-200"
                    : section.callout.type === "tip"
                    ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
                    : "bg-amber-950/20 border-amber-500/30 text-amber-200"
                }`}
              >
                {section.callout.type === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : section.callout.type === "tip" ? (
                  <Lightbulb className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="block font-bold mb-1 text-zinc-100">{section.callout.title}</strong>
                  <span>{section.callout.text}</span>
                </div>
              </div>
            )}

            {/* Code Snippets */}
            {section.codeSnippets?.map((snip, sIdx) => {
              const snippetId = `${section.id}-${sIdx}`;
              return (
                <div key={sIdx} className="rounded-xl border border-zinc-800 bg-black/80 overflow-hidden font-mono text-xs">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-[11px] text-zinc-400">
                    <span>{snip.title}</span>
                    <button
                      onClick={() => handleCopy(snip.code, snippetId)}
                      className="flex items-center gap-1 text-zinc-400 hover:text-amber-300 transition-colors"
                    >
                      {copiedSnippetIdx === snippetId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-zinc-200 leading-relaxed">
                    {snip.code}
                  </pre>
                  {snip.explanation && (
                    <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800/60 text-[11px] text-zinc-400 font-sans italic">
                      💡 {snip.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Chapter Takeaways Card ("À RETENIR") */}
      <div className="p-6 rounded-2xl border-2 border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-zinc-900/90 to-amber-950/20 backdrop-blur-xl shadow-gold-glow/20 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-amber-300 uppercase tracking-wider">
            À Retenir Absolument (Synthèse du Chapitre)
          </h3>
        </div>
        <ul className="space-y-2 text-sm text-zinc-200">
          {chapter.takeaways.map((takeaway, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cheatsheet Express if available */}
      {chapter.quickCheatsheet && chapter.quickCheatsheet.length > 0 && (
        <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold block mb-3">
            Aide-Mémoire Express du Chapitre :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {chapter.quickCheatsheet.map((c, i) => (
              <div key={i} className="p-2.5 px-3 rounded-lg bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                <span className="text-amber-300 font-bold">{c.cmd}</span>
                <span className="text-[11px] text-zinc-400 font-sans text-right">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
        <Button
          onClick={onPrevChapter}
          disabled={!onPrevChapter}
          variant="outline"
          size="md"
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Chapitre Précédent
        </Button>
        <Button
          onClick={onNextChapter}
          disabled={!onNextChapter}
          variant="primary"
          size="md"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Chapitre Suivant
        </Button>
      </div>
    </div>
  );
};
