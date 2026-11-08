"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { cn } from "@/lib/utils";

/**
 * tsParticles (matteobruni/tsparticles)
 * Interactive commit-node & DevOps graph particle background that gently reacts to the cursor.
 */
const initTsParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

export function CommitNetworkParticles({ className }: { className?: string }) {
  const initCallback = useCallback(initTsParticles, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: { enable: true },
        },
        modes: {
          grab: {
            distance: 145,
            links: {
              opacity: 0.38,
              color: "#6366f1",
            },
          },
        },
      },
      particles: {
        color: {
          value: ["#6366f1", "#10b981", "#38bdf8", "#f59e0b"],
        },
        links: {
          color: "#475569",
          distance: 135,
          enable: true,
          opacity: 0.16,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 0.45,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 1100,
            height: 800,
          },
          value: 38,
        },
        opacity: {
          value: 0.35,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1.5, max: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  return (
    <ParticlesProvider init={initCallback}>
      <Particles
        id="devops-commit-network-particles"
        className={cn("pointer-events-auto absolute inset-0 z-0", className)}
        options={options}
      />
    </ParticlesProvider>
  );
}

/**
 * React Bits (DavidHDev/react-bits) — AuroraTerminalBg
 * Immersive, low-overhead CSS/Canvas Aurora gradient backdrop for terminals and headers.
 */
export function AuroraTerminalBg({
  className,
  intensity = "subtle",
}: {
  className?: string;
  intensity?: "subtle" | "medium";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      <div
        className={cn(
          "absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl animate-aurora",
          intensity === "medium" && "bg-indigo-500/25"
        )}
      />
      <div
        className={cn(
          "absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/12 blur-3xl animate-aurora [animation-delay:-6s]",
          intensity === "medium" && "bg-emerald-500/20"
        )}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-96 rounded-full bg-cyan-500/8 blur-3xl animate-aurora [animation-delay:-12s]" />
    </div>
  );
}

/**
 * React Bits (DavidHDev/react-bits) — DecryptedText
 * Cipher/decrypt text animation on mount and hover for technical headings.
 */
const CIPHER_CHARS = "0123456789abcdefABCDEF/><_#";

export function DecryptedText({
  text,
  className,
  speed = 22,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CIPHER_CHARS[
              Math.floor(Math.random() * CIPHER_CHARS.length)
            ];
          })
          .join("")
      );

      iteration += 1.5;
      if (iteration >= text.length) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className={cn("inline-block", className)}>{displayText}</span>;
}

/**
 * React Bits (DavidHDev/react-bits) — ShinyText
 * Subtle metallic sheen animation across text labels.
 */
export function ShinyText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-slate-200 via-indigo-300 to-emerald-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer",
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * React Bits — SpotlightDivider
 * Crisp glowing horizontal separator line.
 */
export function SpotlightDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px w-full overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
    </div>
  );
}
