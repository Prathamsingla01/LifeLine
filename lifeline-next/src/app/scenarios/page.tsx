"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const scenarios = [
  {
    id: "accident", label: "🚗 Accident Alert", color: "ll-red",
    title: "Car Accident — Auto SOS", desc: "Smartphone detects crash via accelerometer/gyroscope, sends SOS with GPS and medical profile.",
    steps: ["💥 Impact detected — 47.2g acceleration spike","⏱ 10-second safety timer started","🚨 Auto-SOS triggered — GPS + medical profile sent","🏥 AIIMS Emergency notified — O− blood reserved","🚑 AMB-204 dispatched — ETA 4 min","✅ Patient arrived — ICU bed 7B prepared"],
    pitchNotes: ["97% crash detection accuracy using sensor fusion","Multi-channel notification: FCM → SMS → WebSocket","Medical profile pre-transmitted saves critical minutes","Works offline — queues data for when connection restored"]
  },
  {
    id: "flood", label: "🌊 Natural Calamity", color: "ll-blue",
    title: "Flood Response — Safe Zone Routing", desc: "Real-time flood zone mapping with safe evacuation routes and shelter locations.",
    steps: ["🌧 Heavy rainfall alert — IMD Level 4 warning","📍 Flood zones mapped via PostGIS spatial analysis","🗺 Safe evacuation routes calculated in 2.1s","📡 Push alerts sent to 847 users in affected area","🏠 12 shelters activated — bed capacity 3,200","✅ All residents within 2km of safe zone"],
    pitchNotes: ["PostGIS flood zone polygon calculations","Dynamic route avoidance of danger areas","Multi-shelter capacity balancing algorithm","Real-time shelter occupancy tracking"]
  },
  {
    id: "child", label: "👧 Vulnerable Groups", color: "ll-amber",
    title: "Child Safety — Panic Button", desc: "Triple-tap panic button for children with instant family + police notification.",
    steps: ["👧 Ananya triple-taps panic button on watch","📍 GPS location locked — DPS School, Sector 45","📲 Alert sent to Priya (Mom) — acknowledged in 8s","📲 Alert sent to Arjun (Dad) — acknowledged in 12s","🚔 Local police notified — patrol dispatched","✅ Ananya safe — false alarm, lost in crowd"],
    pitchNotes: ["Triple-tap activation prevents accidental triggers","Geofence alerts when child leaves school zone","Photo + audio recording starts on activation","30-day location history for guardians"]
  },
  {
    id: "heal", label: "💜 Community Healing", color: "ll-purple",
    title: "Transparent Fundraising", desc: "Blockchain-verified fundraising with escrow release tied to hospital treatment confirmation.",
    steps: ["📢 Campaign created — Flood Relief Assam","✅ Verified by LifeLine team — documents checked","💰 ₹8,47,000 raised from 342 donors","🏥 Funds held in escrow — awaiting treatment proof","📋 AIIMS confirms treatment of 45 patients","✅ ₹5,000 released — treatment confirmed by AIIMS"],
    pitchNotes: ["Escrow prevents fund misuse","Hospital confirmation required for release","Full audit trail visible to all donors","Zero platform fee for disaster campaigns"]
  },
];

export default function ScenariosPage() {
  const [activeTab, setActiveTab] = useState("accident");
  const [runningDemo, setRunningDemo] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const scenario = scenarios.find(s => s.id === activeTab)!;

  async function runDemo() {
    setRunningDemo(true); setVisibleSteps(0);
    for (let i = 0; i < scenario.steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setVisibleSteps(i + 1);
    }
    setTimeout(() => setRunningDemo(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h1 className="text-3xl font-extrabold tracking-tight mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>🎯 Demo Scenarios</motion.h1>
      <p className="text-sm text-ll-text2 mb-6">Four interactive walkthroughs designed for hackathon judges.</p>

      {/* Tabs */}
      <div className="flex gap-1 bg-ll-surface border border-ll-border rounded-xl p-1 mb-6 overflow-x-auto">
        {scenarios.map(s => (
          <button key={s.id} onClick={() => { setActiveTab(s.id); setVisibleSteps(0); setRunningDemo(false); }}
            className={`relative flex-1 min-w-[120px] px-3 py-2.5 rounded-lg text-xs font-semibold text-center whitespace-nowrap transition-colors ${activeTab === s.id ? "text-ll-text" : "text-ll-text3 hover:text-ll-text2"}`}>
            {s.label}
            {activeTab === s.id && <motion.div layoutId="scenario-tab" className="absolute inset-0 bg-white/8 rounded-lg border border-ll-border2" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {/* Scenario Header */}
          <div className="bg-ll-surface border border-ll-border rounded-2xl p-6 mb-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3 mb-2">Scenario</div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">{scenario.title}</h2>
            <p className="text-sm text-ll-text2 mb-5">{scenario.desc}</p>
            <motion.button onClick={runDemo} disabled={runningDemo} whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 bg-gradient-to-br from-${scenario.color} to-${scenario.color}/70`}
              style={{ boxShadow: `0 4px 20px var(--color-${scenario.color})40` }}>
              {runningDemo ? "⏳ Running..." : "▶ Run Demo"}
            </motion.button>
          </div>

          {/* Steps Timeline */}
          <div className="bg-ll-surface border border-ll-border rounded-2xl p-6 mb-5">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3 mb-4">Timeline</div>
            <div className="space-y-3">
              {scenario.steps.map((step, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0.2, x: -10 }}
                  animate={{ opacity: i < visibleSteps ? 1 : 0.2, x: i < visibleSteps ? 0 : -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5 ${
                    i < visibleSteps ? `bg-${scenario.color}/15 text-${scenario.color}` : "bg-ll-surface2 text-ll-text4"
                  }`}>{i + 1}</div>
                  <div className={`text-sm leading-relaxed ${i < visibleSteps ? "" : "text-ll-text4"}`}>{step}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pitch Notes */}
          <div className="bg-ll-surface border border-ll-border rounded-2xl p-6">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3 mb-4">💡 Pitch Notes for Judges</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {scenario.pitchNotes.map((note, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-ll-text2">
                  <span className={`text-${scenario.color} mt-0.5`}>✦</span>
                  {note}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
