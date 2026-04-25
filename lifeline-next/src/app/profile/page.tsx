"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Droplets, Pill, FileText, Phone, Building2, Shield } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

function InfoCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5 hover:border-ll-border2 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">{title}</span>
        <Icon className="w-5 h-5 text-ll-text3" />
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-ll-border last:border-0">
      <span className="text-sm text-ll-text2">{label}</span>
      <span className={`text-sm font-semibold ${color || ""}`}>{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [sharing, setSharing] = useState(false);
  const [shareSteps, setShareSteps] = useState<string[]>([]);
  const [shareDone, setShareDone] = useState(false);

  async function simulateShare() {
    setSharing(true); setShareSteps([]); setShareDone(false);
    const steps = ["🔐 Encrypting medical profile...","📍 GPS coordinates locked: 28.6139°N, 77.2090°E","🏥 Profile sent to AIIMS Emergency Ward","👨‍👩‍👧 Family contacts notified (Priya, Rahul)","📋 Insurance details forwarded","✅ All data received — Latency: 3.2s"];
    for (const s of steps) { await new Promise(r => setTimeout(r, 700)); setShareSteps(prev => [...prev, s]); }
    setShareDone(true);
    setTimeout(() => { setSharing(false); setShareSteps([]); setShareDone(false); }, 4000);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div className="flex items-start gap-5 mb-6 flex-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-ll-surface2 to-ll-surface3 border border-ll-border2 flex items-center justify-center text-3xl">👤</div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl font-extrabold tracking-tight">Arjun Mehta</h1>
          <p className="text-xs font-mono text-ll-text3 mb-2">LL-USR-2025-00482 · Last updated 2 days ago</p>
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-ll-green/10 text-ll-green border border-ll-green/25">✓ Verified</span>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-ll-red/10 text-ll-red border border-ll-red/25">O− Blood Type</span>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-ll-blue/10 text-ll-blue border border-ll-blue/25">Family: KMFG-7291</span>
          </div>
        </div>
      </motion.div>

      {/* Critical Alert */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-ll-red/6 to-transparent border border-ll-red/20 rounded-2xl p-5 mb-6">
        <div className="text-sm font-bold text-ll-red mb-3 flex items-center gap-2">⚠ Critical Medical Alerts</div>
        <div className="flex flex-wrap gap-2">
          {["💊 Penicillin Allergy","🩸 Rare Blood Type (O−)","📋 Diabetic — Metformin 500mg"].map(a => (
            <span key={a} className="bg-ll-red/10 border border-ll-red/25 rounded-lg px-3 py-2 text-sm font-semibold text-ll-red">{a}</span>
          ))}
        </div>
      </motion.div>

      {/* Cards Grid */}
      <motion.div className="grid sm:grid-cols-2 gap-4 mb-6" variants={container} initial="hidden" animate="show">
        <InfoCard title="Personal Info" icon={User}>
          <Field label="Full Name" value="Arjun Mehta" />
          <Field label="Age" value="32 years" />
          <Field label="Gender" value="Male" />
          <Field label="Weight" value="78 kg" />
          <Field label="Height" value="175 cm" />
        </InfoCard>
        <InfoCard title="Blood & Allergies" icon={Droplets}>
          <Field label="Blood Type" value="O Negative (O−)" color="text-ll-red" />
          <Field label="Allergy #1" value="Penicillin" color="text-ll-red" />
          <Field label="Allergy #2" value="Sulfa drugs" color="text-ll-amber" />
          <Field label="Organ Donor" value="Yes ✓" color="text-ll-green" />
        </InfoCard>
        <InfoCard title="Medications" icon={Pill}>
          <Field label="Metformin" value="500mg · 2x daily" />
          <Field label="Atorvastatin" value="10mg · 1x daily" />
          <Field label="Vitamin D3" value="60K IU · weekly" />
          <Field label="Last Rx Update" value="12 Apr 2025" color="text-ll-blue" />
        </InfoCard>
        <InfoCard title="Conditions" icon={FileText}>
          <Field label="Condition #1" value="Type 2 Diabetes" color="text-ll-amber" />
          <Field label="Condition #2" value="Mild Hyperlipidemia" />
          <Field label="Past Surgery" value="Appendectomy (2019)" />
          <Field label="COVID Vaccinated" value="3 doses ✓" color="text-ll-green" />
        </InfoCard>

        <motion.div variants={item} className="sm:col-span-2 bg-ll-surface border border-ll-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Emergency Contacts</span>
            <Phone className="w-5 h-5 text-ll-text3" />
          </div>
          {[{ name: "Priya Mehta", rel: "Wife · Primary", color: "bg-ll-blue/10 text-ll-blue" },
            { name: "Rahul Mehta", rel: "Brother · Secondary", color: "bg-ll-green/10 text-ll-green" },
            { name: "Dr. Shalini Kapoor", rel: "Primary Physician", color: "bg-ll-red/10 text-ll-red" }].map(c => (
            <div key={c.name} className="flex items-center gap-3 py-3 border-b border-ll-border last:border-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${c.color}`}>{c.name.split(" ").map(w=>w[0]).join("")}</div>
              <div className="flex-1"><div className="text-sm font-semibold">{c.name}</div><div className="text-[11px] text-ll-text3">{c.rel}</div></div>
              <span className="text-xs font-mono text-ll-text3">+91 XXXXX</span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={item} className="sm:col-span-2 bg-ll-surface border border-ll-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Insurance & ID</span>
            <Building2 className="w-5 h-5 text-ll-text3" />
          </div>
          <div className="grid sm:grid-cols-2">
            <Field label="Provider" value="Star Health" />
            <Field label="Policy" value="SH-2024-98234" color="text-ll-blue" />
            <Field label="Coverage" value="₹10L Active ✓" color="text-ll-green" />
            <Field label="Aadhar" value="Verified ✓" color="text-ll-green" />
          </div>
        </motion.div>
      </motion.div>

      {/* Emergency Share */}
      <div className="bg-ll-surface border border-ll-border rounded-2xl p-6 text-center">
        <h3 className="text-base font-bold mb-1">Simulate Emergency Share</h3>
        <p className="text-xs text-ll-text2 mb-5">Simulates hospital data transmission during an SOS event</p>
        <motion.button onClick={simulateShare} disabled={sharing} whileTap={{ scale: 0.97 }}
          className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 ${
            shareDone ? "bg-gradient-to-br from-ll-green to-green-700 glow-green" : "bg-gradient-to-br from-ll-red to-red-700 glow-red hover:-translate-y-0.5"
          }`}>
          {shareDone ? "✅ Complete" : sharing ? "⏳ Transmitting..." : "🚨 Simulate Emergency Transmission"}
        </motion.button>
        <div className="mt-4 space-y-1.5 min-h-[20px]">
          {shareSteps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-ll-text2">{s}</motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
