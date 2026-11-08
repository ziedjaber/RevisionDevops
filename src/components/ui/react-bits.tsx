"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
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
            distance: 155,
            links: {
              opacity: 0.42,
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
          opacity: 0.18,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 0.55,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 1100,
            height: 800,
          },
          value: 42,
        },
        opacity: {
          value: 0.38,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1.5, max: 3.2 },
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
 * React Bits (DavidHDev/react-bits) — ClickSpark
 * Global 2D canvas overlay that emits a crisp radial burst of vector sparks on every mouse click.
 */
interface SparkParticle {
  x: number;
  y: number;
  angle: number;
  startTime: number;
  color: string;
}

const SPARK_COLORS = ["#6366f1", "#10b981", "#38bdf8", "#f59e0b"];

export function ClickSparkOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<SparkParticle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handlePointerDown = (e: PointerEvent) => {
      const now = performance.now();
      const count = 8;
      const color = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      for (let i = 0; i < count; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / count,
          startTime: now,
          color,
        });
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);

    let rafId: number;
    const duration = 380;
    const maxRadius = 26;
    const lineLen = 9;

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => {
        const elapsed = now - s.startTime;
        if (elapsed >= duration) return false;
        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const dist = eased * maxRadius;
        const curLen = lineLen * (1 - progress);

        const x1 = s.x + dist * Math.cos(s.angle);
        const y1 = s.y + dist * Math.sin(s.angle);
        const x2 = s.x + (dist + curLen) * Math.cos(s.angle);
        const y2 = s.y + (dist + curLen) * Math.sin(s.angle);

        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50"
    />
  );
}

/**
 * React Bits — CursorSpotlight
 * Smooth spring-physics radial light aura trailing the user's cursor across the screen.
 */
export function CursorSpotlight() {
  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 24 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(520px circle at ${springX}px ${springY}px, rgba(99, 102, 241, 0.08), rgba(16, 185, 129, 0.04) 40%, transparent 75%)`;

  return (
    <motion.div
      aria-hidden="true"
      style={{ background }}
      className="pointer-events-none fixed inset-0 z-0"
    />
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

  const triggerDecrypt = useCallback(() => {
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

  useEffect(() => {
    const cleanup = triggerDecrypt();
    return cleanup;
  }, [triggerDecrypt]);

  return (
    <span
      onMouseEnter={triggerDecrypt}
      className={cn("inline-block cursor-default", className)}
    >
      {displayText}
    </span>
  );
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
 * Crisp glowing horizontal separator line with a traveling light pulse.
 */
export function SpotlightDivider({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-px w-full overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      <motion.div
        animate={{ x: ["-100%", "250%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent"
      />
    </div>
  );
}
