"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Users, Activity, AlertTriangle, Building2, Heart,
  TrendingUp, Clock, CheckCircle, XCircle, Eye, Ban,
  BarChart3, Server, Database, Wifi,
} from "lucide-react";

const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

// Demo data
const platformStats = [
  { label: "Total Users", value: "12,847", icon: Users, color: "text-ll-blue", bg: "bg-ll-blue/10", change: "+124 today" },
  { label: "Active Emergencies", value: "23", icon: AlertTriangle, color: "text-ll-red", bg: "bg-ll-red/10", change: "3 critical" },
  { label: "Hospitals Connected", value: "156", icon: Building2, color: "text-ll-green", bg: "bg-ll-green/10", change: "All online" },
  { label: "Fundraisers Active", value: "34", icon: Heart, color: "text-ll-purple", bg: "bg-ll-purple/10", change: "₹12.4L raised" },
  { label: "Avg Response Time", value: "3.8m", icon: Clock, color: "text-ll-amber", bg: "bg-ll-amber/10", change: "-18% vs last week" },
  { label: "System Uptime", value: "99.97%", icon: Server, color: "text-ll-green", bg: "bg-ll-green/10", change: "30d streak" },
];

const recentUsers = [
  { id: "u1", name: "Arjun Mehta", email: "arjun@email.com", role: "USER", status: "active", joined: "2025-01-15", emergencies: 2 },
  { id: "u2", name: "Priya Sharma", email: "priya@hospital.com", role: "HOSPITAL", status: "active", joined: "2025-02-10", emergencies: 0 },
  { id: "u3", name: "Raj Kumar", email: "raj@email.com", role: "USER", status: "active", joined: "2025-03-05", emergencies: 1 },
  { id: "u4", name: "Dr. Neha Singh", email: "neha@hospital.com", role: "HOSPITAL", status: "active", joined: "2025-03-12", emergencies: 0 },
  { id: "u5", name: "Vikram Patel", email: "vikram@email.com", role: "USER", status: "suspended", joined: "2025-04-01", emergencies: 5 },
  { id: "u6", name: "Anita Desai", email: "anita@admin.com", role: "ADMIN", status: "active", joined: "2024-12-01", emergencies: 0 },
];

const systemHealth = [
  { name: "API Server", status: "healthy", latency: "12ms", icon: Server },
  { name: "Database", status: "healthy", latency: "3ms", icon: Database },
  { name: "WebSocket", status: "healthy", latency: "8ms", icon: Wifi },
  { name: "AI Triage", status: "degraded", latency: "450ms", icon: BarChart3 },
];

