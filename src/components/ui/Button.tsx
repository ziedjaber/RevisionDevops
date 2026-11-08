import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "cyan" | "emerald" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#3b82f6] to-[#6366f1] hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-tech-glow border border-blue-400/30",
    secondary:
      "bg-slate-800/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 hover:border-slate-600",
    outline:
      "bg-slate-900/60 hover:bg-slate-800/70 text-slate-300 hover:text-white border border-slate-800 hover:border-blue-500/40",
    ghost:
      "bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent",
    cyan:
      "bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 shadow-tech-glow",
    emerald:
      "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-emerald-glow",
    danger:
      "bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
