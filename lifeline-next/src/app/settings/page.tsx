"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Shield, Bell, Lock, Moon, Sun, Smartphone } from "lucide-react";
import { useThemeStore } from "@/lib/store";

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
  const [locationSharing, setLocationSharing] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [sosVibrate, setSosVibrate] = useState(true);
  const [autoDetect, setAutoDetect] = useState(true);
  const [saved, setSaved] = useState(false);
  const { mode, toggle: toggleTheme } = useThemeStore();

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ll-surface2 to-ll-surface3 border border-ll-border2 flex items-center justify-center text-2xl">👤</div>
            <div><div className="text-lg font-bold">Arjun Mehta</div><div className="text-xs text-ll-text3 font-mono">arjun@email.com · LL-USR-2025-00482</div></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-1.5 block">Full Name</label><input defaultValue="Arjun Mehta" className="w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ll-blue/50 transition-colors" /></div>
            <div><label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-1.5 block">Phone</label><input defaultValue="+91 98765 43210" className="w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ll-blue/50 transition-colors" /></div>
          </div>
        </motion.div>

        {/* Privacy */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Lock className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Privacy & Safety</span></div>
          <SettingRow label="Share location with family" desc="Family members can see your real-time location"><ToggleSwitch on={locationSharing} onChange={() => setLocationSharing(!locationSharing)} /></SettingRow>
          <SettingRow label="Auto crash detection" desc="Use accelerometer to detect accidents automatically"><ToggleSwitch on={autoDetect} onChange={() => setAutoDetect(!autoDetect)} /></SettingRow>
          <SettingRow label="SOS vibration feedback" desc="Vibrate device when SOS is activated"><ToggleSwitch on={sosVibrate} onChange={() => setSosVibrate(!sosVibrate)} /></SettingRow>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Bell className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Notifications</span></div>
          <SettingRow label="Push notifications" desc="Receive alerts via browser/app push"><ToggleSwitch on={pushNotifs} onChange={() => setPushNotifs(!pushNotifs)} /></SettingRow>
          <SettingRow label="SMS notifications" desc="Receive critical alerts via SMS"><ToggleSwitch on={smsNotifs} onChange={() => setSmsNotifs(!smsNotifs)} /></SettingRow>
        </motion.div>

        {/* Appearance */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Moon className="w-5 h-5 text-ll-text3" /><span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Appearance</span></div>
          <SettingRow label="Dark mode" desc="Toggle between dark and light theme">
            <ToggleSwitch on={mode === "dark"} onChange={toggleTheme} />
          </SettingRow>
        </motion.div>

        {/* Save */}
        <motion.div variants={item} className="flex justify-end">
          <motion.button whileTap={{ scale: 0.97 }} onClick={save}
            className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all ${saved ? "bg-gradient-to-br from-ll-green to-green-700 glow-green" : "bg-gradient-to-br from-ll-blue to-blue-700 glow-blue hover:-translate-y-0.5"}`}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
