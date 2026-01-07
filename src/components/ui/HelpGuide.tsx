'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Headphones, Eye, Wind, Brain, ChevronRight, ChevronLeft, Check, Sparkles, MessageCircle, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { submitSupportRequest } from '@/lib/supabase';

const GUIDE_STEPS = [
  {
    id: 1,
    icon: Headphones,
    title: 'Put On Headphones',
    description: 'Binaural beats REQUIRE stereo headphones to work. Each ear receives a slightly different frequency, and your brain perceives the difference as the "beat".',
    tip: 'Use over-ear headphones for best results. Earbuds work too!',
    color: '#8b5cf6',
  },
  {
    id: 2,
    icon: Eye,
    title: 'Close Your Eyes',
    description: 'Closing your eyes helps your brain focus on the audio frequencies and enhances the visual experience behind your eyelids.',
    tip: 'If keeping eyes open, dim the lights and focus softly on the visuals.',
    color: '#06b6d4',
  },
  {
    id: 3,
    icon: Wind,
    title: 'Deep Breathing',
    description: 'Take 5 deep breaths: Inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds. This activates your parasympathetic nervous system.',
    tip: 'Continue slow breathing throughout the session.',
    color: '#22c55e',
  },
  {
    id: 4,
    icon: Brain,
    title: 'Relax & Surrender',
    description: "Don't try to force the experience. Let go of expectations. The effects are subtle at first but build over 5-10 minutes.",
    tip: 'Set an intention before starting. What do you want from this session?',
    color: '#ec4899',
  },
  {
    id: 5,
    icon: Sparkles,
    title: 'Give It Time',
    description: 'Binaural beats need 10-15 minutes to entrain your brainwaves. The longer you listen, the deeper the effect.',
    tip: 'Try a full 30-minute session for best results!',
    color: '#f59e0b',
  },
];

interface HelpGuideProps {
  variant?: 'button' | 'floating';
}

export default function HelpGuide({ variant = 'floating' }: HelpGuideProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSupport, setShowSupport] = useState(false);
  const [supportEmail, setSupportEmail] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
    }
  };

  const handleSubmitSupport = async () => {
    if (!supportMessage.trim()) return;
    
    setSubmitting(true);
    const email = supportEmail || user?.email || 'anonymous@neuronirvana.app';
    const success = await submitSupportRequest(
      user?.id || null,
      email,
      supportMessage,
      'help_guide'
    );
    
    setSubmitting(false);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setShowSupport(false);
        setSubmitted(false);
        setSupportMessage('');
        setSupportEmail('');
      }, 2000);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = GUIDE_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <>
      {/* Trigger Button */}
      {variant === 'floating' ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 left-4 z-40 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium flex items-center gap-2 hover:bg-amber-500/30 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Can't feel the effect?
        </motion.button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="text-amber-400 text-sm flex items-center gap-1 hover:text-amber-300"
        >
          <HelpCircle className="w-4 h-4" />
          Need help?
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-3xl overflow-hidden border border-white/20"
            >
              {/* Progress Bar */}
              <div className="h-1 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-neuro-purple to-neuro-magenta"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / GUIDE_STEPS.length) * 100}%` }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-white/40">
                    Step {currentStep + 1} of {GUIDE_STEPS.length}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                      style={{ backgroundColor: `${step.color}20` }}
                    >
                      <StepIcon className="w-10 h-10" style={{ color: step.color }} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-white/70 mb-4 leading-relaxed">{step.description}</p>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-sm text-white/60">
                        💡 <span className="text-white/80">{step.tip}</span>
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="flex gap-1">
                    {GUIDE_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i === currentStep ? 'bg-neuro-purple' : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-medium"
                  >
                    {currentStep === GUIDE_STEPS.length - 1 ? (
                      <>
                        <Check className="w-4 h-4" />
                        Got it!
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Still Having Problems */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  {!showSupport ? (
                    <button
                      onClick={() => setShowSupport(true)}
                      className="w-full flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Still having problems? Write to us
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      {submitted ? (
                        <div className="text-center py-4">
                          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-green-400 font-medium">Message sent!</p>
                          <p className="text-white/50 text-sm">We'll get back to you soon.</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-white/60 text-center">
                            Describe your issue and we'll help you out
                          </p>
                          {!user && (
                            <input
                              type="email"
                              value={supportEmail}
                              onChange={(e) => setSupportEmail(e.target.value)}
                              placeholder="Your email"
                              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-neuro-purple/50"
                            />
                          )}
                          <textarea
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            placeholder="What's not working?"
                            rows={3}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowSupport(false)}
                              className="flex-1 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSubmitSupport}
                              disabled={submitting || !supportMessage.trim()}
                              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                              {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  Send
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
