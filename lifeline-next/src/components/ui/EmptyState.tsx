"use client";
import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  emoji?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, emoji, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {emoji && (
        <motion.div
          className="text-5xl mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          {emoji}
        </motion.div>
      )}
      {icon && <div className="mb-4 text-ll-text3">{icon}</div>}
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-ll-text3 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}

// Pre-configured empty states
export function NoNotifications() {
  return (
    <EmptyState
      emoji="🔔"
      title="All caught up!"
      description="No new notifications. We'll alert you when something important happens."
    />
  );
}

export function NoFeedItems() {
  return (
    <EmptyState
      emoji="📡"
      title="No active incidents"
      description="The emergency feed is clear. Stay safe!"
    />
  );
}

export function NoFamilyMembers() {
  return (
    <EmptyState
      emoji="👨‍👩‍👧‍👦"
      title="No family members yet"
      description="Add family members to track their safety in real-time."
    />
  );
}
