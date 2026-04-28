import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications — LifeLine",
  description: "View and manage your emergency alerts, family notifications, and system updates.",
};

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
