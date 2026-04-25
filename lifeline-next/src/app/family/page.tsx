"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import type { MapMarker } from "@/components/maps/EmergencyMap";

const EmergencyMap = dynamic(() => import("@/components/maps/EmergencyMap").then(m => ({ default: m.EmergencyMap })), { ssr: false, loading: () => <div className="h-80 skeleton rounded-2xl" /> });

const members = [
  { id: "arjun", name: "Arjun Mehta", role: "You · Family Admin", emoji: "👨", location: "Connaught Place", updated: "Just now", battery: 78, speed: "0 km/h", status: "safe", color: "ll-blue", lat: 28.6315, lng: 77.2190 },
  { id: "priya", name: "Priya Mehta", role: "Wife", emoji: "👩", location: "Karol Bagh", updated: "2 min ago", battery: 62, speed: "34 km/h", status: "moving", color: "ll-purple", lat: 28.6519, lng: 77.1905 },
  { id: "ananya", name: "Ananya Mehta", role: "Daughter · Child Mode", emoji: "👧", location: "DPS School", updated: "5 min ago", battery: 31, speed: "Geofence: Inside ✓", status: "safe", color: "ll-green", lat: 28.5726, lng: 77.2600 },
  { id: "dadu", name: "Ramesh Mehta", role: "Grandfather · Elder Mode", emoji: "👴", location: "Lodhi Gardens", updated: "8 min ago", battery: 55, speed: "3,241 steps", status: "safe", color: "ll-amber", lat: 28.5934, lng: 77.2190 },
];

const activities = [
  { icon: "✅", text: "Ananya arrived at DPS School (geofence entered)", time: "08:15 AM", bg: "bg-ll-green/10" },
  { icon: "🚗", text: "Priya started a trip from Home → Karol Bagh", time: "09:42 AM", bg: "bg-ll-blue/10" },
  { icon: "🚶", text: "Dadu began morning walk — 3,241 steps", time: "06:30 AM", bg: "bg-ll-amber/10" },
  { icon: "🔋", text: "Ananya's phone battery below 35%", time: "10:05 AM", bg: "bg-ll-red/10" },
  { icon: "📱", text: "Priya acknowledged Arjun's safety check-in", time: "Yesterday", bg: "bg-ll-purple/10" },
  { icon: "🏠", text: "All family members were home safe by 9:30 PM", time: "Yesterday", bg: "bg-ll-green/10" },
];

