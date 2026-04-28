import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospital Dashboard — LifeLine",
  description: "Hospital command center for managing beds, ambulances, and incoming SOS alerts.",
};

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
