"use client";
import { ReactNode } from "react";
import { useSidebarStore } from "@/lib/store";
import { PageTransition } from "@/components/layout/PageTransition";

export function MainContent({ children }: { children: ReactNode }) {
  const collapsed = useSidebarStore((s) => s.collapsed);

  return (
    <main
      className={`pt-14 pb-20 lg:pt-0 lg:pb-0 transition-all duration-300 min-h-screen ${
        collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"
      }`}
    >
      <PageTransition>{children}</PageTransition>
    </main>
  );
}
