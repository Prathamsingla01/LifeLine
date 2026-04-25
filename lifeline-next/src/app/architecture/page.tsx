"use client";
import { motion } from "framer-motion";
import { ArrowRight, Database, Server, Smartphone, Bell, Building2, Lock } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const flowSteps = [
  { icon: "📱", title: "Mobile App", sub: "Crash detected / SOS", border: "border-ll-red/30" },
  { icon: "⚡", title: "Backend API", sub: "FastAPI + Node.js", border: "border-ll-blue/30" },
  { icon: "🗄", title: "PostgreSQL", sub: "PostGIS + Supabase", border: "border-ll-purple/30" },
  { icon: "📡", title: "Notifications", sub: "FCM + Twilio SMS", border: "border-ll-amber/30" },
  { icon: "🏥", title: "Hospital", sub: "Dashboard + Dispatch", border: "border-ll-green/30" },
];

const techStack = [
  { name: "FastAPI", role: "Python REST API", color: "bg-ll-green" },
  { name: "Node.js", role: "Express + Socket.io", color: "bg-ll-green" },
  { name: "PostgreSQL", role: "Primary database", color: "bg-ll-blue" },
  { name: "PostGIS", role: "Geo-spatial queries", color: "bg-ll-blue" },
  { name: "Supabase", role: "Auth + Realtime CDC", color: "bg-ll-purple" },
  { name: "Socket.io", role: "WebSocket real-time", color: "bg-ll-cyan" },
  { name: "Firebase FCM", role: "Push notifications", color: "bg-ll-amber" },
  { name: "Twilio", role: "SMS fallback", color: "bg-ll-red" },
  { name: "React.js", role: "Admin dashboard", color: "bg-ll-amber" },
  { name: "React Native", role: "Mobile app", color: "bg-ll-blue" },
  { name: "Google Maps", role: "Geocoding", color: "bg-ll-green" },
  { name: "JWT + bcrypt", role: "Authentication", color: "bg-ll-red" },
];

const endpoints = [
  { method: "POST", path: "/api/v1/register", auth: "No", desc: "Create account + family group", color: "bg-ll-green/10 text-ll-green" },
  { method: "POST", path: "/api/v1/login", auth: "No", desc: "Get JWT token", color: "bg-ll-green/10 text-ll-green" },
  { method: "POST", path: "/api/v1/report-emergency", auth: "Yes", desc: "Log emergency event", color: "bg-ll-green/10 text-ll-green" },
  { method: "PATCH", path: "/api/v1/emergencies/:id/status", auth: "Yes", desc: "Update status", color: "bg-ll-amber/10 text-ll-amber" },
  { method: "GET", path: "/api/v1/nearby-hospitals", auth: "No", desc: "Find hospitals by lat/lng", color: "bg-ll-blue/10 text-ll-blue" },
  { method: "POST", path: "/api/v1/fundraisers", auth: "Yes", desc: "Create fundraiser", color: "bg-ll-green/10 text-ll-green" },
  { method: "GET", path: "/api/v1/fundraisers", auth: "No", desc: "List all fundraisers", color: "bg-ll-blue/10 text-ll-blue" },
];

const tables = [
  { name: "👤 users", cols: [["id","UUID PK"],["email","VARCHAR"],["hashed_password","VARCHAR"],["role","ENUM"],["medical_profile","JSONB"],["family_id","UUID FK"]] },
  { name: "🚨 emergencies", cols: [["id","UUID PK"],["reporter_id","UUID FK"],["type","ENUM"],["lat/lng","FLOAT"],["location","GEOGRAPHY"],["status","ENUM"]] },
  { name: "👨‍👩‍👧 families", cols: [["id","UUID PK"],["group_code","VARCHAR"],["name","VARCHAR"],["created_at","TIMESTAMP"]] },
  { name: "💰 fundraisers", cols: [["id","UUID PK"],["creator_id","UUID FK"],["goal_amount","NUMERIC"],["raised_amount","NUMERIC"],["verified","BOOLEAN"]] },
  { name: "🏥 hospitals", cols: [["id","UUID PK"],["name","TEXT"],["available_beds","INT"],["icu_beds","INT"],["lat/lng","FLOAT"]] },
  { name: "🚑 ambulances", cols: [["id","UUID PK"],["unit_number","TEXT"],["paramedic_id","UUID FK"],["status","ENUM"],["speed","FLOAT"]] },
];

const roles = [
  { role: "admin", access: "All incidents, all hospitals, broadcast alerts", color: "text-ll-red" },
  { role: "hospital_staff", access: "Own hospital incidents + bed management", color: "text-ll-blue" },
  { role: "paramedic", access: "SOS trigger, own ambulance location push", color: "text-ll-green" },
  { role: "patient", access: "SOS trigger only", color: "text-ll-amber" },
];

