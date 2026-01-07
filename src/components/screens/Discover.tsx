'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, Target, Brain, Heart, Zap, Moon, Sun, 
  Sparkles, ChevronRight, Lightbulb, Flame, Wind
} from 'lucide-react';
import { DOSES, Dose } from '@/data/doses';
import { useAppStore } from '@/store/useAppStore';
import BiometricCard from '@/components/ui/BiometricCard';
import SuggestCard from '@/components/ui/SuggestCard';

const GOALS = [
  { id: 'focus', icon: Target, label: 'Deep Focus', color: '#3b82f6', description: 'Lock in and get things done' },
  { id: 'creativity', icon: Lightbulb, label: 'Creative Flow', color: '#f59e0b', description: 'Unlock artistic potential' },
  { id: 'relax', icon: Wind, label: 'Deep Relaxation', color: '#10b981', description: 'Melt away stress' },
  { id: 'sleep', icon: Moon, label: 'Better Sleep', color: '#6366f1', description: 'Drift into deep rest' },
  { id: 'energy', icon: Flame, label: 'Energy Boost', color: '#ef4444', description: 'Ignite your motivation' },
  { id: 'spiritual', icon: Sparkles, label: 'Spiritual Journey', color: '#8b5cf6', description: 'Explore consciousness' },
  { id: 'love', icon: Heart, label: 'Self Love', color: '#ec4899', description: 'Connect with yourself' },
  { id: 'clarity', icon: Brain, label: 'Mental Clarity', color: '#06b6d4', description: 'Clear the fog' },
];

const GOAL_DOSE_MAP: Record<string, string[]> = {
  focus: ['adderall', 'caffeine', 'meditation'],
  creativity: ['lsd', 'cannabis', 'psilocybin'],
  relax: ['cannabis', 'kratom', 'meditation'],
  sleep: ['ambien', 'meditation', 'cannabis'],
  energy: ['caffeine', 'runners-high', 'adderall'],
  spiritual: ['dmt', 'ayahuasca', 'psilocybin', 'mescaline'],
  love: ['mdma', 'meditation', '2cb'],
  clarity: ['meditation', 'psilocybin', 'lsd'],
};

export default function Discover() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { startTrip, isPremium, decrementTrial, getTrialsRemaining } = useAppStore();

  const recommendedDoses = selectedGoal 
    ? GOAL_DOSE_MAP[selectedGoal]?.map(id => DOSES.find(d => d.id === id)).filter(Boolean) as Dose[]
    : [];

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setShowResult(true);
  };

  const handleStartDose = (dose: Dose) => {
    const trialsRemaining = getTrialsRemaining(dose.id);
    if (!isPremium && dose.isPremium && trialsRemaining <= 0) {
      // Would show paywall
      return;
    }
    if (!isPremium && dose.isPremium) {
      decrementTrial(dose.id);
    }
    startTrip(dose);
  };

  const selectedGoalData = GOALS.find(g => g.id === selectedGoal);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Compass className="w-8 h-8 text-neuro-cyan" />
          <h1 className="text-3xl font-bold text-gradient">Find Your State</h1>
        </div>
        <p className="text-white/50 text-sm">Tell us your goal, we'll guide your journey</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400">AI CURATOR COMING SOON</span>
        </div>
        <p className="text-xs text-white/60">
          Our AI will learn your preferences and create personalized dose stacks. For now, explore our curated recommendations!
        </p>
      </div>

      {/* Goal Selection */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="goals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="px-4"
          >
            <h2 className="text-lg font-semibold text-white mb-4">What's your intention today?</h2>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((goal, i) => {
                const Icon = goal.icon;
                return (
                  <motion.button
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleGoalSelect(goal.id)}
                    className="p-4 glass rounded-2xl text-left hover:border-white/20 transition-all group"
                    style={{ borderColor: `${goal.color}20` }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${goal.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: goal.color }} />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{goal.label}</h3>
                    <p className="text-xs text-white/50">{goal.description}</p>
                    <ChevronRight 
                      className="w-4 h-4 absolute top-4 right-4 text-white/20 group-hover:text-white/40 transition-colors" 
                    />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="px-4"
          >
            {/* Back Button */}
            <button
              onClick={() => setShowResult(false)}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-sm">Choose different goal</span>
            </button>

            {/* Selected Goal Header */}
            {selectedGoalData && (
              <div className="flex items-center gap-4 mb-6 p-4 glass rounded-2xl" 
                style={{ borderColor: `${selectedGoalData.color}30` }}>
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedGoalData.color}20` }}
                >
                  <selectedGoalData.icon className="w-7 h-7" style={{ color: selectedGoalData.color }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedGoalData.label}</h2>
                  <p className="text-sm text-white/60">{selectedGoalData.description}</p>
                </div>
              </div>
            )}

            {/* Recommended Doses */}
            <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
              Recommended for you
            </h3>
            <div className="space-y-3">
              {recommendedDoses.map((dose, i) => (
                <motion.div
                  key={dose.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-4 flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `linear-gradient(135deg, ${dose.colors[0]}20, ${dose.colors[1] || dose.colors[0]}20)` }}
                  >
                    {dose.category === 'psychedelic' ? '🍄' : 
                     dose.category === 'euphoric' ? '✨' :
                     dose.category === 'meditative' ? '🧘' :
                     dose.category === 'focus' ? '🎯' : '💫'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{dose.name}</h4>
                    <p className="text-xs text-white/50">{dose.tagline}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStartDose(dose)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white"
                  >
                    Try
                  </motion.button>
                </motion.div>
              ))}
            </div>

            {/* AI Feature Coming Soon */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-neuro-purple/10 to-neuro-magenta/10 border border-neuro-purple/20 text-center">
              <Brain className="w-10 h-10 text-neuro-purple mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-2">AI Trip Curator</h3>
              <p className="text-sm text-white/60 mb-4">
                Coming soon: Our AI will analyze your journal, mood, and biometrics to create the perfect personalized dose stack.
              </p>
              <span className="px-4 py-2 rounded-full bg-neuro-purple/20 text-neuro-purple text-sm font-medium">
                Premium Feature
              </span>
            </div>

            {/* Biometric Sync */}
            <div className="mt-6">
              <BiometricCard />
            </div>

            {/* Suggest Features */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <SuggestCard type="drug" />
              <SuggestCard type="visual" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
