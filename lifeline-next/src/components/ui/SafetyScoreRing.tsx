"use client";
import { motion } from "framer-motion";

interface SafetyScoreRingProps {
  score: number;
  maxScore?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showLevel?: boolean;
  level?: number;
}

export function SafetyScoreRing({
  score,
  maxScore = 100,
  size = 120,
  strokeWidth = 8,
  label = "Safety Score",
  showLevel = true,
  level,
}: SafetyScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / maxScore, 1);
  const offset = circumference * (1 - progress);

  // Color based on score
  const getColor = () => {
    if (score >= 80) return { stroke: "#22c55e", glow: "rgba(34,197,94,0.3)" };
    if (score >= 60) return { stroke: "#f59e0b", glow: "rgba(245,158,11,0.3)" };
    if (score >= 40) return { stroke: "#f97316", glow: "rgba(249,115,22,0.3)" };
    return { stroke: "#ef4444", glow: "rgba(239,68,68,0.3)" };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-ll-surface3)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 0 8px ${color.glow})`,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-extrabold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            style={{ color: color.stroke }}
          >
            {score}
          </motion.span>
          {showLevel && level && (
            <span className="text-[10px] text-ll-text3 font-semibold">
              LVL {level}
            </span>
          )}
        </div>
      </div>
      <span className="text-xs text-ll-text3 font-medium">{label}</span>
    </div>
  );
}
