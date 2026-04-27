"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Scan, Shield, Copy, Check } from "lucide-react";

/* QR Emergency Card — generates a scannable emergency profile */

const emergencyData = {
  name: "Arjun Mehta",
  bloodType: "O−",
  allergies: ["Penicillin", "Sulfa drugs"],
  conditions: ["Type 2 Diabetes"],
  medications: ["Metformin 500mg", "Atorvastatin 10mg"],
  emergencyContact: "Priya Mehta (Wife)",
  insuranceId: "SH-2024-98234",
  lifelineId: "LL-USR-2025-00482",
};

function QRPattern({ size = 160, color = "#ef4444" }: { size?: number; color?: string }) {
  // Generate a deterministic QR-like pattern
  const cells = 21;
  const cellSize = size / cells;
  const pattern: boolean[][] = [];

  for (let r = 0; r < cells; r++) {
    pattern[r] = [];
    for (let c = 0; c < cells; c++) {
      // Finder patterns (corners)
      const isFinderTL = r < 7 && c < 7;
      const isFinderTR = r < 7 && c >= cells - 7;
      const isFinderBL = r >= cells - 7 && c < 7;

      if (isFinderTL || isFinderTR || isFinderBL) {
        const lr = r % 7 >= (cells - 7) ? r - (cells - 7) : r;
        const lc = c >= (cells - 7) ? c - (cells - 7) : c;
        const rr = isFinderTL ? r : isFinderTR ? r : r - (cells - 7);
        const rc = isFinderTL ? c : isFinderTR ? c - (cells - 7) : c;
        pattern[r][c] =
          rr === 0 || rr === 6 || rc === 0 || rc === 6 ||
          (rr >= 2 && rr <= 4 && rc >= 2 && rc <= 4);
      } else {
        // Pseudo-random data based on position
        const hash = (r * 31 + c * 17 + 42) % 100;
        pattern[r][c] = hash < 45;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="transparent" />
      {pattern.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill={color}
              rx={1}
            />
          ) : null
        )
      )}
      {/* Center logo */}
      <rect
        x={size / 2 - 16}
        y={size / 2 - 16}
        width={32}
        height={32}
        fill="#070b11"
        rx={6}
      />
      <text
        x={size / 2}
        y={size / 2 + 5}
        textAnchor="middle"
        fill={color}
        fontSize={14}
        fontWeight="bold"
      >
        🛡
      </text>
    </svg>
  );
}

export function QREmergencyCard() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [copied, setCopied] = useState(false);

  async function simulateScan() {
    setScanning(true);
    setScanned(false);
    await new Promise((r) => setTimeout(r, 2000));
    setScanning(false);
    setScanned(true);
    setTimeout(() => setScanned(false), 8000);
  }

  function copyId() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* QR Display Card */}
      <motion.div
        className="bg-ll-surface border border-ll-border rounded-2xl p-6 text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <QrCode className="w-5 h-5 text-ll-red" />
          <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">
            Emergency QR Code
          </span>
        </div>

        <div className="relative inline-block mb-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-ll-border2">
            <QRPattern size={160} color="#ef4444" />
          </div>
          {scanning && (
            <motion.div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-ll-red to-transparent"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-0 border-2 border-ll-red/40 rounded-2xl" />
            </motion.div>
          )}
        </div>

        <p className="text-xs text-ll-text3 mb-4">
          First responders scan this to access your emergency medical profile
        </p>

        <div className="flex gap-2 justify-center">
          <motion.button
            onClick={simulateScan}
            disabled={scanning}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-br from-ll-red to-red-700 text-white glow-red disabled:opacity-60"
          >
            <Scan className="w-4 h-4" />
            {scanning ? "Scanning..." : "Simulate Scan"}
          </motion.button>
          <motion.button
            onClick={copyId}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-ll-surface2 border border-ll-border text-ll-text2 hover:border-ll-border2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-ll-green" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied!" : "Copy ID"}
          </motion.button>
        </div>
      </motion.div>

      {/* Scan Result */}
      {scanned && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          className="bg-gradient-to-r from-ll-green/5 to-transparent border border-ll-green/20 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-ll-green" />
            <span className="text-sm font-bold text-ll-green">Profile Decoded Successfully</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {[
              { label: "Name", value: emergencyData.name },
              { label: "Blood Type", value: emergencyData.bloodType, color: "text-ll-red" },
              { label: "Allergies", value: emergencyData.allergies.join(", "), color: "text-ll-amber" },
              { label: "Conditions", value: emergencyData.conditions.join(", ") },
              { label: "Medications", value: emergencyData.medications.join(", ") },
              { label: "Emergency Contact", value: emergencyData.emergencyContact },
              { label: "Insurance", value: emergencyData.insuranceId, color: "text-ll-blue" },
              { label: "LifeLine ID", value: emergencyData.lifelineId, color: "text-ll-green" },
            ].map((f) => (
              <div key={f.label} className="flex justify-between py-2 border-b border-ll-border last:border-0">
                <span className="text-xs text-ll-text3">{f.label}</span>
                <span className={`text-xs font-semibold ${f.color || ""}`}>{f.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
