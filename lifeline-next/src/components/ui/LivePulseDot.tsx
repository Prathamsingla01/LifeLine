"use client";
import { cn } from "@/lib/utils";

interface LivePulseDotProps {
  status?: "online" | "offline" | "connecting";
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const statusConfig = {
  online: { color: "bg-ll-green", pulse: true, label: "Connected" },
  offline: { color: "bg-ll-red", pulse: false, label: "Disconnected" },
  connecting: { color: "bg-ll-amber", pulse: true, label: "Connecting..." },
};

const sizeConfig = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
};

export function LivePulseDot({
  status = "online",
  size = "md",
  label,
  className,
}: LivePulseDotProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="relative flex">
        <span className={cn(sizeConfig[size], config.color, "rounded-full")} />
        {config.pulse && (
          <span
            className={cn(
              "absolute inset-0 rounded-full animate-ping",
              config.color,
              "opacity-40"
            )}
          />
        )}
      </span>
      {label !== undefined ? (
        <span className="text-xs text-ll-text3 font-medium">{label}</span>
      ) : (
        <span className="text-xs text-ll-text3 font-medium">{config.label}</span>
      )}
    </div>
  );
}
