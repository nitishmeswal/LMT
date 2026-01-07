// Haptic Vibration Engine for Mobile Devices

export interface HapticPattern {
  vibrate: number;
  pause: number;
}

class HapticEngine {
  private isEnabled: boolean = true;
  private intervalId: NodeJS.Timeout | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isSupported = 'vibrate' in navigator;
    }
  }

  checkSupport(): boolean {
    return this.isSupported;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  isActive(): boolean {
    return this.isEnabled;
  }

  // Single vibration pulse
  pulse(duration: number = 50) {
    if (!this.isEnabled || !this.isSupported) return;
    navigator.vibrate(duration);
  }

  // Pattern vibration
  pattern(pattern: number[]) {
    if (!this.isEnabled || !this.isSupported) return;
    navigator.vibrate(pattern);
  }

  // Continuous rhythmic vibration synced with binaural beat frequency
  startRhythmic(beatFreq: number, intensity: number = 5) {
    if (!this.isEnabled || !this.isSupported) return;
    
    this.stop(); // Clear any existing pattern
    
    // Calculate vibration pattern based on beat frequency
    // Lower frequencies = longer vibrations, higher = shorter
    const baseVibrate = Math.max(20, Math.min(100, 1000 / beatFreq));
    const vibrateDuration = baseVibrate * (intensity / 10);
    const pauseDuration = Math.max(50, (1000 / beatFreq) - vibrateDuration);
    
    // Create pattern: [vibrate, pause, vibrate, pause, ...]
    const pattern = [vibrateDuration, pauseDuration];
    
    // Start rhythmic pattern
    this.intervalId = setInterval(() => {
      if (this.isEnabled && this.isSupported) {
        navigator.vibrate(pattern);
      }
    }, vibrateDuration + pauseDuration);
  }

  // Phase-based haptic patterns
  phasePattern(phase: string, intensity: number = 5) {
    if (!this.isEnabled || !this.isSupported) return;
    
    const patterns: Record<string, number[]> = {
      onset: [30, 100, 30, 100, 30], // Gentle building
      peak: [50, 50, 50, 50, 50, 50, 50], // Intense rapid
      sustain: [40, 80, 40, 80], // Steady rhythm
      comedown: [20, 150, 20, 200], // Slowing down
      complete: [100, 50, 100], // Completion signal
    };
    
    const pattern = patterns[phase] || patterns.sustain;
    const scaledPattern = pattern.map(v => Math.round(v * (intensity / 10)));
    navigator.vibrate(scaledPattern);
  }

  // Breathing sync - vibrate on inhale, pause on exhale
  breathingPulse(isInhale: boolean, intensity: number = 5) {
    if (!this.isEnabled || !this.isSupported) return;
    
    if (isInhale) {
      // Gentle vibration during inhale
      navigator.vibrate(Math.round(30 * (intensity / 10)));
    }
    // No vibration during exhale (natural pause)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.isSupported) {
      navigator.vibrate(0); // Stop any ongoing vibration
    }
  }
}

export const hapticEngine = new HapticEngine();
