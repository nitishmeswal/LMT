'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, X, Volume2, Zap, ChevronDown, Vibrate, Wind } from 'lucide-react';
import { useAppStore, TripPhase } from '@/store/useAppStore';
import { useAuth } from '@/context/AuthContext';
import { audioEngine } from '@/lib/audioEngine';
import { hapticEngine } from '@/lib/haptics';
import { syncJournalEntry } from '@/lib/supabase';
import { formatDuration } from '@/lib/utils';
import VisualRenderer from '@/components/visuals';
import BreathingGuide from '@/components/ui/BreathingGuide';
import PostTripRating from '@/components/ui/PostTripRating';
import EarlyExitDialog from '@/components/ui/EarlyExitDialog';
import { VisualType, Dose } from '@/data/doses';

const VISUAL_OPTIONS: { id: VisualType; name: string }[] = [
  { id: 'mandala', name: 'Mandala Flow' },
  { id: 'particles', name: 'Particle Field' },
  { id: 'fractals', name: 'Fractal Journey' },
  { id: 'chakra', name: 'Chakra Spirals' },
  { id: 'waves', name: 'Color Waves' },
  { id: 'breath', name: 'Minimal Breath' },
  { id: 'tunnel', name: 'Hyperspace Tunnel' },
  { id: 'cosmic', name: 'Cosmic Void' },
];

const PHASE_LABELS: Record<TripPhase, string> = {
  idle: 'Ready',
  onset: 'Onset',
  peak: 'Peak',
  sustain: 'Sustain',
  comedown: 'Comedown',
  complete: 'Complete',
};

