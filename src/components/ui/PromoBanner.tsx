'use client';

import { motion } from 'framer-motion';
import { Sparkles, Clock, Zap, Gift } from 'lucide-react';

const PROMO_ITEMS = [
  { icon: Gift, text: '🎉 LAUNCH SPECIAL: 420 FREE DOSES PER EXPERIENCE' },
  { icon: Clock, text: '⏰ LIMITED TIME PROMO - GRAB YOURS BEFORE THEY RUN OUT' },
  { icon: Sparkles, text: '✨ EARLY ADOPTERS GET EXCLUSIVE ACCESS' },
  { icon: Zap, text: '🧠 UNLOCK YOUR MIND WITH BINAURAL BEATS' },
];

export default function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-neuro-purple/20 via-neuro-magenta/20 to-neuro-purple/20 border-b border-white/10">
      {/* Noise texture overlay */}
      
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="flex items-center gap-8 py-2 whitespace-nowrap"
      >
        {/* Duplicate items for seamless loop */}
        {[...PROMO_ITEMS, ...PROMO_ITEMS, ...PROMO_ITEMS, ...PROMO_ITEMS].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm font-medium">
            <span className="text-white/90">{item.text}</span>
            <span className="text-neuro-magenta">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
