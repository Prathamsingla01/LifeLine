"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const quickPrompts = [
  "🩹 How to stop bleeding?",
  "🫀 CPR instructions",
  "🔥 What to do in a fire?",
  "🚗 I saw an accident",
];

const aiResponses: Record<string, string> = {
  "bleeding": "**Stop Bleeding — First Aid:**\n\n1. Apply direct pressure with a clean cloth\n2. Keep the wound elevated above the heart\n3. Don't remove the cloth if blood soaks through — add more layers\n4. If bleeding doesn't stop in 10 min, call emergency\n5. Apply a tourniquet ONLY for life-threatening limb bleeding\n\n⚠️ If the person is unconscious, call 112 immediately.",
  "cpr": "**CPR Instructions (Adult):**\n\n1. Check for responsiveness — tap shoulders, shout\n2. Call 112 or ask someone to call\n3. Place heel of hand on center of chest\n4. Push hard and fast — 2 inches deep, 100-120/min\n5. Give 30 compressions, then 2 rescue breaths\n6. Continue until help arrives\n\n💡 If untrained, do hands-only CPR (compressions only).",
  "fire": "**Fire Emergency Protocol:**\n\n1. 🚨 Alert everyone — shout \"FIRE!\"\n2. 🚪 Feel doors before opening — if hot, use another exit\n3. 🤸 Stay low — smoke rises, crawl to exit\n4. 🏃 Get out FAST — don't collect belongings\n5. 📱 Call 101 (Fire) once outside\n6. 🚫 Never use elevators during fire\n\n📍 Go to your designated assembly point.",
  "accident": "**Accident Response Steps:**\n\n1. 🛑 Ensure YOUR safety first — don't become a victim\n2. 📱 Call 112 immediately\n3. ⚠️ Turn on hazard lights, set up warning triangles\n4. 🩹 Check for injuries — don't move victims unless danger\n5. 🩸 Control visible bleeding with pressure\n6. 🗣️ Keep victims calm and talking\n7. 📸 Document the scene if safe\n\n💡 LifeLine can auto-detect crashes and send SOS for you!",
  "default": "I'm LifeLine AI — your emergency intelligence assistant. I can help with:\n\n• 🩹 First aid instructions\n• 🚨 Emergency protocols\n• 🏥 Finding nearby hospitals\n• 👨‍👩‍👧 Family safety tips\n• 📋 Medical information\n\nAsk me anything about emergency response!",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("bleed") || lower.includes("blood") || lower.includes("cut") || lower.includes("wound")) return aiResponses.bleeding;
  if (lower.includes("cpr") || lower.includes("heart") || lower.includes("cardiac") || lower.includes("chest")) return aiResponses.cpr;
  if (lower.includes("fire") || lower.includes("burn") || lower.includes("smoke")) return aiResponses.fire;
  if (lower.includes("accident") || lower.includes("crash") || lower.includes("collision") || lower.includes("car")) return aiResponses.accident;
  return aiResponses.default;
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hi! I'm **LifeLine AI** 🛡️\n\nI can help with first aid, emergency protocols, and safety guidance. What do you need help with?", time: "now" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 800));

    const aiMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content: getAIResponse(text), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setTyping(false);
    setMessages(prev => [...prev, aiMsg]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 300); }}
            className="fixed bottom-24 lg:bottom-8 right-6 z-[60] w-14 h-14 rounded-full bg-gradient-to-br from-ll-blue to-ll-cyan text-white flex items-center justify-center shadow-lg glow-blue"
            aria-label="Open AI Chat"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-24 lg:bottom-8 right-4 sm:right-6 z-[60] w-[calc(100vw-32px)] sm:w-[380px] h-[500px] glass-heavy rounded-2xl flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-ll-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ll-blue to-ll-cyan flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold">LifeLine AI</div>
                  <div className="text-[10px] text-ll-green flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-ll-green animate-pulse-dot" /> Online
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 transition-colors" aria-label="Close chat">
                <X className="w-4 h-4 text-ll-text3" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-md bg-ll-blue/15 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-ll-blue" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-ll-blue to-ll-blue/80 text-white rounded-br-sm"
                      : "bg-ll-surface border border-ll-border text-ll-text2 rounded-bl-sm"
                  }`}>
                    <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-ll-text font-semibold">$1</strong>')
                        .replace(/\n/g, "<br/>")
                    }} />
                    <div className={`text-[9px] mt-1.5 ${msg.role === "user" ? "text-white/50" : "text-ll-text4"}`}>{msg.time}</div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-md bg-ll-surface2 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-ll-text3" />
                    </div>
                  )}
                </motion.div>
              ))}

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-md bg-ll-blue/15 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-3 h-3 text-ll-blue" />
                  </div>
                  <div className="bg-ll-surface border border-ll-border rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.div key={i} className="w-2 h-2 rounded-full bg-ll-text3"
                          animate={{ y: [-2, 2, -2] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto">
                {quickPrompts.map(p => (
                  <button key={p} onClick={() => sendMessage(p.replace(/^.+? /, ""))}
                    className="flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-ll-surface border border-ll-border hover:border-ll-border2 text-ll-text2 transition-colors">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-3 py-3 border-t border-ll-border flex gap-2">
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about first aid, emergencies..."
                className="flex-1 bg-ll-bg border border-ll-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ll-blue/50 transition-colors placeholder:text-ll-text4" />
              <motion.button type="submit" whileTap={{ scale: 0.9 }} disabled={!input.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-ll-blue to-ll-cyan flex items-center justify-center text-white disabled:opacity-30 transition-opacity">
                <Send className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
