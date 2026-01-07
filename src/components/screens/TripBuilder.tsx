'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock, Zap, Music, Eye, Play, Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { VisualType } from '@/data/doses';
import PaywallModal from '@/components/ui/PaywallModal';

const FREQUENCY_PRESETS = [
  { id: 'delta', name: 'Delta (Deep Sleep)', baseFreq: 100, beatFreq: 2 },
  { id: 'theta', name: 'Theta (Meditation)', baseFreq: 200, beatFreq: 6 },
  { id: 'alpha', name: 'Alpha (Relaxation)', baseFreq: 300, beatFreq: 10 },
  { id: 'beta', name: 'Beta (Focus)', baseFreq: 350, beatFreq: 18 },
  { id: 'gamma', name: 'Gamma (Insight)', baseFreq: 400, beatFreq: 40 },
  { id: '174hz', name: '174Hz (Pain Relief)', baseFreq: 174, beatFreq: 0 },
  { id: '396hz', name: '396Hz (Liberation)', baseFreq: 396, beatFreq: 0 },
  { id: '432hz', name: '432Hz (Natural)', baseFreq: 432, beatFreq: 0 },
  { id: '528hz', name: '528Hz (Love)', baseFreq: 528, beatFreq: 0 },
  { id: '963hz', name: '963Hz (Crown)', baseFreq: 963, beatFreq: 0 },
];

const VISUAL_OPTIONS: { id: VisualType; name: string; icon: string }[] = [
  { id: 'mandala', name: 'Mandala Flow', icon: '🌀' },
  { id: 'particles', name: 'Particle Field', icon: '✨' },
  { id: 'fractals', name: 'Fractal Journey', icon: '🔮' },
  { id: 'chakra', name: 'Chakra Spirals', icon: '🧘' },
  { id: 'waves', name: 'Color Waves', icon: '🌊' },
  { id: 'breath', name: 'Minimal Breath', icon: '💫' },
  { id: 'tunnel', name: 'Hyperspace', icon: '🚀' },
  { id: 'cosmic', name: 'Cosmic Void', icon: '🌌' },
];

const MAX_CUSTOM_TRIPS = 5;

export default function TripBuilder() {
  const { isPremium, startTrip, addCustomTrip, customTrips } = useAppStore();
  const [showPaywall, setShowPaywall] = useState(false);
  const [tripName, setTripName] = useState('');
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(5);
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>(['theta']);
  const [selectedVisual, setSelectedVisual] = useState<VisualType>('mandala');
  
  const canCreateMore = customTrips.length < MAX_CUSTOM_TRIPS;

  const toggleFrequency = (id: string) => {
    setSelectedFrequencies((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleLaunchTrip = () => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }

    const frequencies = selectedFrequencies.map((id) => {
      const preset = FREQUENCY_PRESETS.find((p) => p.id === id);
      return {
        name: preset?.name || '',
        baseFreq: preset?.baseFreq || 200,
        beatFreq: preset?.beatFreq || 6,
        type: (preset?.beatFreq === 0 ? 'solfeggio' : 'binaural') as 'solfeggio' | 'binaural' | 'isochronic',
      };
    });

    const customDose = {
      id: `custom-${Date.now()}`,
      name: tripName || 'Custom Trip',
      slug: 'custom',
      tagline: 'Your personalized journey',
      description: 'A custom consciousness experience designed by you.',
      category: 'meditative' as const,
      frequencies,
      defaultDuration: duration * 60,
      intensity,
      visualType: selectedVisual,
      colors: ['#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'],
      effects: ['Custom Experience'],
      trialsRemaining: 999,
      isPremium: false,
    };

    addCustomTrip({
      name: tripName || 'Custom Trip',
      duration: duration * 60,
      intensity,
      frequencies: frequencies.map((f) => ({ baseFreq: f.baseFreq, beatFreq: f.beatFreq })),
      visualType: selectedVisual,
    });

    startTrip(customDose);
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen pb-32 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-neuro-purple" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Premium Feature</h2>
          <p className="text-white/50 mb-6 max-w-sm">
            Create personalized consciousness experiences with the Custom Trip Builder.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPaywall(true)}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-medium flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" />
            Unlock Premium
          </motion.button>
        </div>
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
          feature="Custom Trip Builder"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-1">
          <Wand2 className="w-8 h-8 text-neuro-purple" />
          <h1 className="text-3xl font-bold text-gradient">Trip Builder</h1>
        </div>
        <p className="text-white/50 text-sm">Design your perfect consciousness journey</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Trip Name */}
        <div className="glass rounded-2xl p-5">
          <label className="text-sm text-white/60 mb-3 block">Trip Name</label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="My Custom Journey"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50"
          />
        </div>

        {/* Duration */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Duration</span>
            <span className="ml-auto text-lg font-semibold">{duration} min</span>
          </div>
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full accent-neuro-purple"
          />
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>5 min</span>
            <span>180 min</span>
          </div>
        </div>

        {/* Intensity */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Intensity</span>
            <span className="ml-auto text-lg font-semibold">{intensity}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full accent-neuro-magenta"
          />
        </div>

        {/* Frequencies */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Frequencies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {FREQUENCY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => toggleFrequency(preset.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedFrequencies.includes(preset.id)
                    ? 'bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-white/60" />
            <span className="text-sm text-white/60">Visual Pattern</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {VISUAL_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedVisual(opt.id)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedVisual === opt.id
                    ? 'bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <span>{opt.icon}</span>
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Trips Count */}
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Saved Trips</span>
            <span className={`text-sm font-medium ${canCreateMore ? 'text-white' : 'text-amber-400'}`}>
              {customTrips.length}/{MAX_CUSTOM_TRIPS}
            </span>
          </div>
          {!canCreateMore && (
            <p className="text-xs text-amber-400/80 mt-2">
              Maximum trips reached. Delete a trip to create new ones.
            </p>
          )}
        </div>

        {/* Launch Button */}
        <motion.button
          whileHover={{ scale: canCreateMore ? 1.02 : 1 }}
          whileTap={{ scale: canCreateMore ? 0.98 : 1 }}
          onClick={handleLaunchTrip}
          disabled={!canCreateMore}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            canCreateMore 
              ? 'bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <Play className="w-5 h-5" />
          {canCreateMore ? 'Launch Trip' : 'Trip Limit Reached'}
        </motion.button>
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Custom Trip Builder"
      />
    </div>
  );
}
