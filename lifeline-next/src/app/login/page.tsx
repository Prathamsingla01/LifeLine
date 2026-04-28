"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User, Building2, Stethoscope, Eye, EyeOff, ArrowRight, Mail, Lock, Phone } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Input } from "@/components/ui/Input";
import { OTPInput } from "@/components/ui/OTPInput";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import toast from "react-hot-toast";

const roles = [
  { id: "USER", label: "User", icon: User, desc: "Report emergencies & track family", color: "text-ll-blue", bg: "bg-ll-blue/10", border: "border-ll-blue/30" },
  { id: "HOSPITAL_STAFF", label: "Hospital", icon: Building2, desc: "Manage beds & receive alerts", color: "text-ll-green", bg: "bg-ll-green/10", border: "border-ll-green/30" },
  { id: "ADMIN", label: "Admin", icon: Stethoscope, desc: "Full system access", color: "text-ll-purple", bg: "bg-ll-purple/10", border: "border-ll-purple/30" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const { login, register, isAuthenticated } = useAuthStore();

  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState("USER");
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirect);
    }
  }, [isAuthenticated, redirect, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      const result = await register({ name, email, password, role: selectedRole });
      setLoading(false);
      if (result.success) {
        setStep("otp");
        toast.success("Account created! Verify your email.");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } else {
      const result = await login(email, password);
      setLoading(false);
      if (result.success) {
        setStep("done");
        toast.success("Welcome back!");
        setTimeout(() => router.push(redirect), 1200);
      } else {
        toast.error(result.error || "Login failed");
      }
    }
  }

  async function verifyOTP() {
    setLoading(true);
    // Demo mode — accept any OTP
    await new Promise((r) => setTimeout(r, 800));
    setStep("done");
    setLoading(false);
    toast.success("Email verified!");
    setTimeout(() => router.push(redirect), 1200);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(239,68,68,0.08)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass rounded-2xl p-8 relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-red to-red-700 flex items-center justify-center glow-red">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">LifeLine</span>
        </div>

        <AnimatePresence mode="wait">
          {step === "form" && (
            <motion.div key="form" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
              <h2 className="text-2xl font-extrabold text-center mb-1">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-ll-text2 text-center mb-6">
                {isSignup ? "Join the safety network" : "Sign in to your account"}
              </p>

              {/* Role Selector */}
              {isSignup && (
                <div className="mb-5">
                  <label className="text-xs font-semibold text-ll-text3 uppercase tracking-wider mb-2 block">
                    Select Role
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRole(r.id)}
                        type="button"
                        className={`p-3 rounded-xl border text-center transition-all ${
                          selectedRole === r.id
                            ? `${r.border} ${r.bg}`
                            : "border-ll-border bg-ll-surface hover:border-ll-border2"
                        }`}
                      >
                        <r.icon className={`w-5 h-5 mx-auto mb-1 ${selectedRole === r.id ? r.color : "text-ll-text3"}`} />
                        <div className="text-[11px] font-semibold">{r.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignup && (
                  <Input
                    label="Full Name"
                    placeholder="Arjun Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    icon={<User className="w-4 h-4" />}
                  />
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="arjun@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<Mail className="w-4 h-4" />}
                />

                <div>
                  <Input
                    label="Password"
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    icon={<Lock className="w-4 h-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="text-ll-text3 hover:text-ll-text transition-colors"
                        tabIndex={-1}
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                  {isSignup && <PasswordStrength password={password} className="mt-2" />}
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-br from-ll-red to-red-700 text-white font-bold text-sm glow-red hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {isSignup ? "Create Account" : "Sign In"}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Demo hint */}
              <div className="mt-4 p-3 rounded-lg bg-ll-blue/5 border border-ll-blue/10">
                <p className="text-[11px] text-ll-text3 text-center">
                  💡 <strong>Demo mode:</strong> Any email/password works. Try <code className="text-ll-blue">arjun@email.com</code>
                </p>
              </div>

              <p className="text-sm text-ll-text3 text-center mt-5">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setStep("form");
                  }}
                  className="text-ll-blue font-semibold hover:underline"
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-xl font-extrabold mb-2">Verify Your Email</h2>
              <p className="text-sm text-ll-text2 mb-6">
                Enter the 6-digit code sent to <strong className="text-ll-text">{email}</strong>
              </p>

              <OTPInput
                value={otp}
                onChange={setOtp}
                autoFocus
              />

              <motion.button
                onClick={verifyOTP}
                whileTap={{ scale: 0.98 }}
                disabled={loading || otp.length < 6}
                className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-br from-ll-blue to-blue-700 text-white font-bold text-sm glow-blue disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </motion.button>

              <p className="text-xs text-ll-text3 mt-4">
                Didn&apos;t receive the code?{" "}
                <button className="text-ll-blue font-semibold hover:underline">Resend</button>
              </p>

              {/* Demo hint */}
              <div className="mt-4 p-3 rounded-lg bg-ll-blue/5 border border-ll-blue/10">
                <p className="text-[11px] text-ll-text3">
                  💡 <strong>Demo mode:</strong> Enter any 6 digits
                </p>
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ✅
              </motion.div>
              <h2 className="text-xl font-extrabold mb-2">
                {isSignup ? "Account Created!" : "Welcome Back!"}
              </h2>
              <p className="text-sm text-ll-text2 mb-6">Redirecting to dashboard...</p>
              <div className="w-8 h-8 border-2 border-ll-green/30 border-t-ll-green rounded-full animate-spin mx-auto" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