export default function ArchitecturePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h1 className="text-3xl font-extrabold tracking-tight mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>⚙️ Technical Architecture</motion.h1>
      <p className="text-sm text-ll-text2 mb-8">Full-stack breakdown of the LifeLine platform.</p>

      <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">

        {/* Data Flow */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 flex items-center gap-2">🚨 End-to-End Emergency Flow</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {flowSteps.map((s, i) => (
              <div key={s.title} className="flex items-center gap-3">
                <div className={`bg-ll-bg border ${s.border} rounded-xl p-4 text-center min-w-[130px]`}>
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-sm font-bold">{s.title}</div>
                  <div className="text-[10px] text-ll-text3">{s.sub}</div>
                </div>
                {i < flowSteps.length - 1 && <ArrowRight className="w-4 h-4 text-ll-text4 hidden sm:block" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">🛠 Stack Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {techStack.map(t => (
              <div key={t.name} className="bg-ll-bg border border-ll-border rounded-xl p-3 flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${t.color} flex-shrink-0`} />
                <div><div className="text-sm font-semibold">{t.name}</div><div className="text-[11px] text-ll-text3">{t.role}</div></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* API Endpoints */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6 overflow-x-auto">
          <h2 className="text-lg font-bold mb-4">📡 API Endpoints</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b-2 border-ll-border2"><th className="text-left p-2.5 text-[11px] uppercase tracking-wider text-ll-text3">Method</th><th className="text-left p-2.5 text-[11px] uppercase tracking-wider text-ll-text3">Path</th><th className="text-left p-2.5 text-[11px] uppercase tracking-wider text-ll-text3 hidden sm:table-cell">Auth</th><th className="text-left p-2.5 text-[11px] uppercase tracking-wider text-ll-text3">Description</th></tr></thead>
            <tbody>
              {endpoints.map(e => (
                <tr key={e.path} className="border-b border-ll-border"><td className="p-2.5"><span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${e.color}`}>{e.method}</span></td><td className="p-2.5 font-mono text-xs">{e.path}</td><td className="p-2.5 text-xs hidden sm:table-cell">{e.auth}</td><td className="p-2.5 text-xs text-ll-text2">{e.desc}</td></tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Database Schema */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">🗄 Database Schema</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tables.map(t => (
              <div key={t.name} className="bg-ll-bg border border-ll-border rounded-xl p-3.5">
                <h4 className="text-sm font-bold text-ll-cyan mb-2">{t.name}</h4>
                {t.cols.map(([col, type]) => (
                  <div key={col} className="flex justify-between py-1 border-b border-ll-border last:border-0 text-[11px]">
                    <span className="text-ll-text2">{col}</span><span className="font-mono text-ll-text4">{type}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code Sample */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">🐍 FastAPI Emergency Endpoint</h2>
          <pre className="bg-[#0d1117] border border-ll-border rounded-xl p-4 overflow-x-auto font-mono text-xs leading-7 text-gray-300">
{`@router.post("/report-emergency", status_code=201)
async def report_emergency(
    payload: ReportEmergencyRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    emergency = Emergency(
        id=uuid.uuid4(),
        reporter_id=current_user.id,
        type=payload.type,
        latitude=payload.latitude,
        longitude=payload.longitude,
        status=EmergencyStatus.pending,
    )
    db.add(emergency)
    await db.commit()
    # TODO: emit Socket.io push to family
    return emergency`}
          </pre>
        </motion.div>

        {/* Real-time Architecture */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">📡 Dual Real-Time Layers</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-ll-bg border border-ll-cyan/20 rounded-xl p-4">
              <div className="text-base font-bold text-ll-cyan mb-2">Socket.io</div>
              <div className="text-xs text-ll-text2 leading-relaxed">Low-latency server push for GPS positions (&lt;100ms). Updates every 10 seconds without touching DB.</div>
            </div>
            <div className="bg-ll-bg border border-ll-purple/20 rounded-xl p-4">
              <div className="text-base font-bold text-ll-purple mb-2">Supabase Realtime</div>
              <div className="text-xs text-ll-text2 leading-relaxed">PostgreSQL CDC for persistent data changes (incidents, beds) as reliable fallback. Row-level security enforced.</div>
            </div>
          </div>
        </motion.div>

        {/* Auth Roles */}
        <motion.div variants={item} className="bg-ll-surface border border-ll-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">🔐 Role-Based Access</h2>
          <table className="w-full text-sm">
            <thead><tr className="border-b-2 border-ll-border2"><th className="text-left p-2.5 text-[11px] uppercase tracking-wider text-ll-text3">Role</th><th className="text-left p-2.5 text-[11px] uppercase tracking-wider text-ll-text3">Access</th></tr></thead>
            <tbody>{roles.map(r => (<tr key={r.role} className="border-b border-ll-border"><td className={`p-2.5 font-bold ${r.color}`}>{r.role}</td><td className="p-2.5 text-ll-text2">{r.access}</td></tr>))}</tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}
