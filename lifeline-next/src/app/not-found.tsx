import Link from "next/link";
import { Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold gradient-text mb-4">404</div>
        <h2 className="text-2xl font-extrabold mb-2">Page Not Found</h2>
        <p className="text-sm text-ll-text2 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-ll-red to-red-700 text-white font-bold text-sm glow-red hover:-translate-y-0.5 transition-all"
        >
          <Shield className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
