'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, X, Volume2, Check } from 'lucide-react';

interface HeadphonePromptProps {
  onConfirm?: () => void;
  showOnMount?: boolean;
}

export default function HeadphonePrompt({ onConfirm, showOnMount = false }: HeadphonePromptProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    // Check if user has already confirmed headphones in this session
    const confirmed = sessionStorage.getItem('headphones-confirmed');
    if (confirmed) {
      setHasConfirmed(true);
    } else if (showOnMount) {
      // Show prompt after a short delay
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [showOnMount]);

  const handleConfirm = () => {
    sessionStorage.setItem('headphones-confirmed', 'true');
    setHasConfirmed(true);
    setIsOpen(false);
    onConfirm?.();
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  // Don't render if already confirmed
  if (hasConfirmed && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm glass rounded-3xl p-6 border border-white/20 text-center"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 flex items-center justify-center mx-auto mb-6"
            >
              <Headphones className="w-12 h-12 text-neuro-purple" />
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-3">
              🎧 Connect Headphones
            </h2>

            {/* Description */}
            <p className="text-white/70 mb-6">
              For the <span className="text-neuro-cyan font-semibold">best experience</span>, please use stereo headphones. Binaural beats require different frequencies in each ear to work properly.
            </p>

            {/* Audio Wave Animation */}
            <div className="flex items-center justify-center gap-1 mb-6">
              {[...Array(7)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-neuro-purple to-neuro-magenta rounded-full"
                  animate={{
                    height: [8, 24, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                I'm wearing headphones
              </motion.button>

              <button
                onClick={handleSkip}
                className="w-full py-3 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
              >
                Continue without (not recommended)
              </button>
            </div>

            {/* Warning */}
            <p className="mt-4 text-xs text-amber-400/80">
              ⚠️ Speakers won't produce the binaural effect
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to trigger headphone prompt
export function useHeadphonePrompt() {
  const [shouldShow, setShouldShow] = useState(false);

  const showPrompt = () => {
    const confirmed = sessionStorage.getItem('headphones-confirmed');
    if (!confirmed) {
      setShouldShow(true);
    }
  };

  const hidePrompt = () => setShouldShow(false);

  return { shouldShow, showPrompt, hidePrompt };
}
