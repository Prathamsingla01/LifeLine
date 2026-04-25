"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Brain, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { MapMarker } from "@/components/maps/EmergencyMap";

const EmergencyMap = dynamic(() => import("@/components/maps/EmergencyMap").then(m => ({ default: m.EmergencyMap })), { ssr: false, loading: () => <div className="h-96 skeleton rounded-2xl" /> });

const timeSlots = ["Morning (6-12)", "Afternoon (12-6)", "Evening (6-12)", "Night (12-6)"];

const riskZones = [
  { id: "r1", name: "Connaught Place", risk: "High", type: "Traffic Accidents", score: 87, trend: "+12%", color: "red" as const },
  { id: "r2", name: "Yamuna Banks", risk: "Critical", type: "Flood Risk", score: 94, trend: "+28%", color: "red" as const },
  { id: "r3", name: "Chandni Chowk", risk: "Moderate", type: "Fire Hazard", score: 62, trend: "-5%", color: "amber" as const },
  { id: "r4", name: "Dwarka Expressway", risk: "High", type: "Road Accidents", score: 78, trend: "+8%", color: "red" as const },
  { id: "r5", name: "Saket", risk: "Low", type: "General Safety", score: 32, trend: "-15%", color: "green" as const },
  { id: "r6", name: "Hauz Khas", risk: "Moderate", type: "Night Safety", score: 55, trend: "+3%", color: "amber" as const },
];

const riskMarkers: MapMarker[] = [
  { id: "rm1", lat: 28.6315, lng: 77.2190, type: "danger", label: "CP - High Risk", popup: "87/100 · Traffic Accidents", severity: "critical", pulse: true },
  { id: "rm2", lat: 28.6800, lng: 77.2500, type: "danger", label: "Yamuna - Critical", popup: "94/100 · Flood Risk", severity: "critical", pulse: true },
  { id: "rm3", lat: 28.6506, lng: 77.2303, type: "danger", label: "Chandni Chowk", popup: "62/100 · Fire Hazard", severity: "moderate" },
  { id: "rm4", lat: 28.5713, lng: 77.0440, type: "danger", label: "Dwarka Exp", popup: "78/100 · Road Accidents", severity: "critical" },
  { id: "rm5", lat: 28.5244, lng: 77.2066, type: "hospital", label: "Saket - Safe", popup: "32/100 · Low Risk" },
  { id: "rm6", lat: 28.5494, lng: 77.2001, type: "danger", label: "Hauz Khas", popup: "55/100 · Night Safety", severity: "moderate" },
];

export default function RiskMapPage() {
  const [timeSlot, setTimeSlot] = useState(0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Brain className="w-7 h-7 text-ll-purple" /> AI Risk Map
          </h1>
          <p className="text-sm text-ll-text2 mt-1">AI-predicted danger zones based on historical data and real-time conditions.</p>
        </motion.div>
        <Badge variant="purple" dot>AI Powered</Badge>
      </div>

      {/* Time Selector */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
        {timeSlots.map((slot, i) => (
          <button key={slot} onClick={() => setTimeSlot(i)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${timeSlot === i ? "bg-ll-purple/10 text-ll-purple border border-ll-purple/25" : "text-ll-text3 hover:bg-white/5 border border-transparent"}`}>
            <Clock className="w-3.5 h-3.5" /> {slot}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative mb-6">
        <EmergencyMap markers={riskMarkers} center={[28.61, 77.18]} zoom={11} height="h-96" />
        <div className="absolute top-4 left-4 z-[500] glass rounded-xl px-3 py-2 flex items-center gap-2">
          <Brain className="w-4 h-4 text-ll-purple" />
          <span className="text-xs font-mono uppercase tracking-wider text-ll-text3">AI Prediction · {timeSlots[timeSlot]}</span>
        </div>
        <div className="absolute top-4 right-4 z-[500] flex flex-col gap-1">
          {[{ c: "bg-ll-red", l: "High Risk" }, { c: "bg-ll-amber", l: "Moderate" }, { c: "bg-ll-green", l: "Low Risk" }].map(item => (
            <div key={item.l} className="glass rounded-lg px-2.5 py-1 flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${item.c}`} />
              <span className="text-[10px] font-semibold text-ll-text2">{item.l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Zone Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {riskZones.map((zone, i) => (
          <motion.div key={zone.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-ll-surface border border-ll-border rounded-2xl p-4 hover:border-ll-border2 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold">{zone.name}</span>
              <Badge variant={zone.color}>{zone.risk}</Badge>
            </div>
            <div className="text-xs text-ll-text3 mb-3">{zone.type}</div>
            {/* Risk Bar */}
            <div className="w-full h-2 bg-ll-bg rounded-full overflow-hidden mb-2">
              <motion.div className={`h-full rounded-full ${zone.score >= 80 ? "bg-ll-red" : zone.score >= 50 ? "bg-ll-amber" : "bg-ll-green"}`}
                initial={{ width: 0 }} animate={{ width: `${zone.score}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="font-mono text-ll-text3">Score: {zone.score}/100</span>
              <span className={`font-semibold flex items-center gap-1 ${zone.trend.startsWith("+") ? "text-ll-red" : "text-ll-green"}`}>
                <TrendingUp className="w-3 h-3" /> {zone.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-6 bg-gradient-to-r from-ll-purple/5 to-transparent border border-ll-purple/15 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-ll-purple" />
          <span className="text-sm font-bold text-ll-purple">AI Insights</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-ll-text2">
          <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-ll-red mt-0.5 flex-shrink-0" /><span>Yamuna basin flood risk elevated 28% due to upstream dam release scheduled at 4 PM.</span></div>
          <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-ll-amber mt-0.5 flex-shrink-0" /><span>CP intersection accident rate peaks between 5-7 PM during weekdays. Extra caution advised.</span></div>
          <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-ll-green mt-0.5 flex-shrink-0" /><span>Saket area shows 15% improvement in safety metrics after traffic signal upgrade.</span></div>
          <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-ll-blue mt-0.5 flex-shrink-0" /><span>3 ambulances pre-positioned at high-risk zones based on AI prediction.</span></div>
        </div>
      </motion.div>
    </div>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z"/></svg>;
}