export default function FamilyPage() {
  const [sosFiring, setSosFiring] = useState(false);
  const [sosStatus, setSosStatus] = useState("");
  const [focusedMember, setFocusedMember] = useState<string | null>(null);

  const mapMarkers: MapMarker[] = members.map(m => ({
    id: m.id, lat: m.lat, lng: m.lng, type: "family" as const,
    label: m.name, popup: `${m.location} · ${m.updated}`, pulse: focusedMember === m.id,
  }));

  async function triggerSOS() {
    if (sosFiring) return;
    setSosFiring(true);
    setSosStatus("⏳ Sending SOS to all family members...");
    await new Promise(r => setTimeout(r, 800));
    setSosStatus("📲 Priya notified ✓");
    await new Promise(r => setTimeout(r, 600));
    setSosStatus("📲 Priya ✓ · Dadu ✓");
    await new Promise(r => setTimeout(r, 600));
    setSosStatus("📲 Priya ✓ · Dadu ✓ · Ananya ✓");
    await new Promise(r => setTimeout(r, 500));
    setSosStatus("✅ All 3 family members alerted with your live location!");
    setTimeout(() => { setSosFiring(false); setSosStatus(""); }, 4000);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.h1 className="text-3xl font-extrabold tracking-tight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>👨‍👩‍👧‍👦 Family Tracker</motion.h1>
        <div className="bg-ll-surface border border-ll-border rounded-lg px-4 py-2 font-mono text-sm text-ll-blue">
          <span className="text-[10px] text-ll-text3 uppercase tracking-wider mr-2">Group</span>KMFG-7291
        </div>
      </div>

      {/* Real Leaflet Map */}
      <div className="relative mb-6">
        <EmergencyMap markers={mapMarkers} center={[28.61, 77.23]} zoom={12} height="h-80"
          onMarkerClick={(m) => setFocusedMember(m.id)} />
        <div className="absolute top-4 left-4 z-[500] glass rounded-xl px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-ll-green animate-pulse-dot" />
          <span className="text-xs font-mono uppercase tracking-wider text-ll-text3">Family Locations · Live</span>
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {members.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setFocusedMember(m.id)}
            className={`bg-ll-surface border rounded-2xl p-4 cursor-pointer hover:-translate-y-0.5 transition-all ${focusedMember === m.id ? "border-ll-border2 shadow-lg" : "border-ll-border"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${m.color}/12 text-${m.color} flex items-center justify-center text-sm font-extrabold`}>{m.name.split(" ").map(w => w[0]).join("")}</div>
              <div className="flex-1"><div className="text-sm font-bold">{m.name}</div><div className="text-[11px] text-ll-text3">{m.role}</div></div>
              <Badge variant={m.status === "moving" ? "blue" : "green"} dot>
                {m.status === "moving" ? "Moving" : "Safe"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-ll-bg rounded-lg p-2"><div className="text-[9px] text-ll-text3 uppercase tracking-wider font-semibold mb-0.5">Location</div><div className="text-xs font-semibold">{m.location}</div></div>
              <div className="bg-ll-bg rounded-lg p-2"><div className="text-[9px] text-ll-text3 uppercase tracking-wider font-semibold mb-0.5">Updated</div><div className={`text-xs font-semibold ${m.updated === "Just now" ? "text-ll-green" : ""}`}>{m.updated}</div></div>
              <div className="bg-ll-bg rounded-lg p-2"><div className="text-[9px] text-ll-text3 uppercase tracking-wider font-semibold mb-0.5">Battery</div><div className={`text-xs font-semibold ${m.battery < 35 ? "text-ll-amber" : ""}`}>{m.battery}%</div></div>
              <div className="bg-ll-bg rounded-lg p-2"><div className="text-[9px] text-ll-text3 uppercase tracking-wider font-semibold mb-0.5">Speed</div><div className={`text-xs font-semibold ${m.status === "moving" ? "text-ll-blue" : ""}`}>{m.speed}</div></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed */}
      <div className="bg-ll-surface border border-ll-border rounded-2xl p-5 mb-6">
        <div className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3 mb-4">Recent Activity</div>
        {activities.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 py-2.5 border-b border-ll-border last:border-0">
            <div className={`w-8 h-8 rounded-lg ${a.bg} flex items-center justify-center text-sm flex-shrink-0`}>{a.icon}</div>
            <div className="flex-1 text-sm text-ll-text2">{a.text}</div>
            <span className="text-[11px] font-mono text-ll-text4 whitespace-nowrap">{a.time}</span>
          </motion.div>
        ))}
      </div>

      {/* Family SOS */}
      <div className="bg-gradient-to-r from-ll-red/5 to-transparent border border-ll-red/15 rounded-2xl p-8 text-center">
        <h3 className="text-lg font-extrabold text-ll-red mb-2">🚨 Family SOS</h3>
        <p className="text-sm text-ll-text2 mb-5 max-w-sm mx-auto">Instantly alert all family members with your live location.</p>
        <motion.button onClick={triggerSOS} whileTap={{ scale: 0.95 }}
          className={`w-24 h-24 rounded-full text-white text-2xl font-black transition-all ${sosStatus.includes("✅") ? "bg-gradient-to-br from-ll-green to-green-700" : "bg-gradient-to-br from-ll-red to-red-700"}`}
          style={{ boxShadow: "0 0 0 12px rgba(239,68,68,0.08), 0 0 0 24px rgba(239,68,68,0.04)" }}>
          {sosStatus.includes("✅") ? "✓" : "SOS"}
        </motion.button>
        <p className="text-xs text-ll-text3 mt-4 min-h-[20px]">{sosStatus || "Tap to send alert to all 3 family members"}</p>
      </div>
    </div>
  );
}
