"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Filter, MapPin, Clock, Users } from "lucide-react";
import { useFeedStore, type FeedItem } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { FeedItemSkeleton } from "@/components/ui/Skeleton";

const typeConfig: Record<string, { emoji: string; label: string; color: "red" | "amber" | "blue" | "green" | "purple" }> = {
  accident: { emoji: "🚗", label: "Accident", color: "red" },
  fire: { emoji: "🔥", label: "Fire", color: "red" },
  flood: { emoji: "🌊", label: "Flood", color: "blue" },
  medical: { emoji: "🏥", label: "Medical", color: "green" },
  child_safety: { emoji: "👧", label: "Child Safety", color: "amber" },
};

const statusStyle: Record<string, string> = {
  active: "bg-ll-red/10 text-ll-red",
  responding: "bg-ll-amber/10 text-ll-amber",
  resolved: "bg-ll-green/10 text-ll-green",
};

export default function FeedPage() {
  const { items, addItem, fetchFeed, isLoading } = useFeedStore();
  const [filter, setFilter] = useState("all");
  const [newCount, setNewCount] = useState(0);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  // Simulate new incoming incidents
  useEffect(() => {
    const types: FeedItem["type"][] = ["accident", "fire", "flood", "medical", "child_safety"];
    const locations = ["Rohini, Delhi", "Janakpuri, Delhi", "Lajpat Nagar", "Greater Noida", "Gurgaon Sec-42"];
    const titles = ["Vehicle Collision", "Kitchen Fire", "Road Waterlogging", "Chest Pain Report", "Child Left Geofence"];

    const timer = setInterval(() => {
      const typeIdx = Math.floor(Math.random() * types.length);
      const newItem: FeedItem = {
        id: `INC-${2850 + Math.floor(Math.random() * 100)}`,
        type: types[typeIdx],
        severity: Math.random() > 0.6 ? "critical" : Math.random() > 0.3 ? "moderate" : "low",
        title: titles[typeIdx],
        location: locations[Math.floor(Math.random() * locations.length)],
        time: "Just now",
        status: "active",
        responders: Math.floor(Math.random() * 3),
      };
      addItem(newItem);
      setNewCount(c => c + 1);
    }, 12000);

    return () => clearInterval(timer);
  }, [addItem]);

  const filtered = filter === "all" ? items : items.filter(i => i.type === filter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Radio className="w-7 h-7 text-ll-red" /> Emergency Feed
          </h1>
          <p className="text-sm text-ll-text2 mt-1">Live incident stream across Delhi NCR region.</p>
        </motion.div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-ll-red/8 border border-ll-red/20 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-ll-red animate-pulse-dot" />
            <span className="text-xs font-semibold text-ll-red">{items.filter(i => i.status === "active").length} Active</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { n: items.filter(i => i.status === "active").length, l: "Active", c: "text-ll-red" },
          { n: items.filter(i => i.status === "responding").length, l: "Responding", c: "text-ll-amber" },
          { n: items.filter(i => i.status === "resolved").length, l: "Resolved", c: "text-ll-green" },
        ].map(s => (
          <div key={s.l} className="bg-ll-surface border border-ll-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-black font-mono ${s.c}`}>{s.n}</div>
            <div className="text-[10px] text-ll-text3 uppercase tracking-wider mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
        {["all", "accident", "fire", "flood", "medical", "child_safety"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filter === f ? "bg-white/8 text-ll-text border border-ll-border2" : "text-ll-text3 hover:bg-white/5"}`}>
            {f === "all" ? "All Types" : `${typeConfig[f]?.emoji} ${typeConfig[f]?.label}`}
          </button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((item, i) => {
            const cfg = typeConfig[item.type];
            return (
              <motion.div key={`${item.id}-${i}`} initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} transition={{ duration: 0.3 }}
                className="bg-ll-surface border border-ll-border rounded-2xl p-4 hover:border-ll-border2 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-${cfg.color}/10 border border-${cfg.color}/20 flex items-center justify-center text-lg flex-shrink-0`}>{cfg.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold">{item.title}</span>
                      <Badge variant={item.severity === "critical" ? "red" : item.severity === "moderate" ? "amber" : "green"} className="text-[9px]">{item.severity}</Badge>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[item.status]}`}>{item.status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ll-text3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                      {item.responders > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.responders} responding</span>}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-ll-text4 flex-shrink-0">{item.id}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
