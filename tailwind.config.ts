import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "#090A0F",
          card: "#12141C",
          cardHover: "#171A24",
          border: "#1E2230",
          borderLight: "#2D3348",
          gold: "#F59E0B",
          goldHover: "#D97706",
          goldLight: "#FDE68A",
          cyan: "#06B6D4",
          cyanGlow: "rgba(6, 182, 212, 0.15)",
          emerald: "#10B981",
          emeraldGlow: "rgba(16, 185, 129, 0.15)",
          amberGlow: "rgba(245, 158, 11, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(245, 158, 11, 0.25)",
        "cyan-glow": "0 0 25px -5px rgba(6, 182, 212, 0.25)",
        "emerald-glow": "0 0 25px -5px rgba(16, 185, 129, 0.25)",
        "subtle-card": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
