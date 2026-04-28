import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accident Detection — LifeLine",
  description: "AI-powered crash detection, voice SOS, and triage assessment for emergency response.",
};

export default function AccidentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
