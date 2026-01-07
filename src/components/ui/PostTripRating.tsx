'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, X, Send, Loader2 } from 'lucide-react';
import { Dose } from '@/data/doses';
import { useAuth } from '@/context/AuthContext';
import { submitTripRating, submitTestimonial } from '@/lib/supabase';

interface PostTripRatingProps {
  dose: Dose;
  duration: number;
  onClose: () => void;
}

export default function PostTripRating({ dose, duration, onClose }: PostTripRatingProps) {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<'rating' | 'testimonial' | 'complete'>('rating');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');
  const [testimonial, setTestimonial] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitRating = async () => {
    if (!user || rating === 0) return;
    
    setLoading(true);
    await submitTripRating(
      user.id,
      dose.id,
      rating,
      feedback || undefined,
      wouldRecommend ?? undefined
    );
    setLoading(false);
    setStep('testimonial');
  };

  const handleSubmitTestimonial = async () => {
    if (!user || !testimonial.trim()) {
      setStep('complete');
      return;
    }

    setLoading(true);
    await submitTestimonial(
      user.id,
      profile?.full_name || 'Anonymous Explorer',
      testimonial,
      rating,
      dose.id
    );
    setLoading(false);
    setStep('complete');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md glass rounded-3xl p-6 border border-white/20 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        <AnimatePresence mode="wait">
          {/* Rating Step */}
          {step === 'rating' && (
            <motion.div
              key="rating"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${dose.colors[0]}30` }}
                >
                  <span className="text-3xl">✨</span>
                </div>
                <h2 className="text-xl font-bold text-white">Journey Complete!</h2>
                <p className="text-white/60 text-sm mt-1">
                  {dose.name} • {formatDuration(duration)}
                </p>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <p className="text-sm text-white/60 text-center mb-3">How was your experience?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-white/30'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Would Recommend */}
              <div className="mb-6">
                <p className="text-sm text-white/60 text-center mb-3">Would you recommend this?</p>
                <div className="flex justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWouldRecommend(true)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      wouldRecommend === true
                        ? 'bg-green-500/30 border border-green-500/50 text-green-400'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Yes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWouldRecommend(false)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                      wouldRecommend === false
                        ? 'bg-red-500/30 border border-red-500/50 text-red-400'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    No
                  </motion.button>
                </div>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <textarea
                  placeholder="Any feedback? (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 resize-none text-sm"
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitRating}
                disabled={rating === 0 || loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Continue'
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Testimonial Step */}
          {step === 'testimonial' && (
            <motion.div
              key="testimonial"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-neuro-purple/30 to-neuro-magenta/30">
                  <span className="text-3xl">💬</span>
                </div>
                <h2 className="text-xl font-bold text-white">Share Your Experience</h2>
                <p className="text-white/60 text-sm mt-1">
                  Help others discover amazing journeys
                </p>
              </div>

              <div className="mb-6">
                <textarea
                  placeholder="Tell us about your journey... What did you experience? How did it make you feel?"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 resize-none"
                />
                <p className="text-xs text-white/40 mt-2">
                  Your testimonial may be featured on our landing page (with your approval)
                </p>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('complete')}
                  className="flex-1 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors"
                >
                  Skip
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitTestimonial}
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-green-500/30 to-emerald-500/30"
              >
                <span className="text-4xl">🙏</span>
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Thank You!</h2>
              <p className="text-white/60 text-sm mb-6">
                Your feedback helps us improve the experience
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold"
              >
                Done
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
