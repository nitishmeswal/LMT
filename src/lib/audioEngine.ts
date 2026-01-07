import * as Tone from 'tone';
import { FrequencyLayer } from '@/data/doses';

class AudioEngine {
  private oscillators: Map<string, { left: Tone.Oscillator; right: Tone.Oscillator; gain: Tone.Gain }> = new Map();
  private masterGain: Tone.Gain | null = null;
  private isInitialized = false;
  private pannerLeft: Tone.Panner | null = null;
  private pannerRight: Tone.Panner | null = null;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    await Tone.start();
    
    this.masterGain = new Tone.Gain(0.5).toDestination();
    this.pannerLeft = new Tone.Panner(-1).connect(this.masterGain);
    this.pannerRight = new Tone.Panner(1).connect(this.masterGain);
    
    this.isInitialized = true;
  }

  async playBinauralBeat(layers: FrequencyLayer[], volume: number = 0.5): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    this.stopAll();

    if (!this.masterGain || !this.pannerLeft || !this.pannerRight) return;

    this.masterGain.gain.value = volume;

    layers.forEach((layer, index) => {
      const layerGain = new Tone.Gain(0.3 / layers.length);
      
      if (layer.type === 'binaural') {
        const leftOsc = new Tone.Oscillator({
          frequency: layer.baseFreq,
          type: 'sine',
        });
        
        const rightOsc = new Tone.Oscillator({
          frequency: layer.baseFreq + layer.beatFreq,
          type: 'sine',
        });

        const leftGain = new Tone.Gain(0.5).connect(this.pannerLeft!);
        const rightGain = new Tone.Gain(0.5).connect(this.pannerRight!);

        leftOsc.connect(leftGain);
        rightOsc.connect(rightGain);

        leftOsc.start();
        rightOsc.start();

        this.oscillators.set(`${index}-left`, { left: leftOsc, right: rightOsc, gain: leftGain });
      } else if (layer.type === 'solfeggio') {
        const osc = new Tone.Oscillator({
          frequency: layer.baseFreq,
          type: 'sine',
        });

        const gain = new Tone.Gain(0.2).connect(this.masterGain!);
        osc.connect(gain);
        osc.start();

        this.oscillators.set(`${index}-solfeggio`, { left: osc, right: osc, gain });
      } else if (layer.type === 'isochronic') {
        const osc = new Tone.Oscillator({
          frequency: layer.baseFreq,
          type: 'sine',
        });

        const tremolo = new Tone.Tremolo({
          frequency: layer.beatFreq,
          depth: 1,
          type: 'square',
        }).start();

        const gain = new Tone.Gain(0.3).connect(this.masterGain!);
        osc.connect(tremolo).connect(gain);
        osc.start();

        this.oscillators.set(`${index}-isochronic`, { left: osc, right: osc, gain });
      }
    });
  }

  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.rampTo(volume, 0.1);
    }
  }

  setIntensity(intensity: number): void {
    const normalizedIntensity = intensity / 10;
    this.oscillators.forEach(({ gain }) => {
      gain.gain.rampTo(0.3 * normalizedIntensity, 0.5);
    });
  }

  stopAll(): void {
    this.oscillators.forEach(({ left, right, gain }) => {
      try {
        left.stop();
        left.dispose();
        if (left !== right) {
          right.stop();
          right.dispose();
        }
        gain.dispose();
      } catch (e) {
        // Already disposed
      }
    });
    this.oscillators.clear();
  }

  dispose(): void {
    this.stopAll();
    this.pannerLeft?.dispose();
    this.pannerRight?.dispose();
    this.masterGain?.dispose();
    this.isInitialized = false;
  }
}

export const audioEngine = new AudioEngine();
