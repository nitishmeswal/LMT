'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, Calendar, Clock, Zap, X, Trash2, Share2, Loader2, RefreshCw } from 'lucide-react';
import { useAppStore, JournalEntry } from '@/store/useAppStore';
import { useAuth } from '@/context/AuthContext';
import { getUserJournalEntries, syncJournalEntry } from '@/lib/supabase';
import { formatDuration } from '@/lib/utils';
import JournalShareCard from '@/components/ui/JournalShareCard';
import AuthModal from '@/components/ui/AuthModal';

const MOODS = [
  { id: 'euphoric', label: 'Euphoric', emoji: '✨' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🧘' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'introspective', label: 'Introspective', emoji: '🔮' },
  { id: 'energized', label: 'Energized', emoji: '⚡' },
  { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
];

export default function Journal() {
  const { journalEntries, addJournalEntry, setJournalEntries } = useAppStore();
  const { user } = useAuth();
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [shareEntry, setShareEntry] = useState<JournalEntry | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({
    mood: [] as string[],
    intensity: 5,
    notes: '',
    doseName: '',
    doseId: '',
  });

  // Fetch journal entries from database when logged in
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const dbEntries = await getUserJournalEntries(user.id);
        if (dbEntries.length > 0) {
          const formattedEntries: JournalEntry[] = dbEntries.map(e => ({
            id: e.id,
            doseId: e.dose_id,
            doseName: e.dose_name,
            timestamp: new Date(e.created_at).getTime(),
            mood: e.mood || [],
            intensity: e.intensity,
            notes: e.notes || '',
            duration: e.duration || 0,
          }));
          setJournalEntries(formattedEntries);
        }
      } catch (err) {
        console.error('Error fetching journal:', err);
      }
      setLoading(false);
    };
    fetchEntries();
  }, [user, setJournalEntries]);

  const handleSaveEntry = async () => {
    if (newEntry.notes.trim() || newEntry.mood.length > 0) {
      const entryData = {
        doseId: newEntry.doseId || 'custom',
        doseName: newEntry.doseName || 'Custom Entry',
        mood: newEntry.mood,
        intensity: newEntry.intensity,
        notes: newEntry.notes,
        duration: 0,
      };
      
      addJournalEntry(entryData);
      
      // Sync to database if logged in
      if (user) {
        await syncJournalEntry(user.id, entryData);
      }
      
      setNewEntry({ mood: [], intensity: 5, notes: '', doseName: '', doseId: '' });
      setShowNewEntry(false);
    }
  };

  const toggleMood = (moodId: string) => {
    setNewEntry((prev) => ({
      ...prev,
      mood: prev.mood.includes(moodId)
        ? prev.mood.filter((m) => m !== moodId)
        : [...prev.mood, moodId],
    }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold text-gradient">Trip Journal</h1>
          {/* Only show + button if there are entries - otherwise show in empty state */}
          {journalEntries.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewEntry(true)}
              className="p-3 rounded-full bg-gradient-to-r from-neuro-purple to-neuro-magenta"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>
        <p className="text-white/50 text-sm">
          {user ? 'Synced to cloud' : 'Reflect on your consciousness journeys'}
        </p>
        
        {/* Loading indicator */}
        {loading && (
          <div className="flex items-center gap-2 mt-2 text-neuro-purple text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading journal...
          </div>
        )}
      </div>

      {/* Entries */}
      <div className="px-4 space-y-4">
        {journalEntries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <p className="text-white/50 text-lg mb-2">No journal entries yet</p>
            <p className="text-white/30 text-sm mb-8">Start documenting your consciousness journeys</p>
            
            {/* Add Entry Button in Empty State */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewEntry(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Your First Entry
            </motion.button>
            
            {!user && (
              <p className="text-white/30 text-xs mt-4">
                Sign in to sync your journal across devices
              </p>
            )}
          </motion.div>
        ) : (
          journalEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">{entry.doseName}</h3>
                  <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(entry.timestamp)}
                    </span>
                    {entry.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(entry.duration)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10">
                  <Zap className="w-3 h-3 text-neuro-magenta" />
                  <span className="text-xs">{entry.intensity}/10</span>
                </div>
              </div>

              {/* Moods */}
              {entry.mood.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {entry.mood.map((moodId) => {
                    const mood = MOODS.find((m) => m.id === moodId);
                    return mood ? (
                      <span
                        key={moodId}
                        className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/70"
                      >
                        {mood.emoji} {mood.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              {/* Notes */}
              {entry.notes && (
                <p className="text-sm text-white/70 leading-relaxed">{entry.notes}</p>
              )}

              {/* Share Button */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <button
                  onClick={() => setShareEntry(entry)}
                  className="flex items-center gap-2 text-sm text-neuro-purple hover:text-neuro-magenta transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share this journey
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* New Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowNewEntry(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-t-3xl p-6 pb-24 mb-16"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">New Journal Entry</h2>
                <button
                  onClick={() => setShowNewEntry(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mood Selection */}
              <div className="mb-6">
                <label className="text-sm text-white/60 mb-3 block">How did you feel?</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => toggleMood(mood.id)}
                      className={`px-3 py-2 rounded-xl text-sm transition-all ${
                        newEntry.mood.includes(mood.id)
                          ? 'bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {mood.emoji} {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity */}
              <div className="mb-6">
                <label className="text-sm text-white/60 mb-3 block">
                  Experience Intensity: {newEntry.intensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.intensity}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, intensity: parseInt(e.target.value) }))}
                  className="w-full accent-neuro-purple"
                />
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="text-sm text-white/60 mb-3 block">Notes & Reflections</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Describe your experience..."
                  className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-neuro-purple/50 resize-none"
                />
              </div>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveEntry}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-neuro-purple to-neuro-magenta text-white font-medium"
              >
                Save Entry
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {shareEntry && (
          <JournalShareCard
            entry={shareEntry}
            onClose={() => setShareEntry(null)}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </div>
  );
}
