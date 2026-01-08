'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Lock, Sparkles, Info, X, Users } from 'lucide-react';
import { Dose, CATEGORIES } from '@/data/doses';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/context/AuthContext';
import { useTrialCount } from '@/hooks/useTrialCount';
import { cn } from '@/lib/utils';

interface DoseCardProps {
  dose: Dose;
  onSelect: (dose: Dose) => void;
  onRequireAuth: () => void;
}

export default function DoseCard({ dose, onSelect, onRequireAuth }: DoseCardProps) {
  const { isPremium } = useAppStore();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const { getTrialCount, isLoading: loadingTrials } = useTrialCount();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const doseTrialCount = mounted ? getTrialCount(dose.id) : 420;
  const category = CATEGORIES.find(c => c.id === dose.category);
  const isPromoActive = doseTrialCount > 0;
  const isLocked = dose.isPremium && !isPremium && !isPromoActive;
  
  const borderImagePath = `/assets/${dose.id}-border.png`;
  
  const handleExperience = () => {
    if (isLocked) return;
    
    if (!user) {
      onRequireAuth();
      return;
    }
    
    onSelect(dose);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExperience}
      className={cn(
        "relative glass rounded-2xl p-5 cursor-pointer transition-all duration-300",
        "border border-white/10 hover:border-white/20",
        "bg-gradient-to-br from-white/5 to-white/0",
        isLocked && "opacity-60 cursor-not-allowed"
      )}
      style={{
        boxShadow: `0 0 40px ${dose.colors[0]}15`,
      }}
    >
      {mounted && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
          style={{
            backgroundImage: `url(${borderImagePath})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6,
          }}
        />
      )}
      
      <div className="relative z-20">
        <div className="absolute top-0 right-0 flex items-center gap-2">
          {dose.isPremium && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">Premium</span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowInfo(true);
            }}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Info className="w-4 h-4 text-white/60" />
          </button>
        </div>

        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
          style={{ backgroundColor: `${category?.color}20` }}
        >
          {category?.icon}
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">{dose.name}</h3>
        <p className="text-sm text-white/50 mb-3">{dose.tagline}</p>

        <p className="text-sm text-white/70 mb-4 line-clamp-2">{dose.description}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-white/60">
            <Clock className="w-4 h-4" />
            <span className="text-xs">{formatDuration(dose.defaultDuration)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Zap className="w-4 h-4" />
            <span className="text-xs">Intensity {dose.intensity}/10</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {dose.frequencies.slice(0, 2).map((freq, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/70"
            >
              {freq.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!mounted || loadingTrials ? (
              <>
                <Users className="w-4 h-4 text-amber-400/50 animate-pulse" />
                <span className="text-xs font-medium text-amber-400/50">
                  Loading...
                </span>
              </>
            ) : isPromoActive ? (
              <>
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">
                  {doseTrialCount}/420 free globally
                </span>
              </>
            ) : isLocked ? (
              <>
                <Lock className="w-4 h-4 text-white/40" />
                <span className="text-xs text-white/40">Promo ended</span>
              </>
            ) : (
              <span className="text-xs text-white/50">Ready to experience</span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleExperience();
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              isLocked
                ? "bg-white/10 text-white/40"
                : "bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white"
            )}
          >
            {isLocked ? 'Locked' : 'Experience'}
          </motion.button>
        </div>

        <div 
          className="absolute -bottom-5 left-4 right-4 h-0.5 rounded-full opacity-50"
          style={{ 
            background: `linear-gradient(90deg, ${dose.colors[0]}, ${dose.colors[1] || dose.colors[0]})` 
          }}
        />
      </div>

      {mounted && showInfo && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-3xl p-6 border border-white/20 max-h-[85vh] overflow-y-auto"
              style={{ boxShadow: `0 0 100px ${dose.colors[0]}50, 0 0 40px ${dose.colors[0]}30` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${category?.color}20` }}
                  >
                    {category?.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{dose.name}</h3>
                    <p className="text-sm text-white/60">{dose.tagline}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-white/80 mb-6 leading-relaxed">{dose.description}</p>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white/60 mb-2 uppercase tracking-wider">What to Expect</h4>
                <div className="flex flex-wrap gap-2">
                  {dose.effects.map((effect, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-white/10 text-white/80">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-neuro-purple/10 to-neuro-magenta/10 border border-neuro-purple/20">
                <h4 className="text-sm font-semibold text-neuro-purple mb-2">The Science</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  This experience uses {dose.frequencies.length} frequency layer{dose.frequencies.length > 1 ? 's' : ''} including {dose.frequencies[0].name} to guide your brainwaves into the desired state. 
                  Binaural beats work by playing slightly different frequencies in each ear, creating a perceived "beat" that entrains your brain.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-white/60" />
                  <p className="text-lg font-bold text-white">{formatDuration(dose.defaultDuration)}</p>
                  <p className="text-xs text-white/40">Duration</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-white/60" />
                  <p className="text-lg font-bold text-white">{dose.intensity}/10</p>
                  <p className="text-xs text-white/40">Intensity</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-white/5">
                  <Sparkles className="w-5 h-5 mx-auto mb-1 text-white/60" />
                  <p className="text-lg font-bold text-white">{dose.visualType}</p>
                  <p className="text-xs text-white/40">Visual</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInfo(false);
                  handleExperience();
                }}
                disabled={isLocked}
                className={cn(
                  "w-full py-4 rounded-xl font-semibold transition-all",
                  isLocked
                    ? "bg-white/10 text-white/40 cursor-not-allowed"
                    : "bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white hover:shadow-lg hover:shadow-neuro-purple/30"
                )}
              >
                {isLocked ? 'Unlock with Premium' : user ? 'Start Experience' : 'Sign In to Experience'}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
