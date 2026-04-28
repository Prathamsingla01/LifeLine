import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — LifeLine",
  description: "Your LifeLine command center. Monitor emergencies, track family, and manage your safety score.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
