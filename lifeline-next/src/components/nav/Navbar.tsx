"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Shield, Menu, X, Bell, Home, Activity, AlertTriangle, Heart,
  Users, Settings, User,
} from "lucide-react";
import { useNotificationStore } from "@/lib/store";

const desktopLinks = [
  { href: "/", label: "Home", emoji: "🏠" },
  { href: "/dashboard", label: "Dashboard", emoji: "📊" },
  { href: "/demo", label: "App Demo", emoji: "🚨" },
  { href: "/accident", label: "Accident Flow", emoji: "🚗" },
  { href: "/scenarios", label: "Scenarios", emoji: "🎯" },
  { href: "/profile", label: "Medical", emoji: "🩺" },
  { href: "/family", label: "Family", emoji: "👨‍👩‍👧‍👦" },
  { href: "/feed", label: "Feed", emoji: "📡" },
  { href: "/risk-map", label: "Risk Map", emoji: "🧠" },
  { href: "/architecture", label: "Architecture", emoji: "⚙️" },
];

const mobileLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: Activity },
  { href: "/demo", label: "SOS", icon: AlertTriangle, isSOS: true },
  { href: "/family", label: "Family", icon: Users },
  { href: "/profile", label: "Profile", icon: Heart },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ── Desktop & Mobile Top Nav ── */}
      <nav
        className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-heavy shadow-lg shadow-black/20"
            : "glass"
        }`}
      >
        <div className="max-w-[1400px] mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center glow-red group-hover:glow-red-intense transition-shadow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight">LifeLine</span>
            <div className="w-2 h-2 rounded-full bg-ll-green animate-pulse-dot" />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-0.5">
            {desktopLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-colors relative z-10 ${
                      isActive
                        ? "text-ll-text"
                        : "text-ll-text3 hover:text-ll-text hover:bg-white/5"
                    }`}
                  >
                    <span className="text-sm">{link.emoji}</span>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-white/8 rounded-lg border border-ll-border2"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-lg text-ll-text3 hover:text-ll-text hover:bg-white/5 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="notification-dot" />
              )}
            </Link>

            {/* Settings */}
            <Link
              href="/settings"
              className="hidden sm:flex p-2 rounded-lg text-ll-text3 hover:text-ll-text hover:bg-white/5 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User avatar */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-ll-blue/20 to-ll-purple/20 border border-ll-border2 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-ll-text2" />
              </div>
              <span className="text-xs font-semibold text-ll-text2 hidden md:block">Arjun</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden glass-heavy border-t border-ll-border overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                {desktopLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${
                      pathname === link.href
                        ? "bg-white/8 text-ll-text"
                        : "text-ll-text3 hover:text-ll-text hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">{link.emoji}</span>
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-ll-border my-2" />
                <Link href="/notifications" className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-ll-text3 hover:text-ll-text">
                  <span>🔔</span> Notifications
                  {unreadCount > 0 && <span className="ml-auto text-[10px] font-bold bg-ll-red/15 text-ll-red px-2 py-0.5 rounded-full">{unreadCount}</span>}
                </Link>
                <Link href="/settings" className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-ll-text3 hover:text-ll-text">
                  <span>⚙️</span> Settings
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile Bottom Navigation (app-like) ── */}
      <div className="bottom-nav lg:hidden glass-heavy border-t border-ll-border">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;

            if (link.isSOS) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative -mt-6"
                  aria-label="Emergency SOS"
                >
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
