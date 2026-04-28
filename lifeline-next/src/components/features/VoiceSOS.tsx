"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, AlertTriangle, Phone } from "lucide-react";
import toast from "react-hot-toast";

interface VoiceSOSProps {
  onActivate?: (transcript: string) => void;
}

const TRIGGER_PHRASES = ["help", "emergency", "sos", "accident", "fire", "danger", "bachao", "madad"];

export function VoiceSOS({ onActivate }: VoiceSOSProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [triggered, setTriggered] = useState(false);
  const [volume, setVolume] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (!win.webkitSpeechRecognition && !win.SpeechRecognition) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const current = event.results[event.results.length - 1];
      const text = current[0].transcript.toLowerCase();
      setTranscript(text);
      setVolume(current[0].confidence);

      if (TRIGGER_PHRASES.some(phrase => text.includes(phrase))) {
        setTriggered(true);
        onActivate?.(text);
        recognition.stop();
        toast.success("🚨 Voice SOS triggered!");
        setTimeout(() => setTriggered(false), 5000);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    setTranscript("");
  }, [onActivate]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return (
    <div className="bg-ll-surface border border-ll-border rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Mic className="w-5 h-5 text-ll-purple" />
        <span className="font-mono text-[10px] tracking-[2px] uppercase text-ll-text3">Voice SOS</span>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {/* Volume indicator rings */}
          {listening && (
            <>
              <motion.div
                className="absolute inset-[-8px] rounded-full border-2 border-ll-purple/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-[-16px] rounded-full border border-ll-purple/15"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}

          <motion.button
            onClick={listening ? stopListening : startListening}
            whileTap={{ scale: 0.95 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              triggered
                ? "bg-gradient-to-br from-green-500 to-green-700 glow-green"
                : listening
                ? "bg-gradient-to-br from-ll-purple to-purple-700 glow-purple"
                : "bg-ll-surface2 border border-ll-border2 hover:border-ll-purple/30"
            }`}
          >
            {triggered ? (
              <AlertTriangle className="w-6 h-6 text-white" />
            ) : listening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-ll-text3" />
            )}
          </motion.button>
        </div>

        <div className="text-center">
          <p className="text-xs text-ll-text3">
            {triggered ? "🚨 SOS Triggered!" : listening ? "Listening for emergency keywords..." : "Tap to start voice monitoring"}
          </p>
          {transcript && (
            <p className="text-xs text-ll-text2 mt-1 italic">&ldquo;{transcript}&rdquo;</p>
          )}
        </div>

        <div className="text-[10px] text-ll-text4 text-center">
          Keywords: <span className="font-mono">help, emergency, SOS, accident, fire, bachao</span>
        </div>
      </div>
    </div>
  );
}
