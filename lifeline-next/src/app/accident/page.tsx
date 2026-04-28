"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CrashDetector } from "@/components/features/CrashDetector";
import { VoiceSOS } from "@/components/features/VoiceSOS";
import { AITriage } from "@/components/features/AITriage";

const stages = [
  { id: 0, label: "Normal", color: "bg-ll-green", phone: "🚗 Driving Mode Active", log: ["GPS: 28.6139°N, 77.2090°E", "Speed: 45 km/h", "Accelerometer: Normal", "Gyroscope: Stable"], desc: "All sensors nominal. Real-time telemetry streaming." },
  { id: 1, label: "Impact", color: "bg-ll-red", phone: "💥 IMPACT DETECTED!", log: ["⚠️ COLLISION EVENT DETECTED", "Accel: 47.2g (threshold: 4g)", "Gyro: 312°/s (threshold: 150°/s)", "Airbag signal: DEPLOYED", "Speed delta: 45→0 km/h in 0.3s"], desc: "Sensors detected severe deceleration pattern consistent with collision." },
  { id: 2, label: "Timer", color: "bg-ll-amber", phone: "⏱ 10s SAFETY TIMER", log: ["Starting 10-second safety countdown", "Vibrating device continuously", "Playing emergency tone", "Awaiting user cancellation...", "User unresponsive — preparing auto-SOS"], desc: "Safety timer allows conscious user to cancel false alarm." },
  { id: 3, label: "SOS Sent", color: "bg-ll-red", phone: "🚨 SOS TRANSMITTED", log: ["AUTO-SOS TRIGGERED", "📍 GPS: 28.6139°N, 77.2090°E", "🩸 Blood Type: O− (critical)", "💊 Allergy: Penicillin", "📲 Notifying family contacts...", "📡 Broadcasting to hospitals..."], desc: "Emergency packet transmitted with medical profile and GPS." },
  { id: 4, label: "Notified", color: "bg-ll-blue", phone: "📡 CONTACTS ALERTED", log: ["✅ FCM Push → Priya Mehta (wife)", "✅ FCM Push → Rahul Mehta (brother)", "✅ SMS → Dr. Shalini Kapoor", "✅ Hospital: AIIMS Emergency Ward", "✅ Hospital: Safdarjung Trauma", "⏱ Avg notification latency: 1.2s"], desc: "Multi-channel notification delivery complete." },
  { id: 5, label: "Dispatched", color: "bg-ll-green", phone: "🚑 AMBULANCE EN ROUTE", log: ["✅ AMB-204 assigned from AIIMS", "👤 Paramedic: Dr. Anil Kumar", "📍 Distance: 2.1 km", "⏱ ETA: 4 minutes", "🏥 ICU bed reserved: Ward 7B", "🩸 O− blood unit prepared"], desc: "Nearest ambulance dispatched. Hospital is preparing for arrival." },
];

const recipients = [
  { name: "Priya Mehta", relation: "Wife", method: "FCM Push" },
  { name: "Rahul Mehta", relation: "Brother", method: "FCM Push" },
  { name: "Dr. Shalini", relation: "Physician", method: "SMS" },
  { name: "AIIMS ER", relation: "Hospital", method: "WebSocket" },
];

