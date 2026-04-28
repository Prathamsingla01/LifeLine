import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Feed — LifeLine",
  description: "Real-time emergency feed with live incident tracking and status updates.",
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
