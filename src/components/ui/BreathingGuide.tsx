'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, X, Settings } from 'lucide-react';
import { hapticEngine } from '@/lib/haptics';

interface BreathingPattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  description: string;
}

const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    name: 'Relaxing',
    inhale: 4,
    hold: 4,
    exhale: 6,
    pause: 2,
    description: 'Calming 4-4-6-2 pattern',
  },
  {
    name: 'Box',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    description: 'Equal 4-4-4-4 balance',
  },
  {
    name: 'Energizing',
    inhale: 4,
    hold: 0,
    exhale: 4,
    pause: 0,
    description: 'Quick rhythmic breath',
  },
  {
    name: 'Deep',
    inhale: 6,
    hold: 2,
    exhale: 8,
    pause: 2,
    description: 'Extended exhale for calm',
  },
];

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface BreathingGuideProps {
  isActive: boolean;
  onToggle: () => void;
  intensity?: number;
  colors?: string[];
  compact?: boolean;
}

export default function BreathingGuide({ 
  isActive, 
  onToggle, 
  intensity = 5,
  colors = ['#8b5cf6', '#ec4899'],
  compact = false 
}: BreathingGuideProps) {
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(selectedPattern.inhale);
  const [showSettings, setShowSettings] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);

  const getPhaseLabel = (p: BreathPhase): string => {
    switch (p) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Rest';
    }
  };

  const getNextPhase = useCallback((current: BreathPhase): BreathPhase => {
    switch (current) {
      case 'inhale': return selectedPattern.hold > 0 ? 'hold' : 'exhale';
      case 'hold': return 'exhale';
      case 'exhale': return selectedPattern.pause > 0 ? 'pause' : 'inhale';
      case 'pause': return 'inhale';
    }
  }, [selectedPattern]);

  const getPhaseDuration = useCallback((p: BreathPhase): number => {
    switch (p) {
      case 'inhale': return selectedPattern.inhale;
      case 'hold': return selectedPattern.hold;
      case 'exhale': return selectedPattern.exhale;
      case 'pause': return selectedPattern.pause;
    }
  }, [selectedPattern]);

  // Breathing timer
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const nextPhase = getNextPhase(phase);
          setPhase(nextPhase);
          
          // Track cycles
          if (nextPhase === 'inhale') {
            setCycleCount(c => c + 1);
          }
          
          // Haptic feedback on phase change
          if (nextPhase === 'inhale') {
            hapticEngine.breathingPulse(true, intensity);
          }
          
          return getPhaseDuration(nextPhase);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, getNextPhase, getPhaseDuration, intensity]);

  // Reset on pattern change
  useEffect(() => {
    setPhase('inhale');
    setCountdown(selectedPattern.inhale);
    setCycleCount(0);
  }, [selectedPattern]);

  const getScale = (): number => {
    switch (phase) {
      case 'inhale': return 1.4;
      case 'hold': return 1.4;
      case 'exhale': return 0.8;
      case 'pause': return 0.8;
    }
  };

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`p-3 rounded-xl transition-all ${
          isActive 
            ? 'bg-gradient-to-r from-neuro-cyan/30 to-neuro-purple/30 border border-neuro-cyan/50' 
            : 'bg-white/10 hover:bg-white/20'
        }`}
      >
        <Wind className={`w-5 h-5 ${isActive ? 'text-neuro-cyan' : 'text-white/60'}`} />
      </motion.button>
    );
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        className={`w-full glass rounded-xl p-4 transition-all ${
          isActive ? 'border border-neuro-cyan/50' : ''
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-neuro-cyan/20' : 'bg-white/10'}`}>
              <Wind className={`w-5 h-5 ${isActive ? 'text-neuro-cyan' : 'text-white/60'}`} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">Breathing Guide</p>
              <p className="text-xs text-white/50">
                {isActive ? `${selectedPattern.name} • Cycle ${cycleCount}` : 'Sync your breath'}
              </p>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-all ${
            isActive ? 'bg-neuro-cyan' : 'bg-white/20'
          }`}>
            <motion.div
              animate={{ x: isActive ? 24 : 2 }}
              className="w-5 h-5 mt-0.5 rounded-full bg-white shadow-lg"
            />
          </div>
        </div>
      </motion.button>

      {/* Active Breathing Visual */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-xl p-4 mt-2 overflow-hidden"
          >
            {/* Pattern Selector */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
              >
                <Settings className="w-3 h-3" />
                {selectedPattern.name}
              </button>
              <span className="text-xs text-white/40">{selectedPattern.description}</span>
            </div>

            {/* Pattern Options */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  {BREATHING_PATTERNS.map((pattern) => (
                    <button
                      key={pattern.name}
                      onClick={() => {
                        setSelectedPattern(pattern);
                        setShowSettings(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        selectedPattern.name === pattern.name
                          ? 'bg-neuro-cyan text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {pattern.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Breathing Circle */}
            <div className="relative flex items-center justify-center h-32">
              {/* Outer glow */}
              <motion.div
                animate={{
                  scale: getScale(),
                  opacity: phase === 'inhale' || phase === 'hold' ? 0.3 : 0.1,
                }}
                transition={{ duration: getPhaseDuration(phase), ease: 'easeInOut' }}
                className="absolute w-24 h-24 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${colors[0]}40, transparent)`,
                }}
              />
              
              {/* Main circle */}
              <motion.div
                animate={{
                  scale: getScale(),
                }}
                transition={{ duration: getPhaseDuration(phase), ease: 'easeInOut' }}
                className="relative w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}60, ${colors[1]}60)`,
                  boxShadow: `0 0 30px ${colors[0]}40`,
                }}
              >
                <span className="text-2xl font-bold text-white">{countdown}</span>
              </motion.div>
            </div>

            {/* Phase Label */}
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-lg font-medium text-white mt-2"
            >
              {getPhaseLabel(phase)}
            </motion.p>

            {/* Pattern Visualization */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {['inhale', 'hold', 'exhale', 'pause'].map((p) => {
                const duration = getPhaseDuration(p as BreathPhase);
                if (duration === 0) return null;
                return (
                  <div
                    key={p}
                    className={`h-1 rounded-full transition-all ${
                      phase === p ? 'bg-neuro-cyan' : 'bg-white/20'
                    }`}
                    style={{ width: `${duration * 8}px` }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