export default function TripExperience() {
  const {
    currentDose,
    isPlaying,
    phase,
    elapsedTime,
    totalDuration,
    intensity,
    volume,
    currentVisual,
    showControls,
    togglePlay,
    stopTrip,
    setPhase,
    setElapsedTime,
    setIntensity,
    setVolume,
    setVisual,
    toggleControls,
    addJournalEntry,
  } = useAppStore();

  const { user } = useAuth();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hideControlsRef = useRef<NodeJS.Timeout | null>(null);
  
  // Haptic and breathing state
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [breathingEnabled, setBreathingEnabled] = useState(false);
  const [hapticSupported, setHapticSupported] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [completedDose, setCompletedDose] = useState<Dose | null>(null);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Check haptic support on mount
  useEffect(() => {
    setHapticSupported(hapticEngine.checkSupport());
  }, []);

  // Update phase based on elapsed time
  const updatePhase = useCallback((elapsed: number) => {
    const progress = elapsed / totalDuration;
    if (progress < 0.15) setPhase('onset');
    else if (progress < 0.4) setPhase('peak');
    else if (progress < 0.7) setPhase('sustain');
    else if (progress < 1) setPhase('comedown');
    else setPhase('complete');
  }, [totalDuration, setPhase]);

  // Timer effect
  useEffect(() => {
    if (isPlaying && currentDose) {
      timerRef.current = setInterval(() => {
        setElapsedTime(elapsedTime + 1);
        updatePhase(elapsedTime + 1);

        if (elapsedTime + 1 >= totalDuration) {
          // Store dose info before stopping
          setCompletedDose(currentDose);
          setCompletedDuration(totalDuration);
          
          stopTrip();
          
          const journalData = {
            doseId: currentDose.id,
            doseName: currentDose.name,
            mood: [],
            intensity: intensity,
            notes: '',
            duration: totalDuration,
          };
          
          // Add to local store
          addJournalEntry(journalData);
          
          // Sync to database if logged in
          if (user) {
            syncJournalEntry(user.id, journalData);
            setShowRating(true);
          }
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, elapsedTime, totalDuration, currentDose, setElapsedTime, updatePhase, stopTrip, addJournalEntry, intensity, user]);

  // Audio effect
  useEffect(() => {
    if (isPlaying && currentDose) {
      audioEngine.playBinauralBeat(currentDose.frequencies, volume);
    } else {
      audioEngine.stopAll();
    }

    return () => {
      audioEngine.stopAll();
    };
  }, [isPlaying, currentDose, volume]);

  // Haptic vibration effect - synced with binaural beat
  useEffect(() => {
    if (isPlaying && hapticEnabled && hapticSupported && currentDose) {
      const beatFreq = currentDose.frequencies[0]?.beatFreq || 10;
      hapticEngine.setEnabled(true);
      hapticEngine.startRhythmic(beatFreq, intensity);
    } else {
      hapticEngine.stop();
    }

    return () => {
      hapticEngine.stop();
    };
  }, [isPlaying, hapticEnabled, hapticSupported, currentDose, intensity]);

  // Phase-based haptic feedback
  useEffect(() => {
    if (hapticEnabled && hapticSupported) {
      hapticEngine.phasePattern(phase, intensity);
    }
  }, [phase, hapticEnabled, hapticSupported, intensity]);

  // Toggle haptic
  const toggleHaptic = () => {
    const newState = !hapticEnabled;
    setHapticEnabled(newState);
    hapticEngine.setEnabled(newState);
    if (!newState) {
      hapticEngine.stop();
    }
  };

  // Update audio intensity
  useEffect(() => {
    audioEngine.setIntensity(intensity);
  }, [intensity]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      hideControlsRef.current = setTimeout(() => {
        toggleControls();
      }, 5000);
    }

    return () => {
      if (hideControlsRef.current) clearTimeout(hideControlsRef.current);
    };
  }, [showControls, isPlaying, toggleControls]);

  const handleScreenClick = () => {
    toggleControls();
  };

  if (!currentDose) return null;

  const progress = (elapsedTime / totalDuration) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
      onClick={handleScreenClick}
    >
      {/* Visual Background */}
      <VisualRenderer
        type={currentVisual}
        intensity={intensity}
        colors={currentDose.colors}
      />

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 pointer-events-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{currentDose.name}</h2>
                  <p className="text-sm text-white/60">{currentDose.tagline}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={stopTrip}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Center Controls */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" />
                )}
              </motion.button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                  <span>{formatDuration(elapsedTime)}</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white font-medium">
                    {PHASE_LABELS[phase]}
                  </span>
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neuro-purple to-neuro-magenta"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Volume */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60">Volume</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-neuro-purple"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Intensity */}
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/60">Intensity</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={intensity}
                    onChange={(e) => setIntensity(parseInt(e.target.value))}
                    className="w-full accent-neuro-magenta"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              {/* Haptic & Breathing Controls */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Haptic Vibration Toggle */}
                {hapticSupported && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHaptic();
                    }}
                    className={`glass rounded-xl p-4 transition-all ${
                      hapticEnabled ? 'border border-neuro-magenta/50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hapticEnabled ? 'bg-neuro-magenta/20' : 'bg-white/10'}`}>
                        <Vibrate className={`w-5 h-5 ${hapticEnabled ? 'text-neuro-magenta' : 'text-white/60'}`} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-white">Haptic</p>
                        <p className="text-xs text-white/50">{hapticEnabled ? 'On' : 'Off'}</p>
                      </div>
                    </div>
                  </motion.button>
                )}

                {/* Breathing Guide Toggle */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBreathingEnabled(!breathingEnabled);
                  }}
                  className={`glass rounded-xl p-4 transition-all ${
                    breathingEnabled ? 'border border-neuro-cyan/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${breathingEnabled ? 'bg-neuro-cyan/20' : 'bg-white/10'}`}>
                      <Wind className={`w-5 h-5 ${breathingEnabled ? 'text-neuro-cyan' : 'text-white/60'}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">Breathing</p>
                      <p className="text-xs text-white/50">{breathingEnabled ? 'Guided' : 'Off'}</p>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Breathing Guide Component */}
              {breathingEnabled && (
                <div className="mb-4" onClick={(e) => e.stopPropagation()}>
                  <BreathingGuide
                    isActive={breathingEnabled}
                    onToggle={() => setBreathingEnabled(!breathingEnabled)}
                    intensity={intensity}
                    colors={currentDose?.colors}
                    compact={false}
                  />
                </div>
              )}

              {/* Hide Controls Button - Mobile */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleControls();
                }}
                className="w-full py-3 rounded-xl bg-white/10 text-white/60 text-sm font-medium hover:bg-white/15 transition-colors"
              >
                Hide Controls
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Always visible close button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          // Show early exit dialog if trip is not complete
          if (elapsedTime < totalDuration * 0.9) {
            setShowExitDialog(true);
          } else {
            stopTrip();
          }
        }}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </motion.button>

      {/* Early Exit Dialog */}
      <EarlyExitDialog
        isOpen={showExitDialog}
        doseId={currentDose?.id || ''}
        doseName={currentDose?.name || ''}
        elapsedTime={elapsedTime}
        onConfirmExit={() => {
          setShowExitDialog(false);
          stopTrip();
        }}
        onCancel={() => setShowExitDialog(false)}
      />

      {/* Tap hint */}
      {!showControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/30"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
          <span className="text-xs">Tap for controls</span>
        </motion.div>
      )}

      {/* Post-Trip Rating Dialog */}
      <AnimatePresence>
        {showRating && completedDose && (
          <PostTripRating
            dose={completedDose}
            duration={completedDuration}
            onClose={() => {
              setShowRating(false);
              setCompletedDose(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
