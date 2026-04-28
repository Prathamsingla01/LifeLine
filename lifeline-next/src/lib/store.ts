import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// ── Types ──
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "HOSPITAL_STAFF" | "ADMIN";
  avatar?: string | null;
  lifelineId?: string;
  isVerified?: boolean;
}

export interface MedicalProfile {
  bloodType?: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  emergencyNotes?: string;
  organDonor: boolean;
  insuranceProvider?: string;
  insurancePolicyNo?: string;
  primaryDoctor?: string;
  primaryDoctorPhone?: string;
  height?: number;
  weight?: number;
}

export interface EmergencyContactData {
  id: string;
  name: string;
  phone: string;
  relation: string;
  priority: number;
}

export interface SafetyScoreData {
  score: number;
  level: number;
  streak: number;
}

export interface UserSettingsData {
  theme: string;
  language: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsAlerts: boolean;
  locationSharing: boolean;
  crashDetection: boolean;
  crashSensitivity: string;
  autoSOS: boolean;
  sosCountdown: number;
  silentMode: boolean;
}

// ══════════════════════════════════════════════
// AUTH STORE
// ══════════════════════════════════════════════
interface AuthState {
  user: UserData | null;
  profile: MedicalProfile | null;
  settings: UserSettingsData | null;
  safetyScore: SafetyScoreData | null;
  badges: { badge: string; awardedAt: string }[];
  emergencyContacts: EmergencyContactData[];
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setUser: (user: UserData) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  settings: null,
  safetyScore: null,
  badges: [],
  emergencyContacts: [],
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      if (res.data.success) {
        set({
          user: res.data.data.user,
          isAuthenticated: true,
        });
        // Fetch full user data
        useAuthStore.getState().fetchUser();
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (e: unknown) {
      const error = e as { response?: { data?: { error?: string } } };
      return { success: false, error: error.response?.data?.error || "Login failed" };
    }
  },

  register: async (data) => {
    try {
      const res = await axios.post("/api/auth/register", data);
      if (res.data.success) {
        set({
          user: res.data.data.user,
          isAuthenticated: true,
        });
        useAuthStore.getState().fetchUser();
        return { success: true };
      }
      return { success: false, error: res.data.error };
    } catch (e: unknown) {
      const error = e as { response?: { data?: { error?: string } } };
      return { success: false, error: error.response?.data?.error || "Registration failed" };
    }
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {
      // ignore
    }
    set({
      user: null,
      profile: null,
      settings: null,
      safetyScore: null,
      badges: [],
      emergencyContacts: [],
      isAuthenticated: false,
      isLoading: false,
    });
  },

  fetchUser: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get("/api/user/me");
      if (res.data.success) {
        const { user, profile, settings, safetyScore, badges, emergencyContacts } = res.data.data;
        set({
          user,
          profile,
          settings,
          safetyScore,
          badges: badges || [],
          emergencyContacts: emergencyContacts || [],
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
}));

// ══════════════════════════════════════════════
// NOTIFICATION STORE
// ══════════════════════════════════════════════
export interface Notification {
  id: string;
  type: "emergency" | "family" | "system" | "fundraiser" | "badge" | "safety";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: string;
  severity?: "critical" | "moderate" | "info";
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Notification) => void;
}

const demoNotifications: Notification[] = [
  { id: "n1", type: "emergency", title: "Flood Alert — Delhi NCR", message: "Moderate flood risk in Yamuna basin areas. Safe zones activated.", time: "5 min ago", read: false, icon: "🌊", severity: "critical" },
  { id: "n2", type: "family", title: "Ananya arrived at school", message: "Geofence entered: DPS School, Sector 45", time: "1h ago", read: false, icon: "✅", severity: "info" },
  { id: "n3", type: "system", title: "Medical profile updated", message: "Your medical profile was synced successfully.", time: "2h ago", read: true, icon: "🩺", severity: "info" },
  { id: "n4", type: "emergency", title: "Accident near CP", message: "INC-2847: Car accident at Connaught Place. Ambulance dispatched.", time: "3h ago", read: true, icon: "🚗", severity: "moderate" },
  { id: "n5", type: "fundraiser", title: "Donation received", message: "₹500 donated to Flood Relief Assam campaign.", time: "1d ago", read: true, icon: "💰", severity: "info" },
  { id: "n6", type: "family", title: "Priya safety check-in", message: "Priya Mehta confirmed safe status.", time: "1d ago", read: true, icon: "📱", severity: "info" },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: demoNotifications,
  unreadCount: demoNotifications.filter((n) => !n.read).length,
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get("/api/notifications");
      if (res.data.success) {
        const items = res.data.data;
        set({
          notifications: items,
          unreadCount: items.filter((n: Notification) => !n.read).length,
          isLoading: false,
        });
      }
    } catch {
      // Keep demo data on failure
      set({ isLoading: false });
    }
  },

  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      // Fire and forget API call
      axios.post(`/api/notifications/${id}/read`).catch(() => {});
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),

  markAllRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
    axios.post("/api/notifications/read-all").catch(() => {});
  },

  addNotification: (n) =>
    set((s) => ({
      notifications: [n, ...s.notifications],
      unreadCount: s.unreadCount + (n.read ? 0 : 1),
    })),
}));

