import { type ReactNode } from "react";

type BadgeVariant = "red" | "green" | "blue" | "amber" | "purple" | "cyan";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  red: "bg-ll-red/10 text-ll-red border-ll-red/25",
  green: "bg-ll-green/10 text-ll-green border-ll-green/25",
  blue: "bg-ll-blue/10 text-ll-blue border-ll-blue/25",
  amber: "bg-ll-amber/10 text-ll-amber border-ll-amber/25",
  purple: "bg-ll-purple/10 text-ll-purple border-ll-purple/25",
  cyan: "bg-ll-cyan/10 text-ll-cyan border-ll-cyan/25",
};

export function Badge({ children, variant = "green", dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full border ${variantMap[variant]} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />
      )}
      {children}
    </span>
  );
}
