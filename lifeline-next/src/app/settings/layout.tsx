import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — LifeLine",
  description: "Configure your LifeLine preferences, notifications, privacy, and crash detection sensitivity.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
