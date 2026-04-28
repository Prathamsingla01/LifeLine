import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel — LifeLine",
  description: "Platform administration dashboard for managing users, emergencies, and system health.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
