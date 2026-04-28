"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Bell, Lock, Moon, Smartphone, AlertTriangle, Gauge, Trash2, LogOut, Key } from "lucide-react";
import { useThemeStore, useAuthStore } from "@/lib/store";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
import axios from "axios";

function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={`w-11 h-6 rounded-full relative transition-colors ${on ? "bg-ll-green" : "bg-ll-surface3"}`} aria-label="Toggle">
      <motion.div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md" animate={{ left: on ? 22 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-ll-border last:border-0">
      <div><div className="text-sm font-semibold">{label}</div>{desc && <div className="text-xs text-ll-text3 mt-0.5">{desc}</div>}</div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const { user, settings, logout, fetchUser } = useAuthStore();
  const { mode, toggle: toggleTheme } = useThemeStore();

  const [locationSharing, setLocationSharing] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [crashDetection, setCrashDetection] = useState(true);
  const [crashSensitivity, setCrashSensitivity] = useState("medium");
  const [autoSOS, setAutoSOS] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(10);
  const [saving, setSaving] = useState(false);

  // Sync settings from store
  useEffect(() => {
    if (settings) {
      setLocationSharing(settings.locationSharing);
      setPushNotifs(settings.pushNotifications);
      setEmailNotifs(settings.emailNotifications);
      setSmsNotifs(settings.smsAlerts);
      setCrashDetection(settings.crashDetection);
      setCrashSensitivity(settings.crashSensitivity);
      setAutoSOS(settings.autoSOS);
      setSosCountdown(settings.sosCountdown);
    }
  }, [settings]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  async function save() {
    setSaving(true);
    try {
      await axios.put("/api/user/settings", {
        locationSharing,
        pushNotifications: pushNotifs,
        emailNotifications: emailNotifs,
        smsAlerts: smsNotifs,
        crashDetection,
        crashSensitivity,
        autoSOS,
        sosCountdown,
        theme: mode,
      });
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  }

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Settings className="w-7 h-7 text-ll-text3" /> Settings
      </motion.h1>
      <p className="text-sm text-ll-text2 mb-8">Manage your profile, privacy, and notification preferences.</p>

      <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
        {/* Profile */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><User className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Profile</span></div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ll-surface2 to-ll-surface3 border border-ll-border2 flex items-center justify-center text-2xl">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-2xl object-cover" /> : "👤"}
            </div>
            <div>
              <div className="text-lg font-bold">{user?.name || "User"}</div>
              <div className="text-xs text-ll-text3 font-mono">{user?.email} · {user?.lifelineId || "LL-00482"}</div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input label="Full Name" defaultValue={user?.name || ""} />
            <Input label="Phone" defaultValue={user?.phone || "+91 98765 43210"} icon={<Smartphone className="w-4 h-4" />} />
          </div>
        </motion.div>

        {/* Privacy & Safety */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Lock className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Privacy & Safety</span></div>
          <SettingRow label="Share location with family" desc="Family members can see your real-time location"><ToggleSwitch on={locationSharing} onChange={() => setLocationSharing(!locationSharing)} /></SettingRow>
          <SettingRow label="Auto crash detection" desc="Use accelerometer to detect accidents automatically"><ToggleSwitch on={crashDetection} onChange={() => setCrashDetection(!crashDetection)} /></SettingRow>
          <SettingRow label="Auto SOS on crash" desc="Automatically trigger SOS if crash detected"><ToggleSwitch on={autoSOS} onChange={() => setAutoSOS(!autoSOS)} /></SettingRow>
          
          {/* Crash Sensitivity */}
          <div className="py-4 border-b border-ll-border">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold flex items-center gap-2"><Gauge className="w-4 h-4 text-ll-text3" /> Crash Sensitivity</div>
                <div className="text-xs text-ll-text3 mt-0.5">Higher sensitivity = more false alerts, fewer missed events</div>
              </div>
            </div>
            <div className="flex gap-2">
              {["low", "medium", "high"].map(level => (
                <button key={level} onClick={() => setCrashSensitivity(level)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    crashSensitivity === level
                      ? level === "high" ? "bg-ll-red/10 text-ll-red border border-ll-red/30"
                        : level === "medium" ? "bg-ll-amber/10 text-ll-amber border border-ll-amber/30"
                        : "bg-ll-green/10 text-ll-green border border-ll-green/30"
                      : "bg-ll-bg border border-ll-border text-ll-text3 hover:border-ll-border2"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* SOS Countdown */}
          <div className="py-4">
            <div className="text-sm font-semibold mb-1">SOS Countdown</div>
            <div className="text-xs text-ll-text3 mb-3">Time before SOS is sent after activation</div>
            <div className="flex items-center gap-3">
              <input
                type="range" min={3} max={30} value={sosCountdown}
                onChange={(e) => setSosCountdown(parseInt(e.target.value))}
                className="flex-1 accent-ll-red"
              />
              <span className="text-sm font-mono font-bold text-ll-red w-12 text-right">{sosCountdown}s</span>
            </div>
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Notifications</span></div>
          <SettingRow label="Push notifications" desc="Receive alerts via browser/app push"><ToggleSwitch on={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} /></SettingRow>
          <SettingRow label="Email notifications" desc="Receive alerts and summaries via email"><ToggleSwitch on={emailNotifs} onChange={() => setEmailNotifs(!emailNotifs)} /></SettingRow>
          <SettingRow label="SMS notifications" desc="Receive critical alerts via SMS"><ToggleSwitch on={smsNotifs} onChange={() => setSmsNotifs(!smsNotifs)} /></SettingRow>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Moon className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Appearance</span></div>
          <SettingRow label="Dark mode" desc="Toggle between dark and light theme">
            <ToggleSwitch on={mode === "dark"} onChange={toggleTheme} />
          </SettingRow>
        </motion.div>

        {/* Danger Zone */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-red/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><AlertTriangle className="w-5 h-5 text-ll-red" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-red/60">Danger Zone</span></div>
          <div className="space-y-3">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-ll-border hover:border-ll-red/30 hover:bg-ll-red/5 transition-all text-left">
              <LogOut className="w-4 h-4 text-ll-red" />
              <div>
                <div className="text-sm font-semibold">Log Out</div>
                <div className="text-xs text-ll-text3">Sign out of your account</div>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-ll-border hover:border-ll-red/30 hover:bg-ll-red/5 transition-all text-left opacity-50 cursor-not-allowed">
              <Trash2 className="w-4 h-4 text-ll-red" />
              <div>
                <div className="text-sm font-semibold">Delete Account</div>
                <div className="text-xs text-ll-text3">Permanently delete your account and all data</div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Save */}
        <motion.div variants={item} className="flex justify-end">
          <motion.button whileTap={{ scale: 0.97 }} onClick={save} disabled={saving}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all bg-gradient-to-br from-ll-blue to-blue-700 glow-blue hover:-translate-y-0.5 disabled:opacity-60">
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
