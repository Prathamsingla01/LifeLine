"use client";
import { useRef, useEffect, useState, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value?: string;
  onChange?: (otp: string) => void;
  error?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  error,
  autoFocus = true,
  disabled = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length).fill("")).slice(0, length)
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    // Auto-advance
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const newOtp = text.split("").concat(Array(length).fill("")).slice(0, length);
    setOtp(newOtp);
    onChange?.(newOtp.join(""));

    const nextIndex = Math.min(text.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={cn(
              "w-11 h-13 bg-ll-bg border border-ll-border rounded-xl text-center text-lg font-bold",
              "focus:outline-none focus:border-ll-blue/50 focus:ring-1 focus:ring-ll-blue/20",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-ll-red/50",
              otp[i] && "border-ll-blue/30 bg-ll-blue/5"
            )}
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-xs text-ll-red text-center">{error}</p>
      )}
    </div>
  );
}
