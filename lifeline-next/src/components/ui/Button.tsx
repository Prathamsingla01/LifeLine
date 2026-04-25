"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useCallback, useRef, type MouseEvent, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-ll-red to-red-700 text-white glow-red hover:glow-red-intense",
  secondary:
    "bg-ll-surface border border-ll-border2 text-ll-text hover:bg-ll-surface2",
  ghost:
    "bg-transparent text-ll-text3 hover:text-ll-text hover:bg-white/5",
  danger:
    "bg-gradient-to-br from-red-600 to-red-800 text-white",
  success:
    "bg-gradient-to-br from-ll-green to-green-700 text-white glow-green",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-lg gap-1.5",
  md: "px-6 py-3 text-sm rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, icon, children, className = "", disabled, ...props }, ref) => {
    const rippleRef = useRef<HTMLSpanElement>(null);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        // Ripple effect
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const diameter = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${e.clientX - rect.left - diameter / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - diameter / 2}px`;
        ripple.className = "ripple";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);

        if (props.onClick) {
          (props.onClick as (e: MouseEvent<HTMLButtonElement>) => void)(e);
        }
      },
      [props.onClick]
    );

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        disabled={disabled || loading}
        className={`ripple-container inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
        onClick={handleClick}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