const pendingVerifications = [
  { id: "fr1", title: "Flood Relief — Assam 2025", creator: "LifeLine Foundation", amount: "₹5,00,000", docs: true },
  { id: "fr2", title: "Burns Treatment — Rohit", creator: "Dr. Priya Sharma", amount: "₹2,00,000", docs: true },
  { id: "fr3", title: "School Rebuild — Bihar", creator: "Unknown User", amount: "₹8,00,000", docs: false },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "emergencies" | "system">("overview");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-purple to-purple-700 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Admin Panel</h1>
            <p className="text-xs text-ll-text3">Platform Management & Monitoring</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-ll-surface border border-ll-border rounded-xl p-1">
        {(["overview", "users", "emergencies", "system"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab ? "bg-ll-red/15 text-ll-red" : "text-ll-text3 hover:text-ll-text hover:bg-white/5"
            }`}>{tab}</button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "emergencies" && <EmergenciesTab />}
      {activeTab === "system" && <SystemTab />}
    </div>
  );
}

function OverviewTab() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {platformStats.map((s) => (
          <div key={s.label} className="bg-ll-surface border border-ll-border rounded-2xl p-4 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <span className="text-[10px] text-ll-text3 font-semibold">{s.change}</span>
            </div>
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-ll-text3 mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Pending Verifications */}
      <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ll-border flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">Pending Verifications</span>
          <span className="text-[10px] bg-ll-amber/10 text-ll-amber px-2 py-0.5 rounded-full font-semibold">{pendingVerifications.length} pending</span>
        </div>
        {pendingVerifications.map((v) => (
          <div key={v.id} className="px-5 py-3.5 border-b border-ll-border last:border-0 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{v.title}</div>
              <div className="text-xs text-ll-text3">{v.creator} · {v.amount}</div>
            </div>
            <div className="flex items-center gap-2">
              {!v.docs && <span className="text-[10px] text-ll-red bg-ll-red/10 px-2 py-0.5 rounded-full">No docs</span>}
              <button className="p-1.5 rounded-lg bg-ll-green/10 text-ll-green hover:bg-ll-green/20 transition"><CheckCircle className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-lg bg-ll-red/10 text-ll-red hover:bg-ll-red/20 transition"><XCircle className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Activity Chart Placeholder */}
      <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-5">
        <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-4">Emergency Activity (7 Days)</div>
        <div className="flex items-end gap-1.5 h-32">
          {[35, 28, 42, 18, 55, 38, 23].map((v, i) => (
            <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${(v / 55) * 100}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex-1 bg-gradient-to-t from-ll-red/40 to-ll-red/10 rounded-t-lg relative group cursor-pointer hover:from-ll-red/60">
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-ll-text3 opacity-0 group-hover:opacity-100 transition">{v}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-ll-text4 font-mono">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
        </div>
      </motion.div>
    </motion.div>
  );
}

function UsersTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ll-border flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">User Management</span>
          <span className="text-[10px] text-ll-blue font-semibold">{recentUsers.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-ll-border text-[10px] uppercase tracking-wider text-ll-text4">
              <th className="text-left px-5 py-2.5">User</th>
              <th className="text-left px-3 py-2.5">Role</th>
              <th className="text-left px-3 py-2.5">Status</th>
              <th className="text-left px-3 py-2.5">Joined</th>
              <th className="text-right px-5 py-2.5">Actions</th>
            </tr></thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.id} className="border-b border-ll-border last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-ll-text3">{u.email}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      u.role === "ADMIN" ? "bg-ll-purple/10 text-ll-purple" :
                      u.role === "HOSPITAL" ? "bg-ll-green/10 text-ll-green" :
                      "bg-ll-blue/10 text-ll-blue"
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] font-semibold ${u.status === "active" ? "text-ll-green" : "text-ll-red"}`}>
                      {u.status === "active" ? "● " : "○ "}{u.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-ll-text3 font-mono">{u.joined}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-ll-text3"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-white/5 text-ll-text3"><Ban className="w-3.5 h-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function EmergenciesTab() {
  const [emergencies, setEmergencies] = useState<Array<{id:string;title:string;type:string;severity:string;status:string;location:string;time:string}>>([]);

  useEffect(() => {
    fetch("/api/feed").then(r => r.json()).then(d => { if (d.success) setEmergencies(d.data); }).catch(() => {});
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Active", count: emergencies.filter(e => e.status === "active").length, color: "text-ll-amber" },
          { label: "Responding", count: emergencies.filter(e => e.status === "responding").length, color: "text-ll-red" },
          { label: "Resolved", count: emergencies.filter(e => e.status === "resolved").length, color: "text-ll-green" },
        ].map(s => (
          <div key={s.label} className="bg-ll-surface border border-ll-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.count}</div>
            <div className="text-[10px] text-ll-text3 uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ll-border">
          <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">All Emergencies (from DB)</span>
        </div>
        {emergencies.map((e) => (
          <div key={e.id} className="px-5 py-3 border-b border-ll-border last:border-0 flex items-center justify-between hover:bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${e.severity === "critical" ? "bg-ll-red" : e.severity === "moderate" ? "bg-ll-amber" : "bg-ll-green"}`} />
              <div>
                <div className="text-sm font-semibold">{e.title}</div>
                <div className="text-xs text-ll-text3 font-mono">{e.id} · {e.time} · {e.location}</div>
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase ${
              e.status === "responding" ? "bg-ll-red/10 text-ll-red" :
              e.status === "active" ? "bg-ll-amber/10 text-ll-amber" : "bg-ll-green/10 text-ll-green"
            }`}>{e.status}</span>
          </div>
        ))}
        {emergencies.length === 0 && <div className="px-5 py-8 text-center text-sm text-ll-text3">Loading emergencies from database...</div>}
      </div>
    </motion.div>
  );
}

function SystemTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="bg-ll-surface border border-ll-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ll-border">
          <span className="text-xs font-mono uppercase tracking-widest text-ll-text3">System Health</span>
        </div>
        {systemHealth.map((s) => (
          <div key={s.name} className="px-5 py-4 border-b border-ll-border last:border-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <s.icon className="w-5 h-5 text-ll-text3" />
              <div>
                <div className="text-sm font-semibold">{s.name}</div>
                <div className="text-xs text-ll-text3">Latency: {s.latency}</div>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
              s.status === "healthy" ? "bg-ll-green/10 text-ll-green" : "bg-ll-amber/10 text-ll-amber"
            }`}>{s.status}</span>
          </div>
        ))}
      </div>
      <div className="bg-ll-surface border border-ll-border rounded-2xl p-5">
        <div className="text-xs font-mono uppercase tracking-widest text-ll-text3 mb-3">Database Info</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Engine", "SQLite (aiosqlite)"],
            ["Tables", "11"],
            ["Backend", "FastAPI 0.136"],
            ["Frontend", "Next.js 16.2"],
            ["Auth", "JWT (HS256)"],
            ["Status", "Connected"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-xs">
              <span className="text-ll-text3">{k}</span>
              <span className="font-mono font-semibold text-ll-green">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
