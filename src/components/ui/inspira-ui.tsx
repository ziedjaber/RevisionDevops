"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Inspira UI — Card3DTilt
 * Interactive card with subtle 3D perspective tilt and dynamic specular spotlight glare
 * for exercise / incident / drill lists.
 */
interface Card3DTiltProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
  spotlightColor?: string;
  maxTilt?: number;
}

export function Card3DTilt({
  children,
  className,
  active = false,
  spotlightColor = "rgba(99, 102, 241, 0.16)",
  maxTilt = 4.5,
  ...props
}: Card3DTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = x / rect.width;
    const pctY = y / rect.height;

    const rotateY = (pctX - 0.5) * (maxTilt * 2);
    const rotateX = (0.5 - pctY) * (maxTilt * 2);

    setTilt({
      rotateX,
      rotateY,
      glareX: Math.round(pctX * 100),
      glareY: Math.round(pctY * 100),
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hovered
          ? `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.01, 1.01, 1.01)`
          : "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: hovered
          ? "transform 80ms ease-out"
          : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-card/90 text-card-foreground transition-colors will-change-transform",
        active
          ? "border-indigo-500/60 shadow-[0_0_25px_-5px_rgba(99,102,241,0.28)]"
          : "border-border hover:border-slate-700",
        className
      )}
      {...props}
    >
      {/* Dynamic 3D Spotlight Glare */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(280px circle at ${tilt.glareX}% ${tilt.glareY}%, ${spotlightColor}, transparent 75%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Inspira UI — GlowButton
 * High-contrast action button with glowing border aura for [Tester la commande] / [Exécuter].
 */
interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "indigo" | "emerald" | "amber";
  size?: "sm" | "md";
}

export function GlowButton({
  children,
  className,
  variant = "indigo",
  size = "sm",
  ...props
}: GlowButtonProps) {
  const glowStyles = {
    indigo:
      "from-indigo-500 via-blue-500 to-cyan-400 shadow-[0_0_20px_-3px_rgba(99,102,241,0.55)] hover:shadow-[0_0_28px_-2px_rgba(99,102,241,0.8)]",
    emerald:
      "from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_0_20px_-3px_rgba(16,185,129,0.55)] hover:shadow-[0_0_28px_-2px_rgba(16,185,129,0.8)]",
    amber:
      "from-amber-500 via-orange-500 to-yellow-500 shadow-[0_0_20px_-3px_rgba(245,158,11,0.5)] hover:shadow-[0_0_28px_-2px_rgba(245,158,11,0.75)]",
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 rounded-lg p-[1px] font-mono font-semibold text-white transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-r",
        glowStyles,
        className
      )}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      <span
        className={cn(
          "inline-flex h-full w-full items-center justify-center gap-1.5 rounded-[7px] bg-slate-950/85 backdrop-blur-md transition-colors hover:bg-slate-950/60",
          size === "sm" ? "px-3.5 py-1.5 text-xs" : "px-4 py-2 text-sm"
        )}
      >
        {children}
      </span>
    </motion.button>
  );
}

/**
 * Inspira UI — TypewriterTerminalText
 * Typewriter character-by-character terminal output animation with optional blinking cursor.
 */
export function TypewriterTerminalText({
  text,
  speed = 12,
  className,
  showCursor = false,
}: {
  text: string;
  speed?: number;
  className?: string;
  showCursor?: boolean;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let idx = 0;
    const step = Math.max(1, Math.ceil(text.length / 85));
    const timer = setInterval(() => {
      idx += step;
      if (idx >= text.length) {
        setDisplayed(text);
        clearInterval(timer);
      } else {
        setDisplayed(text.slice(0, idx));
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={cn("font-mono whitespace-pre-wrap", className)}>
      {displayed}
      {showCursor && displayed.length < text.length && (
        <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-emerald-400 animate-pulse" />
      )}
    </span>
  );
}