export default function AccidentPage() {
  const [step, setStep] = useState(0);
  const [timerVal, setTimerVal] = useState(10);
  const [autoPlay, setAutoPlay] = useState(false);
  const stage = stages[step];

  useEffect(() => {
    if (step === 2) {
      setTimerVal(10);
      const t = setInterval(() => setTimerVal((v) => (v <= 1 ? (clearInterval(t), 0) : v - 1)), 800);
      return () => clearInterval(t);
    }
  }, [step]);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      if (step < stages.length - 1) setStep(s => s + 1);
      else { setAutoPlay(false); setStep(0); }
    }, step === 2 ? 4000 : 2500);
    return () => clearTimeout(timer);
  }, [autoPlay, step]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <motion.h1 className="text-3xl font-extrabold tracking-tight" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          🚗 Accident Detection & AI Safety
        </motion.h1>
        <button onClick={() => { setAutoPlay(!autoPlay); if (!autoPlay) setStep(0); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${autoPlay ? "bg-ll-red/10 border-ll-red/25 text-ll-red" : "bg-ll-surface border-ll-border text-ll-text2 hover:border-ll-border2"}`}>
          {autoPlay ? <><Pause className="w-3.5 h-3.5" /> Stop Auto-Play</> : <><Play className="w-3.5 h-3.5" /> Auto-Play Demo</>}
        </button>
      </div>
      <p className="text-sm text-ll-text2 mb-6">Step-by-step crash detection walkthrough + live AI safety tools.</p>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-8">
        {stages.map((s, i) => (
          <button key={i} onClick={() => { setStep(i); setAutoPlay(false); }} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className={`w-full h-1.5 rounded-full transition-all ${i <= step ? stage.color : "bg-ll-surface2"}`} />
            <span className={`text-[10px] font-semibold transition-colors hidden sm:block ${i <= step ? "text-ll-text" : "text-ll-text4"}`}>{s.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Phone Mockup */}
            <div className="flex justify-center">
              <motion.div className="w-64 bg-ll-surface rounded-[2rem] border-2 border-ll-border2 p-2 relative"
                animate={step === 1 ? { x: [-3, 3, -3, 3, 0], transition: { duration: 0.4, repeat: 2 } } : {}}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
                <div className={`rounded-[1.5rem] min-h-[420px] flex flex-col items-center justify-center p-6 text-center transition-colors ${
                  step === 1 ? "bg-gradient-to-b from-red-900/30 to-ll-bg" : step === 2 ? "bg-gradient-to-b from-amber-900/20 to-ll-bg" : step === 5 ? "bg-gradient-to-b from-green-900/20 to-ll-bg" : "bg-ll-bg"
                }`}>
                  <motion.div className="text-4xl mb-4" animate={step === 1 ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.5, repeat: step === 1 ? 3 : 0 }}>
                    {step === 0 ? "🚗" : step === 1 ? "💥" : step === 2 ? "⏱" : step === 3 ? "🚨" : step === 4 ? "📡" : "🚑"}
                  </motion.div>
                  <div className="text-lg font-bold mb-2">{stage.phone}</div>
                  {step === 2 && (
                    <div className="relative w-20 h-20 my-3">
                      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth="4" />
                        <circle cx="40" cy="40" r="35" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 35} strokeDashoffset={2 * Math.PI * 35 * (1 - timerVal / 10)} className="transition-all duration-700" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-ll-amber font-mono">{timerVal}</span>
                    </div>
                  )}
                  {(step === 1 || step === 3) && (
                    <motion.div className="absolute inset-2 rounded-[1.5rem] border-2 border-ll-red/40 pointer-events-none"
                      animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
                  )}
                  <p className="text-xs text-ll-text3 mt-2">{stage.desc}</p>
                </div>
              </motion.div>
            </div>

            {/* System Log + Recipients */}
            <div className="space-y-4">
              <div className="bg-ll-surface border border-ll-border rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 border-b border-ll-border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-ll-green animate-pulse-dot" />
                  <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">System Log</span>
                  <Badge variant={step <= 1 ? "green" : step <= 3 ? "red" : "blue"} className="ml-auto text-[9px]">
                    Step {step + 1}/{stages.length}
                  </Badge>
                </div>
                <div className="p-4 font-mono text-xs space-y-1.5">
                  {stage.log.map((line, i) => (
                    <motion.div key={`${step}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                      className={`${line.startsWith("⚠") || line.startsWith("AUTO") ? "text-ll-red" : line.startsWith("✅") ? "text-ll-green" : "text-ll-text2"}`}>
                      <span className="text-ll-text4 mr-2">{String(i + 1).padStart(2, "0")}</span>{line}
                    </motion.div>
                  ))}
                </div>
              </div>

              {step >= 4 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-ll-surface border border-ll-border rounded-xl p-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-3">Alert Recipients</div>
                  {recipients.map((r) => (
                    <div key={r.name} className="flex items-center justify-between py-2 border-b border-ll-border last:border-0">
                      <div><div className="text-sm font-semibold">{r.name}</div><div className="text-[10px] text-ll-text3">{r.relation} · {r.method}</div></div>
                      <Badge variant="green" className="text-[9px]">✓ Sent</Badge>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 mb-10">
        <button onClick={() => { setStep(Math.max(0, step - 1)); setAutoPlay(false); }} disabled={step === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ll-surface border border-ll-border text-sm font-semibold disabled:opacity-30 hover:bg-ll-surface2 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-xs font-mono text-ll-text3">Step {step + 1} / {stages.length}</span>
        <button onClick={() => { setStep(Math.min(stages.length - 1, step + 1)); setAutoPlay(false); }} disabled={step === stages.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-ll-surface border border-ll-border text-sm font-semibold disabled:opacity-30 hover:bg-ll-surface2 transition-colors">
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* AI Safety Tools */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-extrabold mb-1">🧠 AI Safety Tools</h2>
        <p className="text-sm text-ll-text2 mb-6">Live AI-powered safety features running alongside crash detection.</p>

        <div className="grid md:grid-cols-2 gap-5">
          <CrashDetector sensitivity="medium" enabled />
          <VoiceSOS />
        </div>

        <div className="mt-5">
          <AITriage />
        </div>
      </motion.div>
    </div>
  );
}
