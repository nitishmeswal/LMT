'use client';

import { motion } from 'framer-motion';
import { Store, BookOpen, Wand2, Crown, Compass, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'dispensary', label: 'Dispensary', icon: Store },
  { id: 'discover', label: 'Discover', icon: Compass },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'builder', label: 'Builder', icon: Wand2 },
  { id: 'premium', label: 'Premium', icon: Crown },
] as const;

export default function Navigation() {
  const { activeTab, setActiveTab, isPremium } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-4 mb-4">
        <div className="glass rounded-2xl p-2 flex items-center justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all",
                  isActive ? "text-white" : "text-white/50 hover:text-white/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-neuro-purple/30 to-neuro-magenta/30 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className={cn("w-5 h-5 relative z-10", item.id === 'premium' && isPremium && "text-amber-400")} />
                <span className="text-xs font-medium relative z-10">{item.label}</span>
                {item.id === 'premium' && isPremium && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
