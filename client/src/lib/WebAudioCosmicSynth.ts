/**
 * WebAudioCosmicSynth - High-precision, zero-dependency, zero-CORS procedural audio engine.
 * Generates Solfeggio frequencies (432Hz, 528Hz), binaural beats (Theta 6Hz),
 * cosmic noise soundscapes, and synthesized Tibetan singing bowl chimes directly in the browser.
 */

export type SoundscapeType = '432hz' | '528hz' | 'theta' | 'cosmic-noise' | 'none';

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    sources: AudioBufferSourceNode[];
    timers: number[];
  } = {
    oscillators: [],
    gains: [],
    sources: [],
    timers: [],
  };
  private volume: number = 0.6;
  private isPlaying: boolean = false;
  private currentType: SoundscapeType = 'none';

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getSoundscapeType(): SoundscapeType {
    return this.currentType;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Plays a synthesized Tibetan Singing Bowl bell chime.
   * Uses fundamental + 3 physical harmonic overtones with exponential decay.
   */
  public playBowlChime(fundamentalFreq: number = 528) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Harmonics for a rich singing bowl resonance
      const harmonics = [
        { freq: fundamentalFreq, gain: 0.5, decay: 4.5 },
        { freq: fundamentalFreq * 2.01, gain: 0.25, decay: 3.5 },
        { freq: fundamentalFreq * 3.03, gain: 0.12, decay: 2.5 },
        { freq: fundamentalFreq * 4.25, gain: 0.06, decay: 1.8 },
      ];

      harmonics.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Strike envelope: instant attack + slow exponential release
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(gain * this.volume, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(g);
        if (this.masterGain) {
          g.connect(this.masterGain);
        } else {
          g.connect(ctx.destination);
        }

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn('Bowl chime synthesis error:', e);
    }
  }

  /**
   * Starts a continuous procedural soundscape.
   */
  public startSoundscape(type: SoundscapeType) {
    this.stopSoundscape();
    this.currentType = type;

    if (type === 'none') {
      this.isPlaying = false;
      return;
    }

    try {
      const ctx = this.initContext();
      if (!this.masterGain) {
        console.warn('AudioContext or masterGain unavailable; skipping soundscape.');
        this.isPlaying = false;
        return;
      }
      this.isPlaying = true;
      const now = ctx.currentTime;

      if (type === '432hz') {
        // 432 Hz Pure Cosmic Harmony + Sub-harmonic + Gentle Vibrato
        const osc1 = ctx.createOscillator();
        const oscSub = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gainSub = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(432, now);

        oscSub.type = 'sine';
        oscSub.frequency.setValueAtTime(216, now); // Sub-octave warm drone

        // LFO for breathing amplitude pulse
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1, now); // 10s breathing cycle
        lfoGain.gain.setValueAtTime(0.05, now);
        lfo.connect(lfoGain.gain);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.3, now + 2);

        gainSub.gain.setValueAtTime(0.001, now);
        gainSub.gain.linearRampToValueAtTime(0.15, now + 3);

        osc1.connect(gain1);
        oscSub.connect(gainSub);
        gain1.connect(this.masterGain!);
        gainSub.connect(this.masterGain!);

        osc1.start(now);
        oscSub.start(now);
        lfo.start(now);

        this.currentNodes.oscillators.push(osc1, oscSub, lfo);
        this.currentNodes.gains.push(gain1, gainSub, lfoGain);

      } else if (type === '528hz') {
        // 528 Hz Solfeggio Transformation Tone + 264 Hz Foundation
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(528, now);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(528.5, now); // 0.5 Hz warm binaural shimmer

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.25, now + 2);

        gain2.gain.setValueAtTime(0.001, now);
        gain2.gain.linearRampToValueAtTime(0.2, now + 2);

        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(this.masterGain!);
        gain2.connect(this.masterGain!);

        osc1.start(now);
        osc2.start(now);

        this.currentNodes.oscillators.push(osc1, osc2);
        this.currentNodes.gains.push(gain1, gain2);

      } else if (type === 'theta') {
        // Theta Wave Astral Drone: 200 Hz Left Ear + 206 Hz Right Ear (6 Hz Theta Wave)
        const merger = ctx.createChannelMerger(2);
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const gainL = ctx.createGain();
        const gainR = ctx.createGain();

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(200, now);

        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(206, now); // 6 Hz Theta binaural beat

        gainL.gain.setValueAtTime(0.001, now);
        gainL.gain.linearRampToValueAtTime(0.25, now + 2);

        gainR.gain.setValueAtTime(0.001, now);
        gainR.gain.linearRampToValueAtTime(0.25, now + 2);

        oscL.connect(gainL);
        oscR.connect(gainR);
        gainL.connect(merger, 0, 0); // Left channel
        gainR.connect(merger, 0, 1); // Right channel
        merger.connect(this.masterGain!);

        oscL.start(now);
        oscR.start(now);

        this.currentNodes.oscillators.push(oscL, oscR);
        this.currentNodes.gains.push(gainL, gainR);

      } else if (type === 'cosmic-noise') {
        // Procedural Cosmic Pink/Brown Noise Generator (Stellar Wind / Deep Ocean)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Lowpass filter for deep resonant space ambiance
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.35, now + 3);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGain!);

        whiteNoise.start(now);
        this.currentNodes.sources.push(whiteNoise);
        this.currentNodes.gains.push(noiseGain);
      }
    } catch (err) {
      console.warn('Error starting soundscape:', err);
      this.isPlaying = false;
    }
  }

  public stopSoundscape() {
    this.isPlaying = false;
    this.currentType = 'none';

    // Clear any previously pending fade-out timers to avoid leaks on rapid calls
    this.currentNodes.timers.forEach((tid) => {
      try { clearTimeout(tid); } catch { /* ignore */ }
    });

    if (this.ctx) {
      const now = this.ctx.currentTime;
      // Gentle 0.5s fade-out before stopping nodes
      this.currentNodes.gains.forEach((g) => {
        try {
          g.gain.setValueAtTime(g.gain.value, now);
          g.gain.linearRampToValueAtTime(0.0001, now + 0.4);
        } catch {
          // ignore
        }
      });

      // Capture current nodes for the delayed cleanup closure
      const nodesToClean = { ...this.currentNodes };
      // Reset immediately so new soundscapes can start fresh
      this.currentNodes = { oscillators: [], gains: [], sources: [], timers: [] };

      const timerId = window.setTimeout(() => {
        nodesToClean.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
        nodesToClean.sources.forEach((src) => {
          try {
            src.stop();
            src.disconnect();
          } catch {
            // ignore
          }
        });
      }, 450);

      this.currentNodes.timers.push(timerId);
    } else {
      this.currentNodes = { oscillators: [], gains: [], sources: [], timers: [] };
    }
  }
}

// Global Singleton Instance
export const cosmicAudio = new CosmicAudioEngine();
