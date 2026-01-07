'use client';

import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Zap, Brain, Users, Headphones } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    period: 'month',
    icon: Sparkles,
    color: '#8b5cf6',
    features: [
      'All 20 premium doses',
      'Custom Trip Builder',
      '90-minute sessions',
      'All 8 visual patterns',
      'Trip Journal',
      'No advertisements',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium Plus',
    price: 19.99,
    period: 'month',
    icon: Crown,
    color: '#f59e0b',
    features: [
      'Everything in Basic',
      'EEG headband integration',
      'Apple Watch biometrics',
      'Spatial audio (Dolby Atmos)',
      'AR visual mode',
      'AI Trip Curator',
      'Voice-guided sessions',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49.99,
    period: 'month',
    icon: Brain,
    color: '#06b6d4',
    features: [
      'Everything in Premium',
      'Therapist dashboard',
      'Client session export',
      'Multi-user support (10)',
      'Custom branding',
      'API access',
      'Analytics dashboard',
      'Dedicated account manager',
    ],
    popular: false,
  },
];

const FEATURES = [
  {
    icon: Headphones,
    title: 'Real Binaural Beats',
    description: 'Scientifically-tuned frequencies generated in real-time using Web Audio API',
  },
  {
    icon: Zap,
    title: 'GPU-Accelerated Visuals',
    description: 'Stunning WebGL shaders that respond to your session intensity',
  },
  {
    icon: Brain,
    title: 'AI-Powered Curation',
    description: 'Get personalized dose recommendations based on your mood and goals',
  },
  {
    icon: Users,
    title: 'Community Trips',
    description: 'Join synchronized group sessions with friends (coming soon)',
  },
];

export default function Premium() {
  const { isPremium, setPremium } = useAppStore();

  const handleSubscribe = (planId: string) => {
    // In production, integrate with Stripe
    setPremium(true);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-4 pt-12 pb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 flex items-center justify-center mx-auto mb-4"
        >
          <Crown className="w-10 h-10 text-amber-400" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {isPremium ? 'You\'re Premium!' : 'Unlock Your Mind'}
        </h1>
        <p className="text-white/50 max-w-md mx-auto">
          {isPremium
            ? 'Thank you for supporting NeuroNirvana. Enjoy unlimited access to all features.'
            : 'Get unlimited access to all doses, custom trip builder, and advanced features.'}
        </p>
      </div>

      {/* Current Status */}
      {isPremium && (
        <div className="px-4 mb-8">
          <div className="glass rounded-2xl p-6 text-center border border-amber-500/30">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-white mb-1">Premium Active</h3>
            <p className="text-sm text-white/60">All features unlocked</p>
          </div>
        </div>
      )}

      {/* Plans */}
      {!isPremium && (
        <div className="px-4 mb-8">
          <div className="space-y-4">
            {PLANS.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative glass rounded-2xl p-5 border transition-all ${
                    plan.popular
                      ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/5'
                      : 'border-white/10'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-bold text-black">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: plan.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-bold text-white">${plan.price}</span>
                        <span className="text-white/50">/{plan.period}</span>
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {plan.features.slice(0, 4).map((feature, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 4 && (
                          <li className="text-sm text-white/50">
                            +{plan.features.length - 4} more features
                          </li>
                        )}
                      </ul>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSubscribe(plan.id)}
                        className={`w-full py-3 rounded-xl font-medium transition-all ${
                          plan.popular
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Start 7-Day Free Trial
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="px-4">
        <h2 className="text-xl font-semibold text-white mb-4">What You Get</h2>
        <div className="grid gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="glass rounded-xl p-4 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-neuro-purple/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-neuro-purple" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 mt-8 text-center">
        <p className="text-xs text-white/40">
          7-day free trial • Cancel anytime • Secure payment via Stripe
        </p>
      </div>
    </div>
  );
}
