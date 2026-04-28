import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Family Safety — LifeLine",
  description: "Track family members, set up geofences, and ensure everyone's safety.",
};

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
