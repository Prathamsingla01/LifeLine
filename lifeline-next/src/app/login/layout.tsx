import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — LifeLine",
  description: "Sign in to your LifeLine account to access emergency response features.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
