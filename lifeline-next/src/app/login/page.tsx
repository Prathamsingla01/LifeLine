"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, Building2, Stethoscope, Eye, EyeOff, ArrowRight } from "lucide-react";

const roles = [
  { id: "user", label: "User", icon: User, desc: "Report emergencies & track family", color: "ll-blue" },
  { id: "hospital", label: "Hospital Staff", icon: Building2, desc: "Manage beds & receive alerts", color: "ll-green" },
  { id: "admin", label: "Admin", icon: Stethoscope, desc: "Full system access", color: "ll-purple" },
];

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user");
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (isSignup) { setStep("otp"); setLoading(false); }
    else { setStep("done"); setLoading(false); }
  }

  async function verifyOTP() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setStep("done");
    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(239,68,68,0.08)_0%,transparent_60%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md glass rounded-2xl p-8 relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center glow-red"><Shield className="w-5 h-5 text-white" /></div>
          <span className="text-xl font-extrabold tracking-tight">LifeLine</span>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <h2 className="text-2xl font-extrabold text-center mb-1">{isSignup ? "Create Account" : "Welcome Back"}</h2>
              <p className="text-sm text-ll-text2 text-center mb-6">{isSignup ? "Join the safety network" : "Sign in to your account"}</p>

              {isSignup && (
                <div className="mb-5">
                  <label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-2 block">Select Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map(r => (
                      <button key={r.id} onClick={() => setSelectedRole(r.id)} type="button"
                        className={`p-3 rounded-xl border text-center transition-all ${selectedRole === r.id ? `border-${r.color}/50 bg-${r.color}/8` : "border-ll-border bg-ll-surface hover:border-ll-border2"}`}>
                        <r.icon className={`w-5 h-5 mx-auto mb-1 ${selectedRole === r.id ? `text-${r.color}` : "text-ll-text3"}`} />
                        <div className="text-[11px] font-semibold">{r.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <div>
                    <label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-1.5 block">Full Name</label>
                    <input type="text" placeholder="Arjun Mehta" required
                      className="w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ll-blue/50 transition-colors placeholder:text-ll-text4" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-1.5 block">Email</label>
                  <input type="email" placeholder="arjun@email.com" required
                    className="w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ll-blue/50 transition-colors placeholder:text-ll-text4" />
                </div>
                <div className="relative">
                  <label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-1.5 block">Password</label>
                  <input type={showPass ? "text" : "password"} placeholder="••••••••" required minLength={8}
                    className="w-full bg-ll-bg border border-ll-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ll-blue/50 transition-colors placeholder:text-ll-text4 pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 bottom-3 text-ll-text3 hover:text-ll-text">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <motion.button type="submit" whileTap={{ scale: 0.98 }} disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-br from-ll-red to-red-700 text-white font-bold text-sm glow-red hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{isSignup ? "Create Account" : "Sign In"} <ArrowRight className="w-4 h-4" /></>}
                </motion.button>
              </form>

              <p className="text-sm text-ll-text3 text-center mt-5">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button onClick={() => setIsSignup(!isSignup)} className="text-ll-blue font-semibold hover:underline">{isSignup ? "Sign In" : "Sign Up"}</button>
              </p>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-xl font-extrabold mb-2">Verify Your Phone</h2>
              <p className="text-sm text-ll-text2 mb-6">Enter the 6-digit code sent to your phone</p>
              <div className="flex gap-2 justify-center mb-6">
                {[0,1,2,3,4,5].map(i => (
                  <input key={i} maxLength={1} className="w-11 h-13 bg-ll-bg border border-ll-border rounded-xl text-center text-lg font-bold focus:outline-none focus:border-ll-blue/50" />
                ))}
              </div>
              <motion.button onClick={verifyOTP} whileTap={{ scale: 0.98 }} disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-br from-ll-blue to-blue-700 text-white font-bold text-sm glow-blue disabled:opacity-60">
                {loading ? "Verifying..." : "Verify Code"}
              </motion.button>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <motion.div className="text-6xl mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>✅</motion.div>
              <h2 className="text-xl font-extrabold mb-2">{isSignup ? "Account Created!" : "Welcome Back!"}</h2>
              <p className="text-sm text-ll-text2 mb-6">Redirecting to dashboard...</p>
              <div className="w-8 h-8 border-2 border-ll-green/30 border-t-ll-green rounded-full animate-spin mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
