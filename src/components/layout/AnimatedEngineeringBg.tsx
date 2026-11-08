"use client";

import React from "react";
import { motion } from "framer-motion";

const PARTICLES = [
  { id: 1, x: "12%", y: "18%", size: 3, duration: 9, delay: 0 },
  { id: 2, x: "28%", y: "62%", size: 2.5, duration: 12, delay: 1.5 },
  { id: 3, x: "46%", y: "24%", size: 3.5, duration: 10, delay: 0.8 },
  { id: 4, x: "68%", y: "42%", size: 2, duration: 11, delay: 2.2 },
  { id: 5, x: "84%", y: "22%", size: 3, duration: 13, delay: 0.4 },
  { id: 6, x: "76%", y: "78%", size: 2.5, duration: 10, delay: 1.9 },
  { id: 7, x: "18%", y: "82%", size: 3, duration: 14, delay: 1.1 },
  { id: 8, x: "55%", y: "74%", size: 2, duration: 9.5, delay: 2.7 },
];

export const AnimatedEngineeringBg: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle Top Radial Spotlight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.04) 35%, transparent 70%)",
        }}
      />

      {/* Animated Pulsing SVG Engineering Grid (opacity-15) */}
      <motion.div
        initial={{ opacity: 0.1 }}
        animate={{ opacity: [0.1, 0.16, 0.1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 opacity-15"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="engineering-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="#334155"
                strokeWidth="0.75"
              />
              <circle cx="0" cy="0" r="1" fill="#3b82f6" fillOpacity="0.45" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#engineering-grid)" />
        </svg>
      </motion.div>

      {/* Soft Floating Tech Particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.12, 0.32, 0.12],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-blue-400"
        />
      ))}
    </div>
  );
};
