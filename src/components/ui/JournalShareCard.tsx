'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Download, Twitter, Facebook, Instagram, Copy, Check, Sparkles } from 'lucide-react';
import { JournalEntry } from '@/store/useAppStore';
import { getDoseById } from '@/data/doses';

interface JournalShareCardProps {
  entry: JournalEntry;
  onClose: () => void;
}

export default function JournalShareCard({ entry, onClose }: JournalShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const dose = getDoseById(entry.doseId);
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const shareText = `🧠 Just completed a ${entry.doseName} session on NeuroNirvana!\n\n` +
    `Duration: ${formatDuration(entry.duration)}\n` +
    `Intensity: ${entry.intensity}/10\n` +
    `Mood: ${entry.mood.join(', ')}\n\n` +
    `${entry.notes ? `"${entry.notes.slice(0, 100)}${entry.notes.length > 100 ? '...' : ''}"` : ''}\n\n` +
    `Try it yourself: neuronirvana.app 🌌`;

  const handleCopyText = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = 'https://neuronirvana.app';
    const encodedText = encodeURIComponent(shareText);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  const handleDownloadImage = async () => {
    setGenerating(true);
    
    // In production, you'd use html-to-image or similar
    // For now, we'll just show a message
    setTimeout(() => {
      setGenerating(false);
      alert('Image generation coming soon! For now, take a screenshot of the card.');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md"
      >
        {/* Shareable Card Preview */}
        <div
          ref={cardRef}
          className="glass rounded-3xl p-6 border border-white/20 mb-4"
          style={{
            background: `linear-gradient(135deg, ${dose?.colors[0]}20 0%, #0a0a0f 50%, ${dose?.colors[1] || dose?.colors[0]}20 100%)`,
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
                style={{ backgroundColor: `${dose?.colors[0]}30` }}
              >
                {dose?.category === 'psychedelic' ? '🍄' :
                 dose?.category === 'euphoric' ? '✨' :
                 dose?.category === 'meditative' ? '🧘' :
                 dose?.category === 'focus' ? '🎯' :
                 dose?.category === 'sleep' ? '🌙' :
                 dose?.category === 'dissociative' ? '🌀' : '🌿'}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{entry.doseName}</h3>
                <p className="text-sm text-white/60">{formatDate(entry.timestamp)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-lg font-bold text-white">{formatDuration(entry.duration)}</p>
              <p className="text-xs text-white/40">Duration</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-lg font-bold text-white">{entry.intensity}/10</p>
              <p className="text-xs text-white/40">Intensity</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5">
              <p className="text-lg font-bold text-white">{dose?.visualType}</p>
              <p className="text-xs text-white/40">Visual</p>
            </div>
          </div>

          {/* Mood Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.mood.map((m, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-sm bg-white/10 text-white/80"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Notes */}
          {entry.notes && (
            <div className="p-4 rounded-xl bg-white/5 mb-4">
              <p className="text-sm text-white/70 italic">"{entry.notes}"</p>
            </div>
          )}

          {/* Branding */}
          <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/10">
            <Sparkles className="w-4 h-4 text-neuro-purple" />
            <span className="text-sm text-white/60">neuronirvana.app</span>
          </div>
        </div>

        {/* Share Options */}
        <div className="glass rounded-2xl p-4 border border-white/20">
          <h4 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
            Share Your Journey
          </h4>

          <div className="grid grid-cols-4 gap-3 mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('twitter')}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              <span className="text-xs text-white/60">Twitter</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('facebook')}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <Facebook className="w-5 h-5 text-[#4267B2]" />
              <span className="text-xs text-white/60">Facebook</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('whatsapp')}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span className="text-xs text-white/60">WhatsApp</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyText}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-white/60" />
              )}
              <span className="text-xs text-white/60">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownloadImage}
            disabled={generating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-medium flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            {generating ? 'Generating...' : 'Download as Image'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
