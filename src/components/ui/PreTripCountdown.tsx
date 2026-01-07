'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dose } from '@/data/doses';

interface PreTripCountdownProps {
  dose: Dose;
  onComplete: () => void;
  onCancel: () => void;
}

export default function PreTripCountdown({ dose, onComplete, onCancel }: PreTripCountdownProps) {
  const [count, setCount] = useState(5);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
      setBreathPhase(count % 2 === 0 ? 'inhale' : 'exhale');
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at center, ${dose.colors[0]}40, transparent 70%)`,
        }}
      />

      {/* Cancel button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onCancel}
        className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 text-white/60 text-sm hover:bg-white/20 transition-colors"
      >
        Cancel
      </motion.button>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-neuro-purple to-neuro-magenta flex items-center justify-center">
          <span className="text-4xl">🧠</span>
        </div>
      </motion.div>

      {/* Drug name */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-white mb-2"
      >
        {dose.name}
      </motion.h2>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white/60 mb-12"
      >
        {dose.tagline}
      </motion.p>

      {/* Breathing circle with countdown */}
      <div className="relative mb-8">
        {/* Outer glow */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? 1.3 : 1,
            opacity: breathPhase === 'inhale' ? 0.5 : 0.2,
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${dose.colors[0]}60, transparent)`,
            width: '200px',
            height: '200px',
            marginLeft: '-20px',
            marginTop: '-20px',
          }}
        />

        {/* Main circle */}
        <motion.div
          animate={{
            scale: breathPhase === 'inhale' ? 1.2 : 0.9,
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="w-40 h-40 rounded-full flex items-center justify-center relative"
          style={{
            background: `linear-gradient(135deg, ${dose.colors[0]}80, ${dose.colors[1] || dose.colors[0]}80)`,
            boxShadow: `0 0 60px ${dose.colors[0]}40`,
          }}
        >
          {/* Countdown number */}
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-6xl font-bold text-white"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Breathing instruction */}
      <motion.div
        key={breathPhase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xl text-white font-medium">
          {breathPhase === 'inhale' ? 'Breathe In...' : 'Breathe Out...'}
        </p>
        <p className="text-white/50 text-sm mt-2">
          Relax and prepare for your journey
        </p>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <div className="flex items-center justify-center gap-6 text-white/40 text-sm">
          <span>🎧 Headphones on</span>
          <span>👁️ Close your eyes</span>
          <span>🧘 Relax your body</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
