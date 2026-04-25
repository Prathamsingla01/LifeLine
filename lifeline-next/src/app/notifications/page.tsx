"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck } from "lucide-react";
import { useNotificationStore } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";

const typeColors: Record<string, string> = { emergency: "ll-red", family: "ll-blue", system: "ll-cyan", fundraiser: "ll-green" };
const typeLabels: Record<string, string> = { emergency: "Emergency", family: "Family", system: "System", fundraiser: "Fundraiser" };

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? notifications : filter === "unread" ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3"><Bell className="w-7 h-7 text-ll-amber" /> Notifications</h1>
          <p className="text-sm text-ll-text2 mt-1">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}</p>
        </motion.div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-ll-surface border border-ll-border hover:border-ll-border2 text-ll-text2 transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2">
        {["all", "unread", "emergency", "family", "system", "fundraiser"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${filter === f ? "bg-white/8 text-ll-text border border-ll-border2" : "text-ll-text3 hover:bg-white/5"}`}>
            {f === "all" ? "All" : f === "unread" ? `Unread (${unreadCount})` : typeLabels[f] || f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-ll-text3">
              <div className="text-4xl mb-4">🔔</div><div className="text-sm">No notifications</div>
            </motion.div>
          ) : filtered.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => !n.read && markRead(n.id)}
              className={`relative flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${n.read ? "bg-ll-surface/50 border-ll-border hover:border-ll-border2" : "bg-ll-surface border-ll-border2"}`}>
              {!n.read && <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-ll-blue animate-pulse-dot" />}
              <div className={`w-10 h-10 rounded-xl bg-${typeColors[n.type]}/10 border border-${typeColors[n.type]}/20 flex items-center justify-center text-lg flex-shrink-0`}>{n.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-bold ${n.read ? "text-ll-text2" : "text-ll-text"}`}>{n.title}</span>
                  <Badge variant={n.severity === "critical" ? "red" : n.severity === "moderate" ? "amber" : "blue"} className="text-[9px] px-1.5 py-0">{typeLabels[n.type]}</Badge>
                </div>
                <p className="text-xs text-ll-text3">{n.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] font-mono text-ll-text4">{n.time}</span>
                  {n.read && <span className="text-[10px] text-ll-text4 flex items-center gap-1"><Check className="w-3 h-3" /> Read</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
