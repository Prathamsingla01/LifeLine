"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Navigation, Heart, AlertTriangle, Phone, Clock, Users, Ambulance, Building2 } from "lucide-react";

const tabs = [
  { id: "home", label: "Home", icon: Shield },
  { id: "dispatch", label: "Hospital Dispatch", icon: Building2 },
  { id: "safezone", label: "Safe-Zone Map", icon: Navigation },
  { id: "funds", label: "Transparency", icon: Heart },
];

/* ── SOS BUTTON ── */
function SOSButton() {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const startHold = useCallback(() => {
    setHolding(true);
    setProgress(0);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / 3000, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(timerRef.current!);
        setActivated(true);
        setHolding(false);
        setTimeout(() => { setActivated(false); setProgress(0); }, 4000);
      }
    }, 16);
  }, []);

  const endHold = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setHolding(false);
    if (progress < 1) setProgress(0);
  }, [progress]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="140" height="140" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="4" />
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 70 70)" className="transition-all" />
        </svg>
        <motion.button
          onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={startHold} onTouchEnd={endHold}
          className={`w-28 h-28 rounded-full flex items-center justify-center text-white font-black text-xl tracking-wider relative z-10 transition-all ${
            activated ? "bg-gradient-to-br from-green-500 to-green-700" : "bg-gradient-to-br from-ll-red to-red-700"
          }`}
          style={{ boxShadow: activated ? "0 0 40px rgba(34,197,94,0.4)" : holding ? `0 0 ${40 + progress * 40}px rgba(239,68,68,${0.3 + progress * 0.3})` : "0 0 30px rgba(239,68,68,0.25)" }}
          whileTap={{ scale: 0.95 }}
        >
          {activated ? "✓ SENT" : holding ? `${Math.ceil(3 - progress * 3)}` : "SOS"}
        </motion.button>
      </div>
      <p className="text-xs text-ll-text3">{activated ? "Emergency dispatched to nearest hospital" : "Hold for 3 seconds to activate"}</p>
    </div>
  );
}

