"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Activity, Users, Bed, Heart, AlertTriangle, Clock, TrendingUp, Ambulance, Phone } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import axios from "axios";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

interface HospitalData {
  id: string; name: string; totalBeds: number; availableBeds: number;
  icuBeds: number; icuAvailable: number; hasTraumaCenter: boolean;
  emergencyReady: boolean; rating: number;
}

const incomingAlerts = [
  { id: "SOS-001", type: "🚗 Accident", severity: "critical", location: "2.3 km away", time: "Just now", eta: "4 min", patient: "Male, ~35yrs" },
  { id: "SOS-002", type: "🏥 Medical", severity: "moderate", location: "5.1 km away", time: "3 min ago", eta: "12 min", patient: "Female, ~60yrs" },
  { id: "SOS-003", type: "🔥 Burns", severity: "critical", location: "1.8 km away", time: "5 min ago", eta: "6 min", patient: "Child, ~10yrs" },
];

const ambulanceFleet = [
  { id: "AMB-01", status: "available", driver: "Rajesh K.", vehicleNo: "DL-01-AB-1234" },
  { id: "AMB-02", status: "dispatched", driver: "Suresh P.", vehicleNo: "DL-01-CD-5678", eta: "4 min" },
  { id: "AMB-03", status: "en_route", driver: "Vikram S.", vehicleNo: "DL-01-EF-9012", eta: "8 min" },
  { id: "AMB-04", status: "returning", driver: "Amit R.", vehicleNo: "DL-01-GH-3456" },
];

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState<HospitalData | null>(null);

  useEffect(() => {
    axios.get("/api/hospitals/nearby").then(res => {
      if (res.data.success && res.data.data.length > 0) {
        setHospital(res.data.data[0]);
      }
    }).catch(() => {
      setHospital({
        id: "h1", name: "AIIMS Delhi", totalBeds: 2478, availableBeds: 45,
        icuBeds: 120, icuAvailable: 8, hasTraumaCenter: true, emergencyReady: true, rating: 4.8,
      });
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Building2 className="w-7 h-7 text-ll-blue" />
            Hospital Dashboard
          </h1>
          <p className="text-sm text-ll-text2 mt-1">{hospital?.name || "Loading..."} · Emergency Operations Center</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="green" dot>ER Active</Badge>
          <Badge variant="blue">Trauma Ready</Badge>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Available Beds", value: hospital?.availableBeds || 45, total: hospital?.totalBeds || 2478, icon: Bed, color: "text-ll-green" },
            { label: "ICU Available", value: hospital?.icuAvailable || 8, total: hospital?.icuBeds || 120, icon: Heart, color: "text-ll-red" },
            { label: "Incoming SOS", value: 3, icon: AlertTriangle, color: "text-ll-amber" },
            { label: "Avg Response", value: 4.2, icon: Clock, color: "text-ll-blue", suffix: "m", decimals: 1 },
          ].map(s => (
            <div key={s.label} className="bg-ll-surface border border-ll-border rounded-2xl p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                {"total" in s && <span className="text-[10px] text-ll-text3 font-mono">/{s.total}</span>}
              </div>
              <div className={`text-3xl font-black font-mono tracking-tight ${s.color}`}>
                <AnimatedNumber target={s.value} suffix={s.suffix || ""} decimals={s.decimals || 0} />
              </div>
              <div className="text-[11px] text-ll-text3 mt-1 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Incoming Alerts */}
          <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ll-border flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ll-red animate-pulse-dot" />
              <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Incoming Emergencies</span>
            </div>
            {incomingAlerts.map((alert, i) => (
              <motion.div key={alert.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="px-5 py-4 border-b border-ll-border last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{alert.type}</span>
                    <Badge variant={alert.severity === "critical" ? "red" : "amber"}>{alert.severity}</Badge>
                  </div>
                  <span className="text-[10px] text-ll-text3 font-mono">{alert.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-ll-text2">
                  <span>{alert.patient} · {alert.location}</span>
                  <span className="font-bold text-ll-blue">ETA: {alert.eta}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 rounded-lg bg-ll-green/10 text-ll-green text-xs font-semibold border border-ll-green/20 hover:bg-ll-green/20 transition-colors">
                    Accept
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-ll-surface2 text-ll-text3 text-xs font-semibold border border-ll-border hover:bg-ll-surface3 transition-colors">
                    Redirect
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Ambulance Fleet */}
          <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ll-border flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-ll-blue" />
              <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Ambulance Fleet</span>
            </div>
            {ambulanceFleet.map((amb, i) => {
              const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
                available: { color: "text-ll-green", bg: "bg-ll-green/10", label: "Available" },
                dispatched: { color: "text-ll-amber", bg: "bg-ll-amber/10", label: "Dispatched" },
                en_route: { color: "text-ll-blue", bg: "bg-ll-blue/10", label: "En Route" },
                returning: { color: "text-ll-purple", bg: "bg-ll-purple/10", label: "Returning" },
              };
              const sc = statusConfig[amb.status];
              return (
                <motion.div key={amb.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="px-5 py-3.5 border-b border-ll-border last:border-0 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-ll-blue/10 flex items-center justify-center">
                      <Ambulance className="w-4 h-4 text-ll-blue" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{amb.id} · {amb.driver}</div>
                      <div className="text-xs text-ll-text3 font-mono">{amb.vehicleNo}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    {amb.eta && <div className="text-[10px] text-ll-text3 mt-1">ETA: {amb.eta}</div>}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bed Utilization */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-ll-cyan" />
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Bed Utilization</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "General Ward", used: 420, total: 500, color: "bg-ll-green" },
              { label: "ICU", used: 112, total: 120, color: "bg-ll-red" },
              { label: "Emergency", used: 28, total: 40, color: "bg-ll-amber" },
              { label: "Pediatric", used: 35, total: 50, color: "bg-ll-blue" },
            ].map(ward => {
              const pct = Math.round((ward.used / ward.total) * 100);
              return (
                <div key={ward.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ll-text3">{ward.label}</span>
                    <span className="font-mono font-bold">{pct}%</span>
                  </div>
                  <div className="h-2 bg-ll-bg rounded-full overflow-hidden">
                    <motion.div className={`h-full rounded-full ${ward.color}`}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                    />
                  </div>
                  <div className="text-[10px] text-ll-text4 mt-1">{ward.used}/{ward.total} beds</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
