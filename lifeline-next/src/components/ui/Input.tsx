"use client";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-1.5 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ll-text4">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-3 text-sm",
              "focus:outline-none focus:border-ll-blue/50 focus:ring-1 focus:ring-ll-blue/20",
              "transition-all duration-200 placeholder:text-ll-text4",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              icon && "pl-10",
              rightIcon && "pr-10",
              error && "border-ll-red/50 focus:border-ll-red/50 focus:ring-ll-red/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ll-text4">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-ll-red flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-ll-text4">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
