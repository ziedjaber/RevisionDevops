"use client";

import React, { useId, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
    const duration = 420;
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
    <span className={cn("tabular-nums tracking-tight", className)}>
      {displayVal.toLocaleString("en-US")}
    </span>
  );
}

/**
 * Magic UI — Meteors
 * Subtle diagonal shooting light trails inside cards and victory banners.
 */
export function Meteors({
  number = 10,
  className,
}: {
  number?: number;
  className?: string;
}) {
  const meteors = Array.from({ length: number }, (_, idx) => ({
    id: idx,
    left: `${Math.floor((idx / number) * 100)}%`,
    delay: `${(idx * 0.65).toFixed(2)}s`,
    duration: `${3 + (idx % 4)}s`,
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
            top: "-10%",
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
          className="absolute h-0.5 w-16 rotate-[35deg] bg-gradient-to-r from-indigo-400/60 via-emerald-400/20 to-transparent opacity-40 animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * Magic UI — CommandMarquee
 * Subtle horizontal live ticker of Git / DevOps commands.
 */
export function CommandMarquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex w-full overflow-x-auto no-scrollbar items-center gap-2 py-1",
        className
      )}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          className="shrink-0 rounded-md border border-slate-800/80 bg-slate-900/60 px-2 py-0.5 font-mono text-[10px] text-slate-400"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
