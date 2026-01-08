'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { DOSES, CATEGORIES, Dose, DoseCategory } from '@/data/doses';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/context/AuthContext';
import { claimGlobalTrial } from '@/lib/supabase';
import DoseCard from '@/components/ui/DoseCard';
import PaywallModal from '@/components/ui/PaywallModal';
import SuggestCard from '@/components/ui/SuggestCard';
import AuthModal from '@/components/ui/AuthModal';
import PreTripCountdown from '@/components/ui/PreTripCountdown';

export default function Dispensary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DoseCategory | 'all'>('all');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [countdownDose, setCountdownDose] = useState<Dose | null>(null);
  const { startTrip, isPremium } = useAppStore();
  const { user } = useAuth();

  const filteredDoses = DOSES.filter((dose) => {
    const matchesSearch = dose.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dose.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dose.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectDose = async (dose: Dose) => {
    // Show pre-trip countdown animation
    setCountdownDose(dose);
  };

  const handleCountdownComplete = async () => {
    if (!countdownDose || !user) return;
    
    if (!isPremium) {
      await claimGlobalTrial(countdownDose.id, user.id);
    }
    
    startTrip(countdownDose);
    setCountdownDose(null);
  };

  const handleCountdownCancel = () => {
    setCountdownDose(null);
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-neuro-deep/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 pt-12 pb-4">
          <h1 className="text-3xl font-bold text-gradient mb-1">Dispensary</h1>
          <p className="text-white/50 text-sm">Choose your consciousness journey</p>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 transition-colors"
              suppressHydrationWarning
            />
          </div>
        </div>

        {/* Categories - Mobile Friendly */}
        <div className="relative">
          <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white shadow-lg shadow-neuro-purple/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                All Doses
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? 'text-white shadow-lg'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                  style={{
                    background: selectedCategory === cat.id ? `${cat.color}30` : undefined,
                    boxShadow: selectedCategory === cat.id ? `0 4px 15px ${cat.color}40` : undefined,
                  }}
                >
                  <span>{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Scroll fade indicator */}
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-neuro-deep to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Dose Grid */}
      <div className="px-4 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoses.map((dose, i) => (
            <motion.div
              key={dose.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <DoseCard 
                dose={dose} 
                onSelect={handleSelectDose} 
                onRequireAuth={() => setShowAuth(true)}
              />
            </motion.div>
          ))}
          
          {/* Suggest Drug Card - Always show at end */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredDoses.length * 0.05 }}
          >
            <SuggestCard 
              type="drug" 
              category={selectedCategory !== 'all' ? CATEGORIES.find(c => c.id === selectedCategory)?.name : undefined} 
            />
          </motion.div>

          {/* Suggest Visual Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (filteredDoses.length + 1) * 0.05 }}
          >
            <SuggestCard type="visual" />
          </motion.div>
        </div>

        {filteredDoses.length === 0 && (
          <div className="text-center py-12 mb-4">
            <p className="text-white/40 mb-4">No experiences found in this category yet</p>
            <p className="text-white/60 text-sm">Be the first to suggest one! 👇</p>
          </div>
        )}
      </div>

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        feature="Premium Doses"
      />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Pre-Trip Countdown */}
      <AnimatePresence>
        {countdownDose && (
          <PreTripCountdown
            dose={countdownDose}
            onComplete={handleCountdownComplete}
            onCancel={handleCountdownCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
