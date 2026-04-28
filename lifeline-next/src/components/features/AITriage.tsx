"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, AlertTriangle, Heart, Stethoscope, Thermometer } from "lucide-react";

interface TriageResult {
  severity: "critical" | "moderate" | "low";
  recommendation: string;
  actions: string[];
  callEmergency: boolean;
  confidence: number;
}

const DEMO_RESPONSES: Record<string, TriageResult> = {
  "chest pain": {
    severity: "critical",
    recommendation: "Possible cardiac event. Call emergency services immediately.",
    actions: ["Call 112 immediately", "Chew an aspirin if available", "Sit upright, loosen clothing", "Do not exert yourself", "If unconscious, begin CPR"],
    callEmergency: true,
    confidence: 0.92,
  },
  "headache": {
    severity: "low",
    recommendation: "Likely tension headache. Monitor symptoms.",
    actions: ["Rest in a quiet, dark room", "Take over-the-counter pain relief", "Stay hydrated", "If severe or sudden onset, seek medical help"],
    callEmergency: false,
    confidence: 0.85,
  },
  "breathing": {
    severity: "critical",
    recommendation: "Respiratory distress requires immediate attention.",
    actions: ["Call 112 immediately", "Sit upright", "Use inhaler if available", "Loosen tight clothing", "Open windows for fresh air"],
    callEmergency: true,
    confidence: 0.89,
  },
  "bleeding": {
    severity: "moderate",
    recommendation: "Apply direct pressure to the wound.",
    actions: ["Apply firm pressure with clean cloth", "Elevate the wound above heart level", "Do not remove embedded objects", "Seek medical help if bleeding doesn't stop in 10 min"],
    callEmergency: false,
    confidence: 0.88,
  },
  default: {
    severity: "moderate",
    recommendation: "Based on symptoms, monitoring is recommended. Seek medical advice if symptoms worsen.",
    actions: ["Monitor symptoms closely", "Stay calm and comfortable", "Keep a log of symptoms", "Contact your doctor if condition worsens"],
    callEmergency: false,
    confidence: 0.75,
  },
};

export function AITriage() {
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  async function analyze() {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    // Simulate AI processing
    await new Promise(r => setTimeout(r, 1500));

    const lowerInput = input.toLowerCase();
    const matchedKey = Object.keys(DEMO_RESPONSES).find(key => lowerInput.includes(key));
    setResult(DEMO_RESPONSES[matchedKey || "default"]);
    setAnalyzing(false);
  }

  const severityConfig = {
    critical: { color: "text-ll-red", bg: "bg-ll-red/10", border: "border-ll-red/20", icon: AlertTriangle, label: "Critical" },
    moderate: { color: "text-ll-amber", bg: "bg-ll-amber/10", border: "border-ll-amber/20", icon: Thermometer, label: "Moderate" },
    low: { color: "text-ll-green", bg: "bg-ll-green/10", border: "border-ll-green/20", icon: Heart, label: "Low Risk" },
  };

  return (
    <div className="bg-ll-surface border border-ll-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-ll-cyan" />
        <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">AI Triage</span>
        <span className="ml-auto text-[9px] font-mono text-ll-text4 bg-ll-surface2 px-2 py-0.5 rounded-full">GPT-4 Powered</span>
      </div>

      {/* Input */}
      <div className="relative mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe symptoms... e.g. 'chest pain and difficulty breathing'"
          rows={3}
          className="w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-ll-cyan/50 transition-colors placeholder:text-ll-text4"
        />
        <motion.button
          onClick={analyze}
          whileTap={{ scale: 0.95 }}
          disabled={analyzing || !input.trim()}
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-gradient-to-br from-ll-cyan to-cyan-700 text-white disabled:opacity-40 transition-all"
        >
          {analyzing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Analyzing state */}
      {analyzing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 py-4">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-2 h-2 rounded-full bg-ll-cyan"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <span className="text-xs text-ll-text3">Analyzing symptoms with AI...</span>
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            {/* Severity badge */}
            <div className={`${severityConfig[result.severity].bg} ${severityConfig[result.severity].border} border rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                {(() => { const Icon = severityConfig[result.severity].icon; return <Icon className={`w-5 h-5 ${severityConfig[result.severity].color}`} />; })()}
                <span className={`text-sm font-bold ${severityConfig[result.severity].color}`}>
                  {severityConfig[result.severity].label}
                </span>
                <span className="ml-auto text-[10px] text-ll-text3 font-mono">
                  {(result.confidence * 100).toFixed(0)}% confidence
                </span>
              </div>
              <p className="text-sm text-ll-text2">{result.recommendation}</p>
            </div>

            {/* Actions */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-ll-text3 uppercase tracking-wider">Recommended Actions</div>
              {result.actions.map((action, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-ll-cyan mt-0.5">•</span>
                  <span className="text-ll-text2">{action}</span>
                </div>
              ))}
            </div>

            {result.callEmergency && (
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-gradient-to-br from-ll-red to-red-700 text-white font-bold text-sm glow-red flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                Call Emergency Services (112)
              </motion.button>
            )}

            <p className="text-[10px] text-ll-text4 text-center">
              ⚠ AI triage is for guidance only. Always consult a medical professional.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
