import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "cyan" | "emerald" | "purple" | "neutral" | "rose";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "neutral",
  size = "sm",
  ...props
}) => {
  const variantStyles = {
    gold: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    neutral: "bg-zinc-800/80 text-zinc-300 border-zinc-700/60",
  };

  const sizeStyles = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border backdrop-blur-sm transition-all",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
