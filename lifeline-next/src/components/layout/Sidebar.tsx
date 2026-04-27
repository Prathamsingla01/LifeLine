"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  Shield, Home, Activity, AlertTriangle, Zap, Heart,
  Users, Radio, Brain, Settings, Bell, User, LogIn,
  ChevronLeft, ChevronRight, Sun, Moon, X, Menu,
  Code2, MapPin, Target,
} from "lucide-react";
import { useNotificationStore, useThemeStore, useSidebarStore } from "@/lib/store";

const navSections = [
  {
    title: "Main",
    links: [
      { href: "/", label: "Home", icon: Home, emoji: "🏠" },
      { href: "/dashboard", label: "Dashboard", icon: Activity, emoji: "📊" },
    ],
  },
  {
    title: "Emergency",
    links: [
      { href: "/demo", label: "Emergency Hub", icon: AlertTriangle, emoji: "🚨" },
      { href: "/accident", label: "Accident Detection", icon: Zap, emoji: "🚗" },
      { href: "/scenarios", label: "Demo Scenarios", icon: Target, emoji: "🎯" },
    ],
  },
  {
    title: "Safety",
    links: [
      { href: "/profile", label: "Medical Profile", icon: Heart, emoji: "🩺" },
      { href: "/family", label: "Family Tracker", icon: Users, emoji: "👨‍👩‍👧‍👦" },
      { href: "/feed", label: "Live Feed", icon: Radio, emoji: "📡" },
      { href: "/risk-map", label: "AI Risk Map", icon: Brain, emoji: "🧠" },
    ],
  },
  {
    title: "System",
    links: [
      { href: "/architecture", label: "Architecture", icon: Code2, emoji: "⚙️" },
      { href: "/notifications", label: "Notifications", icon: Bell, emoji: "🔔" },
      { href: "/settings", label: "Settings", icon: Settings, emoji: "⚙️" },
    ],
  },
];

const mobileBottomLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/demo", label: "SOS", icon: AlertTriangle, isSOS: true },
  { href: "/family", label: "Family", icon: Users },
  { href: "/profile", label: "Profile", icon: Heart },
];

export function Sidebar() {
  const pathname = usePathname();
  const { open, collapsed, toggle, setOpen, toggleCollapse } = useSidebarStore();
  const { mode, toggle: toggleTheme } = useThemeStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  // Close mobile sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  // Initialize theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ll-theme") as "dark" | "light" | null;
    if (saved) {
      useThemeStore.getState().setMode(saved);
    }
  }, []);

  const sidebarWidth = collapsed ? "w-[72px]" : "w-[260px]";

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 z-50 glass-heavy flex items-center justify-between px-4">
        <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Menu">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-extrabold tracking-tight">LifeLine</span>
        </Link>
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Toggle theme">
            {mode === "dark" ? <Sun className="w-4 h-4 text-ll-amber" /> : <Moon className="w-4 h-4 text-ll-blue" />}
          </button>
          <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="notification-dot" />}
          </Link>
        </div>
      </div>

      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar (Desktop: fixed left, Mobile: drawer) ── */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-all duration-300 ease-in-out
          sidebar-bg border-r border-ll-border
          ${sidebarWidth}
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo + Collapse */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-ll-border flex-shrink-0">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center glow-red">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">LifeLine</span>
              <div className="w-2 h-2 rounded-full bg-ll-green animate-pulse-dot" />
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="mx-auto">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center glow-red">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}

          {/* Close on mobile */}
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Collapse toggle on desktop */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Collapse sidebar"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 sidebar-scrollbar">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-ll-text4">
                  {section.title}
                </div>
              )}
              <div className="space-y-0.5">
                {section.links.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative flex items-center gap-3 rounded-xl transition-all group
                        ${collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}
                        ${isActive
                          ? "bg-white/8 text-ll-text font-semibold"
                          : "text-ll-text3 hover:text-ll-text hover:bg-white/4"
                        }`}
                      title={collapsed ? link.label : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ll-red rounded-r-full"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-ll-red" : ""}`} />
                      {!collapsed && (
                        <span className="text-[13px] truncate">{link.label}</span>
                      )}
                      {!collapsed && link.href === "/notifications" && unreadCount > 0 && (
                        <span className="ml-auto text-[10px] font-bold bg-ll-red/15 text-ll-red px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-ll-border p-3 space-y-2 flex-shrink-0">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-3 w-full rounded-xl transition-all
              ${collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}
              text-ll-text3 hover:text-ll-text hover:bg-white/4`}
            title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? (
              <Sun className="w-[18px] h-[18px] text-ll-amber" />
            ) : (
              <Moon className="w-[18px] h-[18px] text-ll-blue" />
            )}
            {!collapsed && (
              <span className="text-[13px]">{mode === "dark" ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>

          {/* User */}
          <Link
            href="/login"
            className={`flex items-center gap-3 rounded-xl transition-all
              ${collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5"}
              text-ll-text3 hover:text-ll-text hover:bg-white/4`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ll-blue/20 to-ll-purple/20 border border-ll-border2 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-ll-text2" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-ll-text truncate">Arjun Mehta</div>
                <div className="text-[10px] text-ll-text4">arjun@email.com</div>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <div className="bottom-nav lg:hidden glass-heavy border-t border-ll-border">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileBottomLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            if (link.isSOS) {
              return (
                <Link key={link.href} href={link.href} className="relative -mt-6" aria-label="Emergency SOS">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center glow-red shadow-lg shadow-ll-red/30">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  isActive ? "text-ll-text" : "text-ll-text4"
                }`}
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-semibold">{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="w-1 h-1 rounded-full bg-ll-red"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
