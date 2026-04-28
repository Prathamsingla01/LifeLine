import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Map — LifeLine",
  description: "AI-predicted danger zones and risk assessment map for your area.",
};

export default function RiskMapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