// ══════════════════════════════════════════════
// EMERGENCY FEED STORE
// ══════════════════════════════════════════════
export interface FeedItem {
  id: string;
  type: "accident" | "fire" | "flood" | "medical" | "child_safety" | "earthquake" | "violence" | "other";
  severity: "critical" | "moderate" | "low";
  title: string;
  location: string;
  time: string;
  status: "active" | "responding" | "resolved";
  responders: number;
  lat?: number;
  lng?: number;
}

interface FeedState {
  items: FeedItem[];
  isLoading: boolean;
  fetchFeed: () => Promise<void>;
  addItem: (item: FeedItem) => void;
  updateItem: (id: string, updates: Partial<FeedItem>) => void;
}

const demoFeed: FeedItem[] = [
  { id: "INC-2847", type: "accident", severity: "critical", title: "Car Accident — Multi-vehicle", location: "Connaught Place, Delhi", time: "2 min ago", status: "responding", responders: 3, lat: 28.6315, lng: 77.2167 },
  { id: "INC-2846", type: "medical", severity: "moderate", title: "Fall Injury — Elderly", location: "Karol Bagh, Delhi", time: "5 min ago", status: "responding", responders: 1, lat: 28.6519, lng: 77.1909 },
  { id: "INC-2845", type: "fire", severity: "critical", title: "Building Fire — 3rd Floor", location: "Saket, Delhi", time: "8 min ago", status: "active", responders: 5, lat: 28.5245, lng: 77.2066 },
  { id: "INC-2844", type: "medical", severity: "low", title: "Minor Injury — Sports", location: "Dwarka Sec-12", time: "15 min ago", status: "resolved", responders: 1, lat: 28.5921, lng: 77.0460 },
  { id: "INC-2843", type: "flood", severity: "moderate", title: "Waterlogging — Road Blocked", location: "Yamuna Banks", time: "22 min ago", status: "active", responders: 2, lat: 28.6800, lng: 77.2500 },
  { id: "INC-2842", type: "child_safety", severity: "moderate", title: "Child Geofence Alert", location: "Sector 45, Noida", time: "35 min ago", status: "resolved", responders: 0, lat: 28.5700, lng: 77.3500 },
  { id: "INC-2841", type: "accident", severity: "low", title: "Minor Fender Bender", location: "Rohini, Delhi", time: "45 min ago", status: "resolved", responders: 1, lat: 28.7495, lng: 77.0565 },
  { id: "INC-2840", type: "medical", severity: "critical", title: "Cardiac Emergency", location: "Hauz Khas, Delhi", time: "1h ago", status: "resolved", responders: 4, lat: 28.5494, lng: 77.2001 },
];

export const useFeedStore = create<FeedState>((set) => ({
  items: demoFeed,
  isLoading: false,

  fetchFeed: async () => {
    try {
      set({ isLoading: true });
      const res = await axios.get("/api/feed");
      if (res.data.success) {
        set({ items: res.data.data, isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: (item) => set((s) => ({ items: [item, ...s.items] })),
  updateItem: (id, updates) =>
    set((s) => ({
      items: s.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    })),
}));

// ══════════════════════════════════════════════
// THEME STORE (persisted)
// ══════════════════════════════════════════════
type ThemeMode = "dark" | "light";

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      toggle: () =>
        set((s) => {
          const next = s.mode === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("light", next === "light");
          }
          return { mode: next };
        }),
      setMode: (mode) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("light", mode === "light");
        }
        set({ mode });
      },
    }),
    {
      name: "ll-theme",
      partialize: (state) => ({ mode: state.mode }),
    }
  )
);

// ══════════════════════════════════════════════
// SIDEBAR STORE
// ══════════════════════════════════════════════
interface SidebarState {
  open: boolean;
  collapsed: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  toggleCollapse: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  open: false,
  collapsed: false,
  toggle: () => set((s) => ({ open: !s.open })),
  setOpen: (open) => set({ open }),
  toggleCollapse: () => set((s) => ({ collapsed: !s.collapsed })),
}));

// ══════════════════════════════════════════════
// LOCATION STORE
// ══════════════════════════════════════════════
interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  watching: boolean;
  error: string | null;
  startWatching: () => void;
  stopWatching: () => void;
}

let watchId: number | null = null;

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lng: null,
  accuracy: null,
  watching: false,
  error: null,

  startWatching: () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      set({ error: "Geolocation not supported" });
      return;
    }

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        set({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          watching: true,
          error: null,
        });
      },
      (err) => {
        set({ error: err.message, watching: false });
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );

    set({ watching: true });
  },

  stopWatching: () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
    set({ watching: false });
  },
}));
