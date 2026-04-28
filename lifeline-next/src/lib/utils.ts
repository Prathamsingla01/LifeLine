import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Time Helpers ──
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Geo Helpers ──
export function getDistanceKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Currency Formatter ──
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Copy to clipboard ──
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ── OTP Generator ──
export function generateOTP(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// ── Profile Completeness ──
export function calcProfileCompleteness(profile: Record<string, unknown>): number {
  const fields = [
    "bloodType", "allergies", "conditions", "medications",
    "emergencyNotes", "insuranceProvider", "primaryDoctor",
    "height", "weight",
  ];
  const filled = fields.filter((f) => {
    const val = profile[f];
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined && val !== "";
  });
  return Math.round((filled.length / fields.length) * 100);
}

// ── Severity Config ──
export const SEVERITY_CONFIG = {
  critical: { color: "ll-red", bg: "bg-ll-red/10", text: "text-ll-red", label: "Critical", icon: "🔴" },
  moderate: { color: "ll-amber", bg: "bg-ll-amber/10", text: "text-ll-amber", label: "Moderate", icon: "🟡" },
  low: { color: "ll-green", bg: "bg-ll-green/10", text: "text-ll-green", label: "Low", icon: "🟢" },
} as const;

// ── Emergency Type Config ──
export const EMERGENCY_TYPE_CONFIG = {
  accident: { icon: "🚗", label: "Accident", color: "ll-red" },
  fire: { icon: "🔥", label: "Fire", color: "ll-amber" },
  flood: { icon: "🌊", label: "Flood", color: "ll-blue" },
  medical: { icon: "🏥", label: "Medical", color: "ll-green" },
  child_safety: { icon: "👶", label: "Child Safety", color: "ll-purple" },
  earthquake: { icon: "🌍", label: "Earthquake", color: "ll-amber" },
  violence: { icon: "⚠️", label: "Violence", color: "ll-red" },
  other: { icon: "📋", label: "Other", color: "ll-cyan" },
} as const;

// ── Blood Type Colors ──
export const BLOOD_TYPE_COLORS: Record<string, string> = {
  "A+": "from-red-500 to-red-700",
  "A-": "from-red-400 to-red-600",
  "B+": "from-blue-500 to-blue-700",
  "B-": "from-blue-400 to-blue-600",
  "AB+": "from-purple-500 to-purple-700",
  "AB-": "from-purple-400 to-purple-600",
  "O+": "from-green-500 to-green-700",
  "O-": "from-green-400 to-green-600",
};

// ── Greeting by time of day ──
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// ── Generate random ID ──
export function generateId(prefix = "ll"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
