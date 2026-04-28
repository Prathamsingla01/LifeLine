"use client";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-ll-red/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-ll-red" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">Something went wrong</h2>
        <p className="text-sm text-ll-text2 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-ll-red to-red-700 text-white font-bold text-sm glow-red hover:-translate-y-0.5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
