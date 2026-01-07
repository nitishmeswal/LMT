'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles, Send, Palette, Music, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { submitSuggestion } from '@/lib/supabase';

interface SuggestCardProps {
  type: 'drug' | 'visual';
  category?: string;
}

export default function SuggestCard({ type, category }: SuggestCardProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!suggestion.trim()) return;
    setIsSubmitting(true);
    setError('');
    
    try {
      const success = await submitSuggestion(
        user?.id || null,
        type,
        suggestion,
        category
      );
      
      if (success) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setSuggestion('');
        }, 2000);
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Icon = type === 'drug' ? Music : Palette;
  const title = type === 'drug' ? 'Suggest a Dose' : 'Suggest a Visual';
  const placeholder = type === 'drug' 
    ? `Describe your ideal ${category || 'binaural'} experience...`
    : 'Describe your dream visual pattern...';
  const categoryLabel = category ? `for ${category}` : '';

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="relative glass rounded-2xl p-5 cursor-pointer transition-all duration-300 border border-dashed border-white/20 hover:border-neuro-purple/50 min-h-[200px] flex flex-col items-center justify-center gap-3"
      >
        <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 flex items-center justify-center">
          <Plus className="w-7 h-7 text-neuro-purple" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-white/50">
            {type === 'drug' 
              ? `Help us create new ${category || ''} experiences`
              : 'Describe visuals, AI generates them'}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-neuro-purple/20 text-neuro-purple text-xs font-medium">
          Submit Idea
        </span>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-3xl p-6 border border-white/20"
            >
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Thanks!</h3>
                  <p className="text-white/60">Your suggestion has been submitted. We'll review it soon!</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-neuro-purple" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                        <p className="text-xs text-white/60">{categoryLabel || 'Help shape the future'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-white/60 mb-2 block">Your Suggestion</label>
                      <textarea
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 resize-none"
                      />
                    </div>

                    {type === 'visual' && (
                      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span className="text-sm font-semibold text-amber-400">AI Visual Generator</span>
                        </div>
                        <p className="text-xs text-white/60">
                          In the future, AI will generate custom WebGL shaders from your description. 
                          For now, our team will review and create visuals based on popular suggestions!
                        </p>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmit}
                      disabled={!suggestion.trim() || isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Suggestion
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
