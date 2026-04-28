import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency Hub — LifeLine",
  description: "Activate SOS, find hospitals, and manage emergencies in real-time.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
