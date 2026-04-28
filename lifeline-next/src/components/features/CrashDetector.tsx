"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Gauge, AlertTriangle, Shield, Activity } from "lucide-react";
import toast from "react-hot-toast";

interface CrashDetectorProps {
  sensitivity?: "low" | "medium" | "high";
  enabled?: boolean;
  onCrashDetected?: (gForce: number) => void;
}

const SENSITIVITY_THRESHOLDS = {
  low: 4.0,
  medium: 3.0,
  high: 2.0,
};

export function CrashDetector({ sensitivity = "medium", enabled = true, onCrashDetected }: CrashDetectorProps) {
  const [gForce, setGForce] = useState(1.0);
  const [maxG, setMaxG] = useState(1.0);
  const [crashDetected, setCrashDetected] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [history, setHistory] = useState<number[]>(Array(30).fill(1));
  const threshold = SENSITIVITY_THRESHOLDS[sensitivity];

  // Simulate accelerometer data for demo
  useEffect(() => {
    if (!enabled || !monitoring) return;

    const interval = setInterval(() => {
      // Simulate G-force with occasional spikes
      const baseG = 1.0 + Math.random() * 0.3;
      const spike = Math.random() > 0.97 ? 2 + Math.random() * 3 : 0;
      const currentG = baseG + spike;

      setGForce(currentG);
      setMaxG(prev => Math.max(prev, currentG));
      setHistory(prev => [...prev.slice(1), currentG]);

      if (currentG > threshold && !crashDetected) {
        setCrashDetected(true);
        onCrashDetected?.(currentG);
        toast.error(`⚠️ Crash detected! G-force: ${currentG.toFixed(1)}G`, { duration: 5000 });
        setTimeout(() => setCrashDetected(false), 8000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [enabled, monitoring, threshold, crashDetected, onCrashDetected]);

  const maxHistoryG = Math.max(...history, 2);

  return (
    <div className={`bg-ll-surface border rounded-2xl p-5 transition-colors ${
      crashDetected ? "border-ll-red/40 glow-red" : "border-ll-border"
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-ll-cyan" />
          <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Crash Detector</span>
        </div>
        <button
          onClick={() => setMonitoring(!monitoring)}
          className={`text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all ${
            monitoring ? "bg-ll-green/10 text-ll-green border border-ll-green/25" : "bg-ll-surface2 text-ll-text3 border border-ll-border"
          }`}
        >
          {monitoring ? "● Monitoring" : "Start"}
        </button>
      </div>

      {/* G-Force display */}
      <div className="flex items-center gap-6 mb-4">
        <div className="text-center">
          <motion.div
            className={`text-4xl font-black font-mono ${
              gForce > threshold ? "text-ll-red" : gForce > threshold * 0.7 ? "text-ll-amber" : "text-ll-green"
            }`}
            animate={{ scale: crashDetected ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {gForce.toFixed(1)}
          </motion.div>
          <div className="text-[10px] text-ll-text3 uppercase tracking-wider">G-Force</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-ll-amber">{maxG.toFixed(1)}</div>
          <div className="text-[10px] text-ll-text3 uppercase tracking-wider">Peak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-ll-text2">{threshold.toFixed(1)}</div>
          <div className="text-[10px] text-ll-text3 uppercase tracking-wider">Threshold</div>
        </div>
      </div>

      {/* Accelerometer graph */}
      <div className="h-16 flex items-end gap-px mb-3">
        {history.map((g, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm transition-all ${
              g > threshold ? "bg-ll-red" : g > threshold * 0.7 ? "bg-ll-amber/60" : "bg-ll-green/40"
            }`}
            style={{ height: `${Math.min((g / maxHistoryG) * 100, 100)}%` }}
          />
        ))}
      </div>

      {/* Status */}
      {crashDetected ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ll-red/10 border border-ll-red/20 rounded-xl p-3 flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-ll-red animate-pulse" />
          <span className="text-xs font-bold text-ll-red">Impact detected! Sending SOS in 10s...</span>
        </motion.div>
      ) : monitoring ? (
        <div className="flex items-center gap-2 text-xs text-ll-text3">
          <Shield className="w-3 h-3 text-ll-green" />
          <span>Monitoring active · Sensitivity: <strong className="capitalize">{sensitivity}</strong></span>
        </div>
      ) : (
        <div className="text-xs text-ll-text4">
          Start monitoring to detect crashes via accelerometer
        </div>
      )}
    </div>
  );
}
