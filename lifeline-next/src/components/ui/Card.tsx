"use client";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "red" | "blue" | "green" | "amber" | "purple" | "cyan";
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const glowMap: Record<string, string> = {
  red: "hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]",
  blue: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  green: "hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]",
  amber: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  purple: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  cyan: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
};

const paddingMap = { sm: "p-4", md: "p-5", lg: "p-6" };

export function Card({
  children,
  className = "",
  hover = true,
  glow,
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3 } : undefined}
      onClick={onClick}
      className={`
        bg-ll-surface border border-ll-border rounded-2xl
        transition-all duration-300
        ${hover ? "hover:border-ll-border2 card-3d cursor-pointer" : ""}
        ${glow ? glowMap[glow] : ""}
        ${paddingMap[padding]}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

/* ── Card Header ── */
export function CardHeader({
  title,
  icon,
  action,
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-ll-text3">{icon}</span>}
        <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">
          {title}
        </span>
      </div>
      {action}
    </div>
  );
}

/* ── Skeleton Card ── */
export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-ll-surface border border-ll-border rounded-2xl p-5 space-y-3">
      <div className="skeleton h-4 w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton h-3" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}
