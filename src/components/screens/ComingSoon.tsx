'use client';

import { motion } from 'framer-motion';
import { 
  Brain, Watch, Palette, Mic, BookOpen, 
  Sparkles, Lock, Bell, ChevronRight,
  Headphones, Wand2, Heart, Zap
} from 'lucide-react';

const AI_FEATURES = [
  {
    id: 'ai-curator',
    icon: Brain,
    title: 'AI Trip Curator',
    description: 'GPT-powered chatbot asks your mood & goals, then recommends the perfect dose combo tailored to you.',
    status: 'Coming Q2 2024',
    tier: 'Premium',
    color: '#8b5cf6',
    preview: [
      '"I want to focus for 4 hours straight"',
      '"Help me sleep deeply tonight"',
      '"I need creative inspiration"',
    ],
  },
  {
    id: 'biometric',
    icon: Watch,
    title: 'Biometric Adaptation',
    description: 'Connect Apple Watch or Fitbit. AI adjusts frequencies in real-time based on your HRV, heart rate, and stress levels.',
    status: 'Coming Q3 2024',
    tier: 'Premium+',
    color: '#ec4899',
    preview: [
      'Real-time heart rate sync',
      'HRV-based intensity adjustment',
      'Sleep stage detection',
    ],
  },
  {
    id: 'visual-gen',
    icon: Palette,
    title: 'AI Visual Generator',
    description: 'Describe your ideal trip visuals in words. Our AI generates custom WebGL shaders and patterns just for you.',
    status: 'Coming Q2 2024',
    tier: 'Premium',
    color: '#f59e0b',
    preview: [
      '"Flowing liquid gold fractals"',
      '"Deep ocean bioluminescence"',
      '"Aurora borealis in space"',
    ],
  },
  {
    id: 'voice-guide',
    icon: Mic,
    title: 'Voice-Guided Sessions',
    description: 'AI-generated voice narration personalized with your name, goals, and preferences. Powered by ElevenLabs.',
    status: 'Coming Q3 2024',
    tier: 'Premium',
    color: '#06b6d4',
    preview: [
      'Personalized guided meditations',
      'Breathing exercise prompts',
      'Journey narration',
    ],
  },
  {
    id: 'dream-analyzer',
    icon: BookOpen,
    title: 'Dream Journal Analyzer',
    description: 'AI analyzes your trip journals, detects patterns in your experiences, and suggests optimized doses for your goals.',
    status: 'Coming Q4 2024',
    tier: 'Premium',
    color: '#10b981',
    preview: [
      'Pattern recognition',
      'Mood trend analysis',
      'Personalized recommendations',
    ],
  },
];

const ADDITIONAL_FEATURES = [
  { icon: Headphones, title: 'Spatial Audio', description: 'Dolby Atmos 3D binaural soundscapes' },
  { icon: Wand2, title: 'AR Visual Mode', description: 'Project visuals into your room' },
  { icon: Heart, title: 'Group Trips', description: 'Synchronized sessions with friends' },
  { icon: Zap, title: 'EEG Integration', description: 'Brain-computer interface support' },
];

export default function ComingSoon() {
  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-8 h-8 text-amber-400" />
          <h1 className="text-3xl font-bold text-gradient">Coming Soon</h1>
        </div>
        <p className="text-white/50 text-sm">AI-powered features on the horizon</p>
      </div>

      {/* Notify Banner */}
      <div className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 border border-neuro-purple/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neuro-purple/20">
            <Bell className="w-5 h-5 text-neuro-purple" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-sm">Get Early Access</h3>
            <p className="text-xs text-white/60">Premium members get beta access to new features first</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </div>
      </div>

      {/* AI Features */}
      <div className="px-4 space-y-4">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
          5 AI-Powered Features
        </h2>
        
        {AI_FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 border border-white/10"
              style={{ borderColor: `${feature.color}20` }}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${feature.color}20`,
                        color: feature.color 
                      }}
                    >
                      {feature.tier}
                    </span>
                  </div>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </div>

              {/* Preview Examples */}
              <div className="space-y-2 mb-4">
                {feature.preview.map((example, j) => (
                  <div 
                    key={j}
                    className="flex items-center gap-2 text-xs text-white/50"
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: feature.color }}
                    />
                    {example}
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">{feature.status}</span>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5">
                  <Lock className="w-3 h-3 text-white/40" />
                  <span className="text-xs text-white/40">Premium Required</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Features */}
      <div className="px-4 mt-8">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
          Also Coming
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {ADDITIONAL_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-white/60" />
                </div>
                <h4 className="font-medium text-white text-sm mb-1">{feature.title}</h4>
                <p className="text-xs text-white/40">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-8">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Be the First to Know</h3>
          <p className="text-sm text-white/60 mb-4">
            Upgrade to Premium and get exclusive early access to all new AI features
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold"
          >
            Unlock Premium
          </motion.button>
        </div>
      </div>
    </div>
  );
}
