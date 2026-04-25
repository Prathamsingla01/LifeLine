import { create } from "zustand";

/* ── Auth Store ── */
interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "hospital" | "admin";
    avatar?: string;
  } | null;
  isAuthenticated: boolean;
  login: (user: AuthState["user"]) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: "usr-2025-00482",
    name: "Arjun Mehta",
    email: "arjun@email.com",
    role: "user",
  },
  isAuthenticated: true,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

/* ── Notifications Store ── */
export interface Notification {
  id: string;
  type: "emergency" | "family" | "system" | "fundraiser";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  severity?: "critical" | "moderate" | "info";
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void;
}

const initialNotifications: Notification[] = [
  { id: "n1", type: "emergency", title: "Flood Alert — Delhi NCR", message: "Moderate flood risk in Yamuna basin areas. Safe zones activated.", time: "5 min ago", read: false, icon: "🌊", severity: "critical" },
  { id: "n2", type: "family", title: "Ananya arrived at school", message: "Geofence entered: DPS School, Sector 45", time: "1h ago", read: false, icon: "✅", severity: "info" },
  { id: "n3", type: "system", title: "Medical profile updated", message: "Your medical profile was synced successfully.", time: "2h ago", read: true, icon: "🩺", severity: "info" },
  { id: "n4", type: "emergency", title: "Accident near CP", message: "INC-2847: Car accident at Connaught Place. Ambulance dispatched.", time: "3h ago", read: true, icon: "🚗", severity: "moderate" },
  { id: "n5", type: "fundraiser", title: "Donation received", message: "₹500 donated to Flood Relief Assam campaign.", time: "1d ago", read: true, icon: "💰", severity: "info" },
  { id: "n6", type: "family", title: "Priya safety check-in", message: "Priya Mehta confirmed safe status.", time: "1d ago", read: true, icon: "📱", severity: "info" },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n) => !n.read).length,
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + (n.read ? 0 : 1),
    })),
}));

/* ── Emergency Feed Store ── */
export interface FeedItem {
  id: string;
  type: "accident" | "fire" | "flood" | "medical" | "child_safety";
  severity: "critical" | "moderate" | "low";
  title: string;
  location: string;
  time: string;
  status: "active" | "responding" | "resolved";
  responders: number;
}

interface FeedState {
  items: FeedItem[];
  addItem: (item: FeedItem) => void;
}

const initialFeed: FeedItem[] = [
  { id: "INC-2847", type: "accident", severity: "critical", title: "Car Accident — Multi-vehicle", location: "Connaught Place, Delhi", time: "2 min ago", status: "responding", responders: 3 },
  { id: "INC-2846", type: "medical", severity: "moderate", title: "Fall Injury — Elderly", location: "Karol Bagh, Delhi", time: "5 min ago", status: "responding", responders: 1 },
  { id: "INC-2845", type: "fire", severity: "critical", title: "Building Fire — 3rd Floor", location: "Saket, Delhi", time: "8 min ago", status: "active", responders: 5 },
  { id: "INC-2844", type: "medical", severity: "low", title: "Minor Injury — Sports", location: "Dwarka Sec-12", time: "15 min ago", status: "resolved", responders: 1 },
  { id: "INC-2843", type: "flood", severity: "moderate", title: "Waterlogging — Road Blocked", location: "Yamuna Banks", time: "22 min ago", status: "active", responders: 2 },
  { id: "INC-2842", type: "child_safety", severity: "moderate", title: "Child Geofence Alert", location: "Sector 45, Noida", time: "35 min ago", status: "resolved", responders: 0 },
  { id: "INC-2841", type: "accident", severity: "low", title: "Minor Fender Bender", location: "Rohini, Delhi", time: "45 min ago", status: "resolved", responders: 1 },
  { id: "INC-2840", type: "medical", severity: "critical", title: "Cardiac Emergency", location: "Hauz Khas, Delhi", time: "1h ago", status: "resolved", responders: 4 },
];

export const useFeedStore = create<FeedState>((set) => ({
  items: initialFeed,
  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
}));
