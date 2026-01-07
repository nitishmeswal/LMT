'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Heart, Activity, X, Sparkles, ChevronRight } from 'lucide-react';

export default function BiometricCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="glass rounded-2xl p-5 cursor-pointer border border-white/10 hover:border-neuro-cyan/30 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-neuro-cyan/20 to-blue-500/20 flex items-center justify-center">
            <Watch className="w-7 h-7 text-neuro-cyan" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">Biometric Sync</h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                Coming Soon
              </span>
            </div>
            <p className="text-xs text-white/60">Connect Apple Watch or Fitbit for real-time adaptation</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40" />
        </div>

        {/* Mock HRV Display */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-xl bg-white/5">
            <Heart className="w-4 h-4 mx-auto mb-1 text-red-400" />
            <p className="text-sm font-bold text-white">--</p>
            <p className="text-xs text-white/40">BPM</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5">
            <Activity className="w-4 h-4 mx-auto mb-1 text-green-400" />
            <p className="text-sm font-bold text-white">--</p>
            <p className="text-xs text-white/40">HRV</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-white/5">
            <Sparkles className="w-4 h-4 mx-auto mb-1 text-purple-400" />
            <p className="text-sm font-bold text-white">--</p>
            <p className="text-xs text-white/40">Stress</p>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-3xl p-6 border border-white/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-neuro-cyan/20 to-blue-500/20 flex items-center justify-center">
                    <Watch className="w-6 h-6 text-neuro-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Biometric Sync</h3>
                    <p className="text-xs text-white/60">Real-time adaptation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <p className="text-white/80">
                  Connect your wearable device to unlock intelligent, real-time session adaptation based on your biometrics.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <Heart className="w-5 h-5 text-red-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Heart Rate Monitoring</h4>
                      <p className="text-xs text-white/50">Adjust intensity based on your pulse</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">HRV Analysis</h4>
                      <p className="text-xs text-white/50">Optimize frequencies for your nervous system</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Stress Detection</h4>
                      <p className="text-xs text-white/50">Auto-adjust when you need it most</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-amber-400">Coming Q3 2024</span>
                  </div>
                  <p className="text-xs text-white/60">
                    We're working on Apple HealthKit and Fitbit integrations. Stay tuned for updates!
                  </p>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
                >
                  Notify Me When Available
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
