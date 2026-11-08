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
        saas: {
          bg: "#0b0f17",
          card: "#0f172a",
          border: "#1e293b",
          primary: "#3b82f6",
          indigo: "#6366f1",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "tech-glow": "0 0 24px -4px rgba(59, 130, 246, 0.28)",
        "indigo-glow": "0 0 24px -4px rgba(99, 102, 241, 0.28)",
        "emerald-glow": "0 0 24px -4px rgba(16, 185, 129, 0.25)",
        "amber-glow": "0 0 24px -4px rgba(245, 158, 11, 0.25)",
        "rose-glow": "0 0 24px -4px rgba(244, 63, 94, 0.25)",
        "saas-card": "0 4px 24px -2px rgba(0, 0, 0, 0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
