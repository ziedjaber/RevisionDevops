"use client";

import React, { useId, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check, Terminal } from "lucide-react";

/**
 * Magic UI — DotPattern
 * Subtle animated tech dot pattern background with optional radial mask.
 */
interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
}

export function DotPattern({
  width = 22,
  height = 22,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/25",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Magic UI — BorderBeam
 * Animated glowing beam traveling around the border of cards, terminals and panels.
 */
interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 180,
  duration = 12,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#6366f1",
  colorTo = "#10b981",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": size,
          "--duration": duration,
          "--anchor": anchor,
          "--border-width": borderWidth,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--delay": `-${delay}s`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className
      )}
    />
  );
}

/**
 * Magic UI — NumberTicker
 * Smoothly animates numerical counters (XP, score, streaks, metrics).
 */
export function NumberTicker({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    const start = displayVal;
    const end = value;
    if (start === end) return;
    const duration = 450;
    const startTime = performance.now();

    let rafId: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayVal(Math.round(start + (end - start) * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  return (
    <motion.span
      key={value}
      initial={{ scale: 1.18, color: "#34d399" }}
      animate={{ scale: 1, color: "inherit" }}
      transition={{ type: "spring", stiffness: 360, damping: 20 }}
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {displayVal.toLocaleString("en-US")}
    </motion.span>
  );
}

/**
 * Magic UI — Meteors
 * Authentic diagonal shooting meteors with glowing head and trailing tail.
 */
export function Meteors({
  number = 12,
  className,
}: {
  number?: number;
  className?: string;
}) {
  const meteors = Array.from({ length: number }, (_, idx) => ({
    id: idx,
    top: `${(idx * 7) % 45}%`,
    left: `${10 + ((idx * 17) % 85)}%`,
    delay: `${(idx * 0.45).toFixed(2)}s`,
    duration: `${3.2 + (idx % 4) * 0.9}s`,
  }));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      {meteors.map((m) => (
        <span
          key={m.id}
          style={{
            top: m.top,
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
          className="absolute h-0.5 w-0.5 rotate-[215deg] animate-meteor rounded-full bg-indigo-300 shadow-[0_0_0_1px_#ffffff10] before:absolute before:top-1/2 before:h-[1px] before:w-[56px] before:-translate-y-1/2 before:bg-gradient-to-r before:from-indigo-400/80 before:via-emerald-400/30 before:to-transparent before:content-['']"
        />
      ))}
    </div>
  );
}

/**
 * Magic UI — CommandMarquee
 * Infinite scrolling horizontal marquee of clickable Git commands with pause-on-hover.
 */
export function CommandMarquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const doubled = [...items, ...items];

  const handleCopy = (raw: string) => {
    const clean = raw.replace(/^\$\s*/, "");
    navigator.clipboard.writeText(clean);
    setCopied(raw);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div
      className={cn(
        "group relative flex w-full overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,white_8%,white_92%,transparent)]",
        className
      )}
    >
      <div className="flex w-max animate-marquee items-center gap-2.5 group-hover:[animation-play-state:paused]">
        {doubled.map((item, idx) => {
          const isCopied = copied === item;
          return (
            <button
              key={`${item}-${idx}`}
              type="button"
              onClick={() => handleCopy(item)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-800/80 bg-slate-900/70 px-2.5 py-1 font-mono text-[10.5px] text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-white"
              title="Cliquer pour copier la commande"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Terminal className="h-3 w-3 text-indigo-400/80" />
              )}
              <span>{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
