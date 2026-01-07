'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/ui/Navigation';
import PromoBanner from '@/components/ui/PromoBanner';
import AuthModal from '@/components/ui/AuthModal';
import AIChatbot from '@/components/ui/AIChatbot';
import ShareButton from '@/components/ui/ShareButton';
import HelpGuide from '@/components/ui/HelpGuide';
import HeadphonePrompt from '@/components/ui/HeadphonePrompt';
import UserMenu from '@/components/ui/UserMenu';
import PremiumTrialBanner from '@/components/ui/PremiumTrialBanner';
import TripExperience from '@/components/TripExperience';
import Dispensary from '@/components/screens/Dispensary';
import Discover from '@/components/screens/Discover';
import Journal from '@/components/screens/Journal';
import TripBuilder from '@/components/screens/TripBuilder';
import Premium from '@/components/screens/Premium';
import ComingSoon from '@/components/screens/ComingSoon';

export default function Home() {
  const { activeTab, currentDose } = useAppStore();
  const [showAuth, setShowAuth] = useState(false);

  const renderScreen = () => {
    switch (activeTab) {
      case 'dispensary':
        return <Dispensary />;
      case 'discover':
        return <Discover />;
      case 'journal':
        return <Journal />;
      case 'builder':
        return <TripBuilder />;
      case 'premium':
        return <Premium />;
      case 'coming-soon':
        return <ComingSoon />;
      default:
        return <Dispensary />;
    }
  };

  return (
    <main className="min-h-screen bg-neuro-deep">
      {/* Promo Banner */}
      <PromoBanner />

      {/* Premium Trial Timer */}
      {!currentDose && <PremiumTrialBanner />}

      {/* Main Content */}
      {renderScreen()}

      {/* Navigation */}
      <Navigation />

      {/* Trip Experience Overlay */}
      <AnimatePresence>
        {currentDose && <TripExperience />}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />

      {/* Floating AI Chatbot */}
      {!currentDose && <AIChatbot />}

      {/* Help Guide - Can't feel the effect? */}
      {!currentDose && <HelpGuide />}

      {/* Headphone Prompt - Shows on first visit */}
      <HeadphonePrompt showOnMount={true} />

      {/* Top Right Controls */}
      {!currentDose && (
        <div className="fixed top-16 right-4 z-40 flex items-center gap-3">
          <UserMenu onOpenAuth={() => setShowAuth(true)} />
          <ShareButton />
        </div>
      )}
    </main>
  );
}
