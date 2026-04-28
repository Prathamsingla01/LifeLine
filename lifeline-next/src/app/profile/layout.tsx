import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile — LifeLine",
  description: "Manage your medical profile, emergency contacts, and QR emergency card.",
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
