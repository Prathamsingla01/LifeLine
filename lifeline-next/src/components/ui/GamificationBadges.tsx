"use client";
import { motion } from "framer-motion";
import { Shield, Award, Star, Zap, Heart, Users, MapPin, Clock } from "lucide-react";

/* Gamification System — Safety badges & achievements */

interface BadgeData {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  color: string;
  bgColor: string;
  earned: boolean;
  progress?: number;
}

const badges: BadgeData[] = [
  { id: "profile", icon: Shield, label: "Profile Guardian", desc: "Complete medical profile", color: "text-ll-green", bgColor: "bg-ll-green/10 border-ll-green/25", earned: true },
  { id: "family", icon: Users, label: "Family Sentinel", desc: "Link 4+ family members", color: "text-ll-blue", bgColor: "bg-ll-blue/10 border-ll-blue/25", earned: true },
  { id: "firstaid", icon: Heart, label: "First Aid Hero", desc: "Complete first aid course", color: "text-ll-red", bgColor: "bg-ll-red/10 border-ll-red/25", earned: true },
  { id: "donor", icon: Star, label: "Community Star", desc: "Donate to 3+ campaigns", color: "text-ll-amber", bgColor: "bg-ll-amber/10 border-ll-amber/25", earned: true, progress: 100 },
  { id: "responder", icon: Zap, label: "Quick Responder", desc: "Respond to 5 alerts <30s", color: "text-ll-purple", bgColor: "bg-ll-purple/10 border-ll-purple/25", earned: false, progress: 60 },
  { id: "explorer", icon: MapPin, label: "Zone Explorer", desc: "Check 10 safe zones", color: "text-ll-cyan", bgColor: "bg-ll-cyan/10 border-ll-cyan/25", earned: false, progress: 30 },
  { id: "streak", icon: Clock, label: "Safety Streak", desc: "30-day check-in streak", color: "text-ll-green", bgColor: "bg-ll-green/10 border-ll-green/25", earned: false, progress: 73 },
  { id: "veteran", icon: Award, label: "LifeLine Veteran", desc: "1 year active member", color: "text-ll-amber", bgColor: "bg-ll-amber/10 border-ll-amber/25", earned: false, progress: 15 },
];

export function GamificationBadges({ compact = false }: { compact?: boolean }) {
  const earnedCount = badges.filter((b) => b.earned).length;

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {badges
          .filter((b) => b.earned)
          .slice(0, 4)
          .map((badge) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.2, y: -2 }}
              className={`w-8 h-8 rounded-lg ${badge.bgColor} border flex items-center justify-center cursor-default`}
              title={badge.label}
            >
              <badge.icon className={`w-4 h-4 ${badge.color}`} />
            </motion.div>
          ))}
        {earnedCount > 4 && (
          <span className="text-[10px] font-semibold text-ll-text3 ml-1">
            +{earnedCount - 4}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold">Safety Achievements</div>
          <div className="text-xs text-ll-text3">
            {earnedCount}/{badges.length} badges earned
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-mono text-ll-amber">Level 4</div>
          <div className="w-20 h-1.5 bg-ll-surface2 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-ll-amber to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className={`relative rounded-xl border p-3 text-center cursor-default transition-all ${
              badge.earned
                ? `${badge.bgColor} shadow-md`
                : "bg-ll-surface border-ll-border opacity-60"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                badge.earned ? badge.bgColor : "bg-ll-surface2"
              }`}
            >
              <badge.icon
                className={`w-5 h-5 ${badge.earned ? badge.color : "text-ll-text4"}`}
              />
            </div>
            <div
              className={`text-[11px] font-bold mb-0.5 ${
                badge.earned ? "" : "text-ll-text3"
              }`}
            >
              {badge.label}
            </div>
            <div className="text-[9px] text-ll-text3 leading-tight">{badge.desc}</div>

            {/* Progress bar for unearned */}
            {!badge.earned && badge.progress !== undefined && (
              <div className="mt-2 w-full h-1 bg-ll-surface2 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r from-ll-text4 to-ll-text3`}
                  initial={{ width: 0 }}
                  animate={{ width: `${badge.progress}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            )}

            {/* Earned checkmark */}
            {badge.earned && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-ll-green flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">✓</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
