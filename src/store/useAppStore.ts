import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Dose, VisualType } from '@/data/doses';

export type TripPhase = 'idle' | 'onset' | 'peak' | 'sustain' | 'comedown' | 'complete';

export interface JournalEntry {
  id: string;
  doseId: string;
  doseName: string;
  timestamp: number;
  mood: string[];
  intensity: number;
  notes: string;
  duration: number;
}

export interface CustomTrip {
  id: string;
  name: string;
  duration: number;
  intensity: number;
  frequencies: { baseFreq: number; beatFreq: number }[];
  visualType: VisualType;
  createdAt: number;
}

interface AppState {
  // Trial System
  globalTrials: Record<string, number>;
  decrementTrial: (doseId: string) => boolean;
  getTrialsRemaining: (doseId: string) => number;
  
  // Current Trip State
  currentDose: Dose | null;
  isPlaying: boolean;
  phase: TripPhase;
  elapsedTime: number;
  totalDuration: number;
  intensity: number;
  volume: number;
  currentVisual: VisualType;
  showControls: boolean;
  
  // Trip Actions
  startTrip: (dose: Dose) => void;
  stopTrip: () => void;
  togglePlay: () => void;
  setPhase: (phase: TripPhase) => void;
  setElapsedTime: (time: number) => void;
  setIntensity: (intensity: number) => void;
  setVolume: (volume: number) => void;
  setVisual: (visual: VisualType) => void;
  toggleControls: () => void;
  
  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  setJournalEntries: (entries: JournalEntry[]) => void;
  
  // Custom Trips
  customTrips: CustomTrip[];
  addCustomTrip: (trip: Omit<CustomTrip, 'id' | 'createdAt'>) => void;
  deleteCustomTrip: (id: string) => void;
  
  // Premium
  isPremium: boolean;
  setPremium: (value: boolean) => void;
  
  // UI
  activeTab: 'dispensary' | 'discover' | 'journal' | 'builder' | 'premium' | 'coming-soon';
  setActiveTab: (tab: 'dispensary' | 'discover' | 'journal' | 'builder' | 'premium' | 'coming-soon') => void;
}

const INITIAL_TRIALS = 500;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Trial System
      globalTrials: {},
      decrementTrial: (doseId: string) => {
        const state = get();
        if (state.isPremium) return true;
        
        const current = state.globalTrials[doseId] ?? INITIAL_TRIALS;
        if (current <= 0) return false;
        
        set({
          globalTrials: {
            ...state.globalTrials,
            [doseId]: current - 1,
          },
        });
        return true;
      },
      getTrialsRemaining: (doseId: string) => {
        const state = get();
        if (state.isPremium) return Infinity;
        return state.globalTrials[doseId] ?? INITIAL_TRIALS;
      },
      
      // Current Trip State
      currentDose: null,
      isPlaying: false,
      phase: 'idle',
      elapsedTime: 0,
      totalDuration: 0,
      intensity: 5,
      volume: 0.7,
      currentVisual: 'mandala',
      showControls: true,
      
      // Trip Actions
      startTrip: (dose: Dose) => {
        set({
          currentDose: dose,
          isPlaying: true,
          phase: 'onset',
          elapsedTime: 0,
          totalDuration: dose.defaultDuration,
          intensity: dose.intensity,
          currentVisual: dose.visualType,
        });
      },
      stopTrip: () => {
        set({
          currentDose: null,
          isPlaying: false,
          phase: 'idle',
          elapsedTime: 0,
        });
      },
      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },
      setPhase: (phase: TripPhase) => set({ phase }),
      setElapsedTime: (time: number) => set({ elapsedTime: time }),
      setIntensity: (intensity: number) => set({ intensity }),
      setVolume: (volume: number) => set({ volume }),
      setVisual: (visual: VisualType) => set({ currentVisual: visual }),
      toggleControls: () => set((state) => ({ showControls: !state.showControls })),
      
      // Journal
      journalEntries: [],
      addJournalEntry: (entry) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({
          journalEntries: [newEntry, ...state.journalEntries],
        }));
      },
      setJournalEntries: (entries: JournalEntry[]) => set({ journalEntries: entries }),
      
      // Custom Trips
      customTrips: [],
      addCustomTrip: (trip) => {
        const newTrip: CustomTrip = {
          ...trip,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((state) => ({
          customTrips: [newTrip, ...state.customTrips],
        }));
      },
      deleteCustomTrip: (id) => {
        set((state) => ({
          customTrips: state.customTrips.filter((t) => t.id !== id),
        }));
      },
      
      // Premium
      isPremium: false,
      setPremium: (value: boolean) => set({ isPremium: value }),
      
      // UI
      activeTab: 'dispensary',
      setActiveTab: (tab) => set({ activeTab: tab }),
    }),
    {
      name: 'neuronirvana-storage',
      partialize: (state) => ({
        globalTrials: state.globalTrials,
        journalEntries: state.journalEntries,
        customTrips: state.customTrips,
        isPremium: state.isPremium,
      }),
    }
  )
);