/* ── QUICK ACTIONS ── */
function QuickActions() {
  const actions = [
    { icon: Building2, label: "Find Hospital", color: "text-ll-blue", bg: "bg-ll-blue/10" },
    { icon: Navigation, label: "Safe Zone", color: "text-ll-green", bg: "bg-ll-green/10" },
    { icon: AlertTriangle, label: "Report Crisis", color: "text-ll-amber", bg: "bg-ll-amber/10" },
    { icon: Phone, label: "My Status", color: "text-ll-purple", bg: "bg-ll-purple/10" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a) => (
        <motion.button key={a.label} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="bg-ll-surface border border-ll-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-ll-border2 transition-colors">
          <div className={`w-10 h-10 rounded-lg ${a.bg} flex items-center justify-center`}><a.icon className={`w-5 h-5 ${a.color}`} /></div>
          <span className="text-xs font-semibold">{a.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

/* ── DISPATCH VIEW ── */
function DispatchView() {
  const incidents = [
    { id: "INC-2847", type: "🔴 Critical", location: "Connaught Place", time: "2 min ago", status: "pending" },
    { id: "INC-2846", type: "🟡 Moderate", location: "Karol Bagh", time: "5 min ago", status: "assigned" },
    { id: "INC-2845", type: "🔴 Critical", location: "Saket", time: "8 min ago", status: "enroute" },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ n: "12", l: "Active Incidents", c: "text-ll-red" },{ n: "8", l: "Responders", c: "text-ll-green" },{ n: "3", l: "Pending", c: "text-ll-amber" }].map((s) => (
          <div key={s.l} className="bg-ll-surface border border-ll-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-black font-mono ${s.c}`}>{s.n}</div>
            <div className="text-[10px] text-ll-text3 uppercase tracking-wider mt-1">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="bg-ll-surface border border-ll-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-ll-border"><span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Live Incidents</span></div>
        {incidents.map((inc, i) => (
          <motion.div key={inc.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className="px-4 py-3 border-b border-ll-border last:border-0 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold">{inc.type} · {inc.location}</div>
              <div className="text-xs text-ll-text3 font-mono">{inc.id} · {inc.time}</div>
            </div>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              inc.status === "pending" ? "bg-ll-red/10 text-ll-red" : inc.status === "assigned" ? "bg-ll-amber/10 text-ll-amber" : "bg-ll-green/10 text-ll-green"
            }`}>{inc.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── SAFE ZONE ── */
function SafeZoneView() {
  const directions = ["Head North on MG Road — 200m", "Turn Left at T-Junction — 400m", "Enter Safe Zone Gate B — Arrive"];
  return (
    <div className="space-y-4">
      <div className="bg-ll-surface border border-ll-border rounded-xl h-52 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-dashed border-green-500/40 flex items-center justify-center"><span className="text-[10px] text-ll-green font-bold">SAFE</span></div>
        <div className="absolute top-1/4 right-1/4 w-20 h-16 rounded-lg border-2 border-dashed border-red-500/30 flex items-center justify-center"><span className="text-[10px] text-ll-red">🔥 Fire</span></div>
        <div className="absolute bottom-1/4 left-1/2 w-24 h-14 rounded-lg border-2 border-dashed border-amber-500/30 flex items-center justify-center"><span className="text-[10px] text-ll-amber">🌊 Flood</span></div>
        <div className="absolute top-[45%] left-[20%] w-3 h-3 rounded-full bg-ll-blue glow-blue" />
      </div>
      <div className="bg-ll-surface border border-ll-border rounded-xl p-4">
        <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-3">Turn-by-Turn Navigation</div>
        {directions.map((d, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-ll-border last:border-0">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 2 ? "bg-ll-green/15 text-ll-green" : "bg-ll-surface2 text-ll-text3"}`}>{i + 1}</div>
            <span className="text-sm">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FUNDRAISING ── */
function FundsView() {
  const campaigns = [
    { title: "Flood Relief — Assam", raised: 847000, goal: 1000000, verified: true },
    { title: "Burn Unit — AIIMS Delhi", raised: 234000, goal: 500000, verified: true },
    { title: "Earthquake Aid — Nepal", raised: 156000, goal: 300000, verified: false },
  ];
  return (
    <div className="space-y-3">
      {campaigns.map((c) => (
        <div key={c.title} className="bg-ll-surface border border-ll-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">{c.title}</span>
            {c.verified && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ll-green/10 text-ll-green border border-ll-green/25">✓ Verified</span>}
          </div>
          <div className="w-full h-2 bg-ll-bg rounded-full overflow-hidden mb-2">
            <motion.div className="h-full bg-gradient-to-r from-ll-green to-emerald-400 rounded-full" initial={{ width: 0 }} animate={{ width: `${(c.raised / c.goal) * 100}%` }} transition={{ duration: 1.5, delay: 0.3 }} />
          </div>
          <div className="flex justify-between text-xs text-ll-text3">
            <span>₹{(c.raised / 1000).toFixed(0)}K raised</span>
            <span>₹{(c.goal / 1000).toFixed(0)}K goal</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.h1 className="text-3xl font-extrabold tracking-tight mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        🚨 LifeLine App Demo
      </motion.h1>
      <p className="text-sm text-ll-text2 mb-6">Interactive demonstration of the core emergency response features.</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-ll-surface border border-ll-border rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id ? "text-ll-text" : "text-ll-text3 hover:text-ll-text2"}`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="demo-tab" className="absolute inset-0 bg-white/8 rounded-lg border border-ll-border2" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-ll-amber/8 to-transparent border border-ll-amber/20 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-ll-amber flex-shrink-0" />
                <div><div className="text-sm font-bold text-ll-amber">Flood Alert Active</div><div className="text-xs text-ll-text2">Delhi NCR region — moderate risk level</div></div>
              </div>
              <SOSButton />
              <QuickActions />
            </div>
          )}
          {activeTab === "dispatch" && <DispatchView />}
          {activeTab === "safezone" && <SafeZoneView />}
          {activeTab === "funds" && <FundsView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
