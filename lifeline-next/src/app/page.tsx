"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { Shield, Zap, Heart, MapPin, Users, Code2, ArrowRight, Activity, Globe2, Radio } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import type { MapMarker } from "@/components/maps/EmergencyMap";

const EmergencyMap = dynamic(() => import("@/components/maps/EmergencyMap").then(m => ({ default: m.EmergencyMap })), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-ll-surface rounded-2xl skeleton" />,
});

const GlobeComponent = dynamic(() => import("@/components/features/Globe").then(m => ({ default: m.Globe })), {
  ssr: false,
  loading: () => <div className="w-[400px] h-[400px] bg-ll-surface/30 rounded-full skeleton" />,
});

/* ── TYPEWRITER ── */
function Typewriter({ words, className = "" }: { words: string[]; className?: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const speed = deleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!deleting && charIndex === word.length) {
        setTimeout(() => setDeleting(true), 1500);
      } else if (deleting && charIndex === 0) {
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      } else {
        setCharIndex((prev) => prev + (deleting ? -1 : 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex, words]);

  return (
    <span className={className}>
      {words[wordIndex].substring(0, charIndex)}
      <span className="typewriter-cursor" />
    </span>
  );
}

/* ── PARTICLES (enhanced with parallax) ── */
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => {
        const size = 1 + Math.random() * 3;
        const colors = ["rgba(239,68,68,0.3)", "rgba(59,130,246,0.2)", "rgba(34,197,94,0.2)", "rgba(245,158,11,0.2)", "rgba(168,85,247,0.15)"];
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              background: colors[i % colors.length],
              animation: `float-particle ${8 + Math.random() * 15}s linear ${Math.random() * 8}s infinite`,
              filter: i % 3 === 0 ? `blur(${Math.random() * 2}px)` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

/* ── LIVE TICKER ── */
function LiveTicker() {
  const [incidents, setIncidents] = useState(2847);
  const [responding, setResponding] = useState(12);

  useEffect(() => {
    const t = setInterval(() => {
      setIncidents(prev => prev + Math.floor(Math.random() * 3));
      setResponding(prev => Math.max(5, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      className="flex items-center gap-6 bg-ll-surface/60 border border-ll-border rounded-full px-5 py-2 backdrop-blur-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-ll-red ticker-live" />
        <span className="text-xs font-mono text-ll-text3">LIVE</span>
      </div>
      <div className="text-xs font-mono text-ll-text2">
        <span className="text-ll-red font-bold">{incidents}</span> incidents tracked
      </div>
      <div className="text-xs font-mono text-ll-text2">
        <span className="text-ll-green font-bold">{responding}</span> responders active
      </div>
      <div className="text-xs font-mono text-ll-text2">
        <span className="text-ll-blue font-bold">847</span> users online
      </div>
    </motion.div>
  );
}

/* ── DATA ── */
const features = [
  { href: "/demo", icon: Shield, title: "Emergency Hub", desc: "SOS button, hospital dispatch, safe-zone routing, and live fundraising transparency.", color: "ll-red", iconBg: "bg-ll-red/10 border-ll-red/20" },
  { href: "/accident", icon: Zap, title: "Accident Detection", desc: "Step-by-step crash scenario: sensor data, safety timer, auto-SOS, hospital notification.", color: "ll-amber", iconBg: "bg-ll-amber/10 border-ll-amber/20" },
  { href: "/scenarios", icon: Activity, title: "4 Demo Scenarios", desc: "Animated walkthroughs: accident alert, flood response, child safety, community healing.", color: "ll-blue", iconBg: "bg-ll-blue/10 border-ll-blue/20" },
  { href: "/profile", icon: Heart, title: "Medical Profile", desc: "Pre-loaded medical data transmitted instantly to hospitals during emergencies.", color: "ll-green", iconBg: "bg-ll-green/10 border-ll-green/20" },
  { href: "/family", icon: Users, title: "Family Tracker", desc: "Real-time family locations, safety status updates, and instant SOS notification chain.", color: "ll-purple", iconBg: "bg-ll-purple/10 border-ll-purple/20" },
  { href: "/architecture", icon: Code2, title: "Tech Architecture", desc: "Full-stack breakdown: FastAPI, Node.js, PostgreSQL, Socket.io, Firebase, Twilio.", color: "ll-cyan", iconBg: "bg-ll-cyan/10 border-ll-cyan/20" },
];

const stats = [
  { value: 7.8, suffix: "s", decimals: 1, label: "Alert-to-Hospital", color: "text-ll-red" },
  { value: 97, suffix: "%", decimals: 0, label: "Crash Detection Accuracy", color: "text-ll-green" },
  { value: 847, suffix: "", decimals: 0, label: "Users Protected", color: "text-ll-blue" },
  { value: 4, suffix: "", decimals: 0, label: "Active Scenarios", color: "text-ll-amber" },
];

const steps = [
  { num: "01", title: "Detect", desc: "Accelerometer + gyroscope detect collision with 97% accuracy", color: "text-ll-red" },
  { num: "02", title: "Confirm", desc: "10-second safety timer — auto-SOS if no user response", color: "text-ll-amber" },
  { num: "03", title: "Alert", desc: "FCM push to family, Twilio SMS to hospital, WebSocket to dashboard", color: "text-ll-blue" },
  { num: "04", title: "Dispatch", desc: "Nearest ambulance assigned, ETA calculated, medical profile sent", color: "text-ll-green" },
];

const techChips = ["FastAPI", "Node.js", "PostgreSQL", "PostGIS", "Socket.io", "Firebase FCM", "Twilio SMS", "Supabase", "React", "Next.js", "Leaflet", "Framer Motion"];

const heroMarkers: MapMarker[] = [
  { id: "h1", lat: 28.6315, lng: 77.2167, type: "emergency", label: "Car Accident", popup: "INC-2847 · Critical", severity: "critical", pulse: true },
  { id: "h2", lat: 28.6448, lng: 77.2167, type: "hospital", label: "AIIMS Hospital", popup: "12 ICU beds available" },
  { id: "h3", lat: 28.6252, lng: 77.1986, type: "ambulance", label: "AMB-204", popup: "ETA 4 min" },
  { id: "h4", lat: 28.6139, lng: 77.2090, type: "user", label: "You", popup: "Connaught Place" },
  { id: "h5", lat: 28.5946, lng: 77.2200, type: "hospital", label: "Safdarjung Hospital", popup: "8 beds available" },
  { id: "h6", lat: 28.6508, lng: 77.2300, type: "danger", label: "Flood Zone", popup: "Yamuna Basin", severity: "moderate" },
  { id: "h7", lat: 28.6100, lng: 77.2350, type: "emergency", label: "Fire Report", popup: "INC-2845 · Building Fire", severity: "critical", pulse: true },
  { id: "h8", lat: 28.5821, lng: 77.2345, type: "ambulance", label: "AMB-207", popup: "Available" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Home() {
  return (
    <>
      <Particles />

      {/* ── HERO WITH GLOBE ── */}
      <section className="relative pt-12 pb-4 px-6 overflow-hidden">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse,rgba(239,68,68,0.12)_0%,rgba(239,68,68,0.03)_40%,transparent_70%)] pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-left z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ll-red/8 border border-ll-red/20 text-xs font-semibold text-ll-red tracking-wide mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-ll-red animate-pulse-dot" />
                HACKATHON BUILD · LIVE DEMO
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.05] mb-6 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              When Every Second<br />
              <Typewriter
                words={["Saves a Life", "Counts", "Matters Most", "Changes Everything"]}
                className="gradient-text"
              />
            </motion.h1>

            <motion.p
              className="text-base lg:text-lg text-ll-text2 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              AI-powered emergency response platform with automatic accident detection,
              disaster mapping, family safety alerts, and transparent community fundraising.
            </motion.p>

            <motion.div
              className="flex gap-3 justify-center lg:justify-start flex-wrap mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button variant="primary" size="lg">
                <Link href="/demo" className="flex items-center gap-2">
                  🚨 Launch App Demo
                </Link>
              </Button>
              <Button variant="secondary" size="lg">
                <Link href="/scenarios" className="flex items-center gap-2">
                  🎯 View Scenarios
                </Link>
              </Button>
            </motion.div>

            <LiveTicker />
          </div>

          {/* Right — Globe */}
          <div className="flex-shrink-0 hidden lg:block">
            <GlobeComponent />
          </div>
        </div>
      </section>

      {/* ── LIVE MAP ── */}
      <motion.section
        className="px-6 py-8 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
      >
        <div className="relative">
          <EmergencyMap
            markers={heroMarkers}
            center={[28.62, 77.22]}
            zoom={13}
            height="h-[400px]"
            routes={[
              { from: [28.6252, 77.1986], to: [28.6315, 77.2167], color: "#3b82f6", dashed: true },
              { from: [28.6448, 77.2167], to: [28.6315, 77.2167], color: "#22c55e" },
            ]}
          />
          {/* Map overlay badge */}
          <div className="absolute top-4 left-4 z-[500] glass rounded-xl px-3 py-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-ll-red animate-pulse-dot" />
            <span className="text-xs font-mono uppercase tracking-wider text-ll-text3">Live Emergency Map · Delhi NCR</span>
          </div>
          <div className="absolute bottom-4 right-4 z-[500] glass rounded-xl px-3 py-2">
            <span className="text-xs font-semibold text-ll-text2">3 Active · 2 Responding · 5 Hospitals</span>
          </div>
        </div>
      </motion.section>

      {/* ── STATS ── */}
      <section className="flex justify-center gap-12 sm:gap-16 flex-wrap py-10 px-6 border-t border-b border-ll-border">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className={`text-4xl font-black tracking-tight font-mono ${s.color}`}>
              <AnimatedNumber target={s.value} suffix={s.suffix} decimals={s.decimals} />
            </div>
            <div className="text-xs text-ll-text3 mt-1 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6">
        <div className="text-center mb-14">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-ll-red mb-3">Explore the Platform</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">Six Modules, One Mission</h2>
          <p className="text-base text-ll-text2 max-w-md mx-auto">Each module is a fully interactive demo. Click any card to explore.</p>
        </div>

        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[1100px] mx-auto" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
          {features.map((f) => (
            <motion.div key={f.href} variants={item}>
              <Link href={f.href} className="group block bg-ll-surface border border-ll-border rounded-2xl p-7 hover:-translate-y-1 hover:border-ll-border2 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-${f.color} to-${f.color}/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl`} />
                <div className={`w-13 h-13 rounded-[14px] ${f.iconBg} border flex items-center justify-center mb-5`}>
                  <f.icon className={`w-6 h-6 text-${f.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-ll-text2 leading-relaxed mb-5">{f.desc}</p>
                <div className="text-sm font-semibold text-ll-text3 flex items-center gap-2 group-hover:text-ll-text group-hover:gap-3 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-ll-bg2 border-t border-b border-ll-border">
        <div className="text-center mb-14">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-ll-red mb-3">How It Works</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">From Crash to Care in 8 Seconds</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {steps.map((s) => (
            <motion.div key={s.num} className="text-center p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: parseInt(s.num) * 0.1 }}>
              <div className="font-mono text-5xl font-bold text-ll-text4 mb-3">{s.num}</div>
              <div className={`text-base font-bold mb-2 ${s.color}`}>{s.title}</div>
              <div className="text-[13px] text-ll-text3 leading-relaxed">{s.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── NEW FEATURES HIGHLIGHT ── */}
      <section className="py-20 px-6">
        <div className="text-center mb-14">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-ll-purple mb-3">What&apos;s New</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">AI-Powered Intelligence</h2>
          <p className="text-base text-ll-text2 max-w-md mx-auto">Features that make LifeLine more than just an app — it&apos;s an emergency operating system.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { icon: "🧠", title: "AI Risk Map", desc: "Predict danger zones before incidents happen", color: "from-ll-purple/10 to-transparent", border: "border-ll-purple/20", href: "/risk-map" },
            { icon: "📡", title: "Live Feed", desc: "Real-time emergency stream across your region", color: "from-ll-red/10 to-transparent", border: "border-ll-red/20", href: "/feed" },
            { icon: "🔔", title: "Smart Alerts", desc: "Context-aware notifications that matter", color: "from-ll-amber/10 to-transparent", border: "border-ll-amber/20", href: "/notifications" },
            { icon: "🏅", title: "Gamification", desc: "Safety scores, badges, and community levels", color: "from-ll-green/10 to-transparent", border: "border-ll-green/20", href: "/dashboard" },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link href={f.href} className={`block bg-gradient-to-br ${f.color} border ${f.border} rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <div className="text-sm font-bold mb-1">{f.title}</div>
                <div className="text-xs text-ll-text3">{f.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section className="py-16 px-6 text-center border-t border-ll-border">
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-ll-red mb-3">Built With</div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-8">Production-Ready Stack</h2>
        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
          {techChips.map((t) => (
            <motion.div key={t} className="bg-ll-surface border border-ll-border rounded-full px-4 py-2 text-sm text-ll-text2 hover:border-ll-border2 hover:text-ll-text hover:-translate-y-0.5 transition-all cursor-default" whileHover={{ scale: 1.05 }}>
              {t}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 border-t border-ll-border text-center">
        <div className="text-lg font-extrabold mb-2">🛡 LifeLine</div>
        <div className="text-sm text-ll-text3 mb-5">Emergency Response Platform · Hackathon 2025</div>
        <div className="flex gap-6 justify-center flex-wrap">
          {features.map((f) => (
            <Link key={f.href} href={f.href} className="text-sm text-ll-text3 hover:text-ll-text transition-colors">{f.title}</Link>
          ))}
        </div>
      </footer>
    </>
  );
}
