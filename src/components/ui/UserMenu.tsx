'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Crown, Settings, ChevronDown, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';

interface UserMenuProps {
  onOpenAuth: () => void;
}

export default function UserMenu({ onOpenAuth }: UserMenuProps) {
  const { user, profile, signOut, loading } = useAuth();
  const { isPremium, setActiveTab } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const showExpanded = isOpen || isHovered;

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenAuth}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white text-sm font-medium"
      >
        Sign In
      </motion.button>
    );
  }

  const handleSignOut = async () => {
    setSigningOut(true);
    setIsOpen(false);
    await signOut();
    setSigningOut(false);
  };

  const handleSettings = () => {
    setIsOpen(false);
    setActiveTab('premium'); // Navigate to premium/settings
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-2 p-1.5 rounded-full bg-white/10 hover:bg-white/15 transition-all duration-300"
        style={{ 
          paddingRight: showExpanded ? '12px' : '6px',
          borderRadius: showExpanded ? '12px' : '50%'
        }}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-neuro-purple to-neuro-magenta flex items-center justify-center flex-shrink-0">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Avatar" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
        
        {/* Name - only visible on hover/open */}
        <AnimatePresence>
          {showExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-1.5 overflow-hidden"
            >
              <span className="text-sm text-white max-w-[100px] truncate whitespace-nowrap">
                {profile?.full_name || user.email?.split('@')[0]}
              </span>
              {(isPremium || profile?.is_premium) && (
                <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
              )}
              <ChevronDown className={`w-4 h-4 text-white/60 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-56 glass rounded-xl border border-white/20 overflow-hidden z-50"
            >
              {/* User Info */}
              <div className="p-4 border-b border-white/10">
                <p className="text-sm font-medium text-white truncate">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {user.email}
                </p>
                {(isPremium || profile?.is_premium) && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                    <Crown className="w-3 h-3" />
                    {profile?.premium_tier || 'Premium'} Member
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm disabled:opacity-50"
                >
                  {signingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  {signingOut ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
