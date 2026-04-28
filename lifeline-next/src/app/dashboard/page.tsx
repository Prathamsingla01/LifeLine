"use client";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Activity, Clock, Users, AlertTriangle, Heart, MapPin, QrCode, ArrowRight, TrendingUp } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { SafetyScoreRing } from "@/components/ui/SafetyScoreRing";
import { GamificationBadges } from "@/components/features/GamificationBadges";
import { StatCardSkeleton, FeedItemSkeleton } from "@/components/ui/Skeleton";
import { useAuthStore, useFeedStore } from "@/lib/store";
import { getGreeting } from "@/lib/utils";
import type { MapMarker } from "@/components/maps/EmergencyMap";

const EmergencyMap = dynamic(() => import("@/components/maps/EmergencyMap").then(m => ({ default: m.EmergencyMap })), { ssr: false, loading: () => <div className="h-52 skeleton rounded-2xl" /> });

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const quickActions = [
  { icon: AlertTriangle, label: "Report Emergency", color: "text-ll-red", bg: "bg-ll-red/10", href: "/demo" },
  { icon: MapPin, label: "Find Hospital", color: "text-ll-blue", bg: "bg-ll-blue/10", href: "/risk-map" },
  { icon: Users, label: "Family Check-In", color: "text-ll-green", bg: "bg-ll-green/10", href: "/family" },
  { icon: Heart, label: "Donate Now", color: "text-ll-purple", bg: "bg-ll-purple/10", href: "/feed" },
];

export default function DashboardPage() {
  const { user, safetyScore, profile, isLoading: authLoading, fetchUser } = useAuthStore();
  const { items: feedItems, fetchFeed, isLoading: feedLoading } = useFeedStore();

  useEffect(() => {
    fetchUser();
    fetchFeed();
  }, [fetchUser, fetchFeed]);

  const activeCount = feedItems.filter(f => f.status === "active" || f.status === "responding").length;
  const greeting = getGreeting();

  const dashMapMarkers: MapMarker[] = feedItems
    .filter(f => f.lat && f.lng && f.status !== "resolved")
    .slice(0, 5)
    .map(f => ({
      id: f.id,
      lat: f.lat!,
      lng: f.lng!,
      type: "emergency" as const,
      severity: f.severity,
      pulse: f.severity === "critical",
      label: f.id,
    }));

  // Add user marker
  dashMapMarkers.push({ id: "user", lat: 28.6139, lng: 77.2090, type: "user", label: "You" });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-ll-text2">
            {greeting}, {user?.name?.split(" ")[0] || "User"} · All systems operational
          </p>
        </motion.div>
        <Badge variant="green" dot>Network Active</Badge>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Stats */}
        {authLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Active Emergencies", value: activeCount, icon: Activity, color: "text-ll-red", change: `+${activeCount} now` },
              { label: "Avg Response Time", value: 4.2, icon: Clock, color: "text-ll-green", change: "-12% vs avg", suffix: "m", decimals: 1 },
              { label: "Family Members", value: 4, icon: Users, color: "text-ll-blue", change: "All safe", suffix: "/4" },
              { label: "Safety Score", value: safetyScore?.score || 82, icon: Shield, color: "text-ll-amber", change: `Lvl ${safetyScore?.level || 4}` },
            ].map(s => (
              <div key={s.label} className="bg-ll-surface border border-ll-border rounded-2xl p-4 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                  <span className="text-[10px] text-ll-text3 font-semibold">{s.change}</span>
                </div>
                <div className={`text-3xl font-black font-mono tracking-tight ${s.color}`}>
                  <AnimatedNumber target={s.value} suffix={s.suffix || ""} decimals={s.decimals || 0} />
                </div>
                <div className="text-[11px] text-ll-text3 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Live Feed */}
          <motion.div variants={item} className="lg:col-span-2 bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ll-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ll-red animate-pulse-dot" />
                <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Live Emergency Feed</span>
              </div>
              <Link href="/feed" className="text-xs text-ll-blue hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {feedLoading ? (
              <div className="p-4 space-y-2">
                {[1,2,3,4,5].map(i => <FeedItemSkeleton key={i} />)}
              </div>
            ) : (
              feedItems.slice(0, 5).map((inc, i) => (
                <motion.div key={inc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="px-5 py-3.5 border-b border-ll-border last:border-0 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${inc.severity === "critical" ? "bg-ll-red" : inc.severity === "moderate" ? "bg-ll-amber" : "bg-ll-green"}`} />
                    <div>
                      <div className="text-sm font-semibold">{inc.title}</div>
                      <div className="text-xs text-ll-text3 font-mono">{inc.id} · {inc.time} · {inc.location}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    inc.status === "responding" ? "bg-ll-red/10 text-ll-red" :
                    inc.status === "active" ? "bg-ll-amber/10 text-ll-amber" :
                    "bg-ll-green/10 text-ll-green"
                  }`}>{inc.status}</span>
                </motion.div>
              ))
            )}
          </motion.div>

          <div className="space-y-5">
            {/* Mini Map */}
            <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-ll-border">
                <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Emergency Map</span>
              </div>
              <EmergencyMap markers={dashMapMarkers} center={[28.6, 77.2]} zoom={11} height="h-52" interactive={false} showZoom={false} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5">
              <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-3">Quick Actions</div>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map(a => (
                  <Link key={a.label} href={a.href}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="bg-ll-bg border border-ll-border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-ll-border2 transition-colors">
                      <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center`}><a.icon className={`w-4 h-4 ${a.color}`} /></div>
                      <span className="text-[10px] font-semibold text-center leading-tight">{a.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Safety Score Ring */}
            <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5 flex flex-col items-center">
              <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-4 self-start">Your Safety Score</div>
              <SafetyScoreRing 
                score={safetyScore?.score || 82} 
                level={safetyScore?.level || 4}
                showLevel
              />
              <div className="flex items-center gap-1 mt-3 text-xs text-ll-text2">
                <TrendingUp className="w-3 h-3 text-ll-green" />
                <span>+5 points this week</span>
              </div>
            </motion.div>

            {/* Gamification Badges */}
            <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5">
              <GamificationBadges compact={false} />
            </motion.div>
          </div>
        </div>

        {/* Emergency QR Quick Access */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-ll-red" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Emergency QR</span>
            </div>
            <span className="text-[10px] text-ll-green font-semibold bg-ll-green/10 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-sm text-ll-text2 mb-3">Your medical profile is encoded in a scannable QR code. First responders can access critical data instantly.</p>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/5 rounded-xl border border-ll-border2 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-ll-red/60" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs"><span className="text-ll-text3">Blood Type</span><span className="font-semibold text-ll-red">{profile?.bloodType || "O+"}</span></div>
              <div className="flex justify-between text-xs"><span className="text-ll-text3">Allergies</span><span className="font-semibold text-ll-amber">{profile?.allergies?.[0] || "None"}</span></div>
              <div className="flex justify-between text-xs"><span className="text-ll-text3">Emergency</span><span className="font-semibold">Priya Mehta</span></div>
              <div className="flex justify-between text-xs"><span className="text-ll-text3">LifeLine ID</span><span className="font-mono font-semibold text-ll-green">{user?.lifelineId || "LL-00482"}</span></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
