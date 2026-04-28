"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { useNotificationStore, type Notification } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const typeFilters = [
  { id: "all", label: "All", icon: "📋" },
  { id: "emergency", label: "Emergency", icon: "🚨" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "system", label: "System", icon: "⚙️" },
  { id: "fundraiser", label: "Fundraiser", icon: "💰" },
];

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead, fetchNotifications } = useNotificationStore();
  const [filter, setFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filtered = notifications.filter(n => {
    if (filter !== "all" && n.type !== filter) return false;
    if (showUnreadOnly && n.read) return false;
    return true;
  });

  // Group by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const groups: { label: string; items: Notification[] }[] = [];
  const todayItems = filtered.filter(n => {
    const d = n.time?.includes("ago") || n.time?.includes("min") || n.time?.includes("h ago");
    return d;
  });
  const olderItems = filtered.filter(n => !todayItems.includes(n));

  if (todayItems.length > 0) groups.push({ label: "Today", items: todayItems });
  if (olderItems.length > 0) groups.push({ label: "Earlier", items: olderItems });
  if (groups.length === 0 && filtered.length > 0) groups.push({ label: "All", items: filtered });

  const severityColor = (severity?: string) => {
    switch (severity) {
      case "critical": return "border-l-ll-red";
      case "moderate": return "border-l-ll-amber";
      default: return "border-l-ll-blue";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Bell className="w-7 h-7 text-ll-amber" />
            Notifications
          </h1>
          <p className="text-sm text-ll-text2 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ll-surface border border-ll-border hover:border-ll-border2 text-sm font-semibold transition-all"
          >
            <CheckCheck className="w-4 h-4 text-ll-green" />
            Mark all read
          </motion.button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {typeFilters.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f.id
                ? "bg-ll-surface2 text-ll-text border border-ll-border2"
                : "bg-ll-surface border border-ll-border text-ll-text3 hover:text-ll-text hover:border-ll-border2"
            }`}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}

        <div className="ml-auto flex-shrink-0">
          <button
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              showUnreadOnly
                ? "bg-ll-blue/10 text-ll-blue border border-ll-blue/30"
                : "bg-ll-surface border border-ll-border text-ll-text3 hover:text-ll-text"
            }`}
          >
            <Filter className="w-3 h-3" />
            Unread
          </button>
        </div>
      </motion.div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <EmptyState
          emoji="🔔"
          title="All caught up!"
          description="No notifications match your current filter."
        />
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group.label}>
              <div className="text-xs font-semibold text-ll-text4 uppercase tracking-wider mb-3">
                {group.label}
              </div>
              <div className="space-y-2">
                <AnimatePresence>
                  {group.items.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => !n.read && markRead(n.id)}
                      className={`relative bg-ll-surface border border-ll-border rounded-xl p-4 flex items-start gap-3 cursor-pointer transition-all hover:border-ll-border2 border-l-2 ${severityColor(n.severity)} ${
                        !n.read ? "bg-ll-surface2/50" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      {!n.read && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-ll-blue animate-pulse" />
                      )}

                      <div className="text-xl flex-shrink-0 mt-0.5">{n.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold truncate">{n.title}</span>
                        </div>
                        <p className="text-xs text-ll-text2 line-clamp-2">{n.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-ll-text4 font-mono">{n.time}</span>
                          <Badge variant={n.type === "emergency" ? "red" : n.type === "family" ? "blue" : "cyan"} className="text-[9px]">
                            {n.type}
                          </Badge>
                        </div>
                      </div>

                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-ll-text3 hover:text-ll-green transition-colors flex-shrink-0"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
