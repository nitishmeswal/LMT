'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Frown, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { submitExitFeedback } from '@/lib/supabase';

interface EarlyExitDialogProps {
  isOpen: boolean;
  doseId: string;
  doseName: string;
  elapsedTime: number;
  onConfirmExit: () => void;
  onCancel: () => void;
}

const EXIT_REASONS = [
  { id: 'not-working', label: "It's not working for me" },
  { id: 'too-intense', label: 'Too intense' },
  { id: 'not-intense', label: 'Not intense enough' },
  { id: 'busy', label: 'Got interrupted / busy' },
  { id: 'other', label: 'Other reason' },
];

export default function EarlyExitDialog({
  isOpen,
  doseId,
  doseName,
  elapsedTime,
  onConfirmExit,
  onCancel,
}: EarlyExitDialogProps) {
  const { user } = useAuth();
  const [selectedReason, setSelectedReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Submit feedback to database
    if (selectedReason) {
      await submitExitFeedback(
        user?.id || null,
        doseId,
        doseName,
        elapsedTime,
        selectedReason,
        feedback
      );
    }
    
    setLoading(false);
    onConfirmExit();
  };

  const handleClose = () => {
    setSelectedReason('');
    setFeedback('');
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md glass rounded-3xl p-6 border border-white/20"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <Frown className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Leaving so soon?</h2>
              <p className="text-white/60 text-sm mt-1">
                You've only been on {doseName} for {formatTime(elapsedTime)}
              </p>
            </div>

            {/* Reason Selection */}
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-3">What went wrong?</p>
              <div className="space-y-2">
                {EXIT_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                      selectedReason === reason.id
                        ? 'bg-neuro-purple/30 border border-neuro-purple/50 text-white'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {reason.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {selectedReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <textarea
                  placeholder="Tell us more so we can improve... (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 resize-none text-sm"
                />
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
              >
                Continue Trip
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'End Trip'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
