'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Crown, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';

const TRIAL_DURATION_HOURS = 24; // 1 day trial

export default function PremiumTrialBanner() {
  const { user, profile } = useAuth();
  const { isPremium } = useAppStore();
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [trialActive, setTrialActive] = useState(false);
  const [trialExpired, setTrialExpired] = useState(false);

  useEffect(() => {
    if (!user || !profile) return;

    // Check if user has premium subscription
    if (profile.is_premium) {
      setTrialActive(false);
      return;
    }

    // Check trial start time from profile
    const trialStart = profile.created_at ? new Date(profile.created_at) : null;
    if (!trialStart) return;

    const updateTimer = () => {
      const now = new Date();
      const trialEnd = new Date(trialStart.getTime() + TRIAL_DURATION_HOURS * 60 * 60 * 1000);
      const diff = trialEnd.getTime() - now.getTime();

      if (diff <= 0) {
        setTrialExpired(true);
        setTrialActive(false);
        setTimeRemaining('');
        return;
      }

      setTrialActive(true);
      setTrialExpired(false);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`);
      } else {
        setTimeRemaining(`${seconds}s remaining`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user, profile]);

  // Don't show if not logged in or if already premium
  if (!user || isPremium || profile?.is_premium) return null;

  if (trialExpired) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 text-sm">
          <Crown className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-medium">Trial expired</span>
          <span className="text-white/60">•</span>
          <span className="text-white/80">Upgrade to unlock premium drugs</span>
        </div>
      </motion.div>
    );
  }

  if (!trialActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-sm">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-amber-400 font-medium">Premium Trial</span>
        <span className="text-white/60">•</span>
        <Clock className="w-3.5 h-3.5 text-white/60" />
        <span className="text-white/80">{timeRemaining}</span>
      </div>
    </motion.div>
  );
}
