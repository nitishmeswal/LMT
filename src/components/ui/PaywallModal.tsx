'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles, Crown, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    features: [
      'All premium doses',
      'Custom Trip Builder',
      '90-minute sessions',
      'All visual patterns',
      'No ads',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Plus',
    price: 19.99,
    period: 'month',
    features: [
      'Everything in Basic',
      'EEG Integration',
      'Biometric sync',
      'Spatial audio',
      'AR Visual mode',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49.99,
    period: 'month',
    features: [
      'Everything in Premium',
      'Therapist dashboard',
      'Client session export',
      'Multi-user support',
      'API access',
      'White-label option',
    ],
    popular: false,
  },
];

export default function PaywallModal({ isOpen, onClose, feature }: PaywallModalProps) {
  const { setPremium } = useAppStore();

  const handleSubscribe = (planId: string) => {
    // In production, this would integrate with Stripe
    setPremium(true);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-3xl p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Unlock Full Experience</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Choose Your Journey</h2>
              {feature && (
                <p className="text-white/60">
                  <span className="text-neuro-purple">{feature}</span> is a Premium feature
                </p>
              )}
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {PLANS.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-2xl p-5 border transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-b from-neuro-purple/20 to-neuro-magenta/20 border-neuro-purple/50'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-neuro-purple to-neuro-magenta text-xs font-bold">
                      MOST POPULAR
                    </div>
                  )}

                  <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/50">/{plan.period}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 rounded-xl font-medium transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    Start Free Trial
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-white/40">
              7-day free trial • Cancel anytime • Secure payment via Stripe
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
