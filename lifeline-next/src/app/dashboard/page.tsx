"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Shield, Activity, Clock, Users, AlertTriangle, Heart, MapPin, Zap, QrCode } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { GamificationBadges } from "@/components/features/GamificationBadges";
import type { MapMarker } from "@/components/maps/EmergencyMap";

const EmergencyMap = dynamic(() => import("@/components/maps/EmergencyMap").then(m => ({ default: m.EmergencyMap })), { ssr: false, loading: () => <div className="h-52 skeleton rounded-2xl" /> });

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const liveIncidents = [
  { id: "INC-2847", severity: "Critical", type: "Car Accident", location: "Connaught Place, Delhi", time: "2 min ago", status: "responding" },
  { id: "INC-2846", severity: "Moderate", type: "Fall Injury", location: "Karol Bagh, Delhi", time: "5 min ago", status: "assigned" },
  { id: "INC-2845", severity: "Critical", type: "Building Fire", location: "Saket, Delhi", time: "8 min ago", status: "enroute" },
  { id: "INC-2844", severity: "Low", type: "Medical", location: "Dwarka Sec-12", time: "15 min ago", status: "resolved" },
  { id: "INC-2843", severity: "Moderate", type: "Flood Warning", location: "Yamuna Banks", time: "22 min ago", status: "monitoring" },
];

const quickActions = [
  { icon: AlertTriangle, label: "Report Emergency", color: "ll-red", bg: "bg-ll-red/10" },
  { icon: MapPin, label: "Find Hospital", color: "ll-blue", bg: "bg-ll-blue/10" },
  { icon: Users, label: "Family Check-In", color: "ll-green", bg: "bg-ll-green/10" },
  { icon: Heart, label: "Donate Now", color: "ll-purple", bg: "bg-ll-purple/10" },
];

const dashMapMarkers: MapMarker[] = [
  { id: "d1", lat: 28.6315, lng: 77.2167, type: "emergency", severity: "critical", pulse: true, label: "INC-2847" },
  { id: "d2", lat: 28.6448, lng: 77.1900, type: "emergency", severity: "moderate", label: "INC-2846" },
  { id: "d3", lat: 28.5250, lng: 77.2100, type: "emergency", severity: "critical", pulse: true, label: "INC-2845" },
  { id: "d4", lat: 28.6139, lng: 77.2090, type: "user", label: "You" },
];

export default function DashboardPage() {
  const [safetyScore, setSafetyScore] = useState(0);
  useEffect(() => { const t = setTimeout(() => setSafetyScore(92), 500); return () => clearTimeout(t); }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-ll-text2">Welcome back, Arjun · All systems operational</p>
        </motion.div>
        <Badge variant="green" dot>Network Active</Badge>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Active Emergencies", value: 3, icon: Activity, color: "text-ll-red", change: "+2 today" },
            { label: "Avg Response Time", value: 4.2, icon: Clock, color: "text-ll-green", change: "-12% vs avg", suffix: "m", decimals: 1 },
            { label: "Family Members", value: 4, icon: Users, color: "text-ll-blue", change: "All safe", suffix: "/4" },
            { label: "Safety Score", value: safetyScore, icon: Shield, color: "text-ll-amber", change: "Top 8%" },
          ].map(s => (
            <div key={s.label} className="bg-ll-surface border border-ll-border rounded-2xl p-4">
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

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Live Feed */}
          <motion.div variants={item} className="lg:col-span-2 bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ll-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ll-red animate-pulse-dot" />
              <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Live Emergency Feed</span>
            </div>
            {liveIncidents.map((inc, i) => (
              <motion.div key={inc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="px-5 py-3.5 border-b border-ll-border last:border-0 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${inc.severity === "Critical" ? "bg-ll-red" : inc.severity === "Moderate" ? "bg-ll-amber" : "bg-ll-green"}`} />
                  <div>
                    <div className="text-sm font-semibold">{inc.type} · {inc.location}</div>
                    <div className="text-xs text-ll-text3 font-mono">{inc.id} · {inc.time}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${inc.status === "responding" ? "bg-ll-red/10 text-ll-red" : inc.status === "assigned" || inc.status === "enroute" ? "bg-ll-amber/10 text-ll-amber" : inc.status === "resolved" ? "bg-ll-green/10 text-ll-green" : "bg-ll-blue/10 text-ll-blue"}`}>{inc.status}</span>
              </motion.div>
            ))}
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
                  <motion.button key={a.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="bg-ll-bg border border-ll-border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-ll-border2 transition-colors">
                    <div className={`w-9 h-9 rounded-lg ${a.bg} flex items-center justify-center`}><a.icon className={`w-4 h-4 text-${a.color}`} /></div>
                    <span className="text-[10px] font-semibold text-center leading-tight">{a.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Safety Score Ring */}
            <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5 text-center">
              <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-3">Your Safety Score</div>
              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="8" />
                  <motion.circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50} initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - safetyScore / 100) }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-ll-amber font-mono">{safetyScore}</span>
                </div>
              </div>
              <div className="text-xs text-ll-text2">Profile complete, family linked, emergency plan set</div>
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
              <div className="flex justify-between text-xs"><span className="text-ll-text3">Blood Type</span><span className="font-semibold text-ll-red">O−</span></div>
              <div className="flex justify-between text-xs"><span className="text-ll-text3">Allergies</span><span className="font-semibold text-ll-amber">Penicillin</span></div>
              <div className="flex justify-between text-xs"><span className="text-ll-text3">Emergency</span><span className="font-semibold">Priya Mehta</span></div>
              <div className="flex justify-between text-xs"><span className="text-ll-text3">LifeLine ID</span><span className="font-mono font-semibold text-ll-green">LL-00482</span></div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
