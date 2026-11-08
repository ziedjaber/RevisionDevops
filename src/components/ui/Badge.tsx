import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "blue" | "indigo" | "gold" | "cyan" | "emerald" | "purple" | "neutral" | "rose";
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
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    gold: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    cyan: "bg-blue-500/10 text-blue-300 border-blue-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    purple: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
    rose: "bg-rose-500/10 text-rose-300 border-rose-500/30",
    neutral: "bg-slate-800/80 text-slate-300 border-slate-700/60",
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
