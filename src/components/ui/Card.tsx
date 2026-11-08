import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "blue" | "gold" | "cyan" | "emerald" | "rose" | "none";
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
    blue: "border-blue-500/30 shadow-tech-glow",
    gold: "border-amber-500/30 shadow-amber-glow",
    cyan: "border-blue-500/30 shadow-tech-glow",
    emerald: "border-emerald-500/30 shadow-emerald-glow",
    rose: "border-rose-500/30 shadow-rose-glow",
    none: "border-slate-800 shadow-saas-card",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl bg-slate-900/90 backdrop-blur-xl border transition-all duration-300 overflow-hidden",
        glowStyles[glow],
        hoverEffect &&
          "hover:border-slate-700 hover:bg-slate-900 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
