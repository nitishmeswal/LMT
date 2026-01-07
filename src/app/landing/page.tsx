'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Brain, Headphones, Eye, Sparkles, Zap, Clock,
  ChevronRight, Play, Star, Shield, Users, ArrowRight, Share2, Plus
} from 'lucide-react';
import ShareButton from '@/components/ui/ShareButton';
import TestimonialModal from '@/components/ui/TestimonialModal';

const FEATURES = [
  {
    icon: Headphones,
    title: 'Real Binaural Beats',
    description: 'Scientifically-tuned frequencies generated in real-time to guide your brainwaves into desired states.',
  },
  {
    icon: Eye,
    title: 'Immersive Visuals',
    description: 'GPU-accelerated WebGL shaders that respond to your session intensity for a truly immersive experience.',
  },
  {
    icon: Brain,
    title: 'AI-Powered (Coming Soon)',
    description: 'Our AI curator will learn your preferences and create personalized dose recommendations.',
  },
];

const DOSES_PREVIEW = [
  { name: 'Psilocybin', tagline: 'Mushroom Mysticism', emoji: '🍄', color: '#8b5cf6' },
  { name: 'DMT', tagline: 'Hyperspace Gateway', emoji: '🌌', color: '#ec4899' },
  { name: 'Meditation', tagline: 'Pure Mindfulness', emoji: '🧘', color: '#10b981' },
  { name: 'Focus Flow', tagline: 'Deep Concentration', emoji: '🎯', color: '#3b82f6' },
];

const TESTIMONIALS = [
  { text: "Finally, a legal way to explore consciousness. The binaural beats actually work!", rating: 5, name: "Alex K." },
  { text: "I use it every day for my focus sessions. Game changer for deep work.", rating: 5, name: "Sarah M." },
  { text: "The visuals are absolutely stunning. Better than any meditation app.", rating: 5, name: "Jordan T." },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);

  return (
    <div className="min-h-screen bg-neuro-deep">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neuro-purple/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neuro-magenta/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 px-4 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">🚀 Launch Special: 420 Free Doses Per Experience</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">Your Digital</span>
            <br />
            <span className="text-white">Consciousness Dispensary</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 mb-8 max-w-2xl mx-auto"
          >
            Experience altered states through scientifically-tuned binaural beats and 
            immersive visuals. Lock in. Explore. Transform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold flex items-center gap-2 justify-center"
              >
                <Play className="w-5 h-5" />
                Enter Dispensary
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold flex items-center gap-2 justify-center hover:bg-white/15 transition-colors"
            >
              Watch Demo
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-white/40"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm">100% Legal</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">10K+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span className="text-sm">4.9 Rating</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronRight className="w-6 h-6 text-white/30 rotate-90" />
        </motion.div>
      </section>

      {/* Dose Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">20+ Digital Experiences</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              From psychedelic journeys to deep focus states, explore our curated collection of consciousness-altering doses.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DOSES_PREVIEW.map((dose, i) => (
              <motion.div
                key={dose.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 text-center hover:border-white/20 transition-all cursor-pointer"
                style={{ borderColor: `${dose.color}20` }}
              >
                <span className="text-4xl mb-4 block">{dose.emoji}</span>
                <h3 className="font-semibold text-white mb-1">{dose.name}</h3>
                <p className="text-xs text-white/50">{dose.tagline}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="text-neuro-purple hover:text-neuro-magenta transition-colors flex items-center gap-2 mx-auto"
              >
                View All 20+ Doses
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Cutting-edge audio-visual technology to guide your consciousness
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-neuro-purple" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Loved by Explorers</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-4">"{testimonial.text}"</p>
                <p className="text-sm text-white/40">— {testimonial.name}</p>
              </motion.div>
            ))}

            {/* Add Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glass rounded-2xl p-6 border border-dashed border-white/20 hover:border-neuro-purple/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center min-h-[200px]"
              onClick={() => setShowTestimonialModal(true)}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neuro-purple/20 to-neuro-magenta/20 flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-neuro-purple" />
              </div>
              <h4 className="font-semibold text-white mb-2">Share Your Experience</h4>
              <p className="text-xs text-white/50">Had a transformative journey? Tell us about it!</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 text-center border border-neuro-purple/30"
          >
            <Sparkles className="w-12 h-12 text-neuro-purple mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Explore Your Mind?
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Join thousands of consciousness explorers. Start your journey today with 420 free trials per experience.
            </p>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-semibold text-lg"
              >
                Enter the Dispensary
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-neuro-purple" />
            <span className="font-bold text-white">NeuroNirvana</span>
          </div>
          <div className="flex items-center gap-4">
            <ShareButton variant="button" />
            <p className="text-sm text-white/40">
              © 2024 NeuroNirvana. For entertainment & wellness purposes only.
            </p>
          </div>
        </div>
      </footer>

      {/* Fixed Share Button */}
      <div className="fixed top-4 right-4 z-50">
        <ShareButton />
      </div>

      {/* Testimonial Modal */}
      <TestimonialModal 
        isOpen={showTestimonialModal} 
        onClose={() => setShowTestimonialModal(false)} 
      />
    </div>
  );
}
