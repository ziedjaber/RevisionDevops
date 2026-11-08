import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "gold" | "cyan" | "emerald" | "none";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glow = "none",
  hoverEffect = false,
  ...props
}) => {
  const glowStyles = {
    gold: "border-amber-500/20 shadow-gold-glow/50",
    cyan: "border-cyan-500/20 shadow-cyan-glow/50",
    emerald: "border-emerald-500/20 shadow-emerald-glow/50",
    none: "border-zinc-800/80 shadow-subtle-card",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-[#11131B]/90 backdrop-blur-xl border transition-all duration-300 overflow-hidden",
        glowStyles[glow],
        hoverEffect && "hover:border-zinc-700 hover:bg-[#151824]/90 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
