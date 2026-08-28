import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { init, effect, surface, frameLoop } from 'vgpu';
import cymaticsShaderSource from '@/shaders/cymatics.wgsl';
import { cosmicAudio, SoundscapeType } from '@/lib/WebAudioCosmicSynth';
import { Sparkles, Play, Square, Waves, Volume2, Maximize2 } from 'lucide-react';

interface SolfeggioPreset {
  freq: number;
  name: string;
  chakra: string;
  n: number;
  m: number;
  auraHex: string;
  soundType: SoundscapeType;
  description: string;
}

const SOLFEGGIO_PRESETS: SolfeggioPreset[] = [
  {
    freq: 396,
    name: '396 Hz (Ut)',
    chakra: 'Root Chakra',
    n: 2,
    m: 3,
    auraHex: '#EF4444',
    soundType: 'none',
    description: 'Liberating guilt, grounding fear, and establishing cosmic root stability.',
  },
  {
    freq: 417,
    name: '417 Hz (Re)',
    chakra: 'Sacral Chakra',
    n: 3,
    m: 4,
    auraHex: '#F97316',
    soundType: 'none',
    description: 'Dissolving emotional blockages and facilitating sacred creative flow.',
  },
  {
    freq: 432,
    name: '432 Hz (Cosmic A)',
    chakra: 'Cosmic Unity',
    n: 4,
    m: 4,
    auraHex: '#EAB308',
    soundType: '432hz',
    description: 'Universal Pythagorean starlight resonance. Harmonizes cerebral hemisphere coherence.',
  },
  {
    freq: 528,
    name: '528 Hz (Mi)',
    chakra: 'Heart / Transformation',
    n: 5,
    m: 4,
    auraHex: '#10B981',
    soundType: '528hz',
    description: 'The Miracle frequency. Promotes cellular cellular repair and deep heart-center opening.',
  },
  {
    freq: 639,
    name: '639 Hz (Fa)',
    chakra: 'Higher Heart',
    n: 6,
    m: 5,
    auraHex: '#EC4899',
    soundType: 'none',
    description: 'Harmonious relationships, spiritual interconnectedness, and interpersonal empathy.',
  },
  {
    freq: 741,
    name: '741 Hz (Sol)',
    chakra: 'Throat / Expression',
    n: 6,
    m: 7,
    auraHex: '#0EA5E9',
    soundType: 'none',
    description: 'Awakening intuition, clearing electromagnetic toxins, and authentic vocal alignment.',
  },
  {
    freq: 852,
    name: '852 Hz (La)',
    chakra: 'Third Eye',
    n: 7,
    m: 8,
    auraHex: '#6366F1',
    soundType: 'theta',
    description: 'Returning to spiritual order, transcendental awareness, and psychic clarity.',
  },
  {
    freq: 963,
    name: '963 Hz (Ti)',
    chakra: 'Crown Chakra',
    n: 8,
    m: 8,
    auraHex: '#A855F7',
    soundType: 'none',
    description: 'Awakening divine consciousness and experiencing universal cosmic oneness.',
  },
];

function hexToVec3(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16) || 0x10b981;
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function CymaticsVisualizer() {
  const [selectedPreset, setSelectedPreset] = useState<SolfeggioPreset>(SOLFEGGIO_PRESETS[2]); // Default 432Hz
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [modalN, setModalN] = useState<number>(4);
  const [modalM, setModalM] = useState<number>(4);
  const [useWebGpu, setUseWebGpu] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSelectPreset = (preset: SolfeggioPreset) => {
    setSelectedPreset(preset);
    setModalN(preset.n);
    setModalM(preset.m);

    // Play singing bowl chime in that fundamental key
    cosmicAudio.playBowlChime(preset.freq);

    if (preset.soundType !== 'none') {
      cosmicAudio.startSoundscape(preset.soundType);
      setIsPlayingAudio(true);
    }
  };

  const toggleSoundscape = () => {
    if (isPlayingAudio) {
      cosmicAudio.stopSoundscape();
      setIsPlayingAudio(false);
    } else {
      const type = selectedPreset.soundType !== 'none' ? selectedPreset.soundType : '432hz';
      cosmicAudio.startSoundscape(type);
      setIsPlayingAudio(true);
    }
  };

  // ---------------------------------------------------------------------------
  // WebGPU Cymatics Pipeline
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !useWebGpu) return;

    let isDisposed = false;
    let cleanupGpu: (() => void) | null = null;

    async function mountGpu() {
      try {
        if (typeof navigator === 'undefined' || !(navigator as any).gpu) {
          setUseWebGpu(false);
          return;
        }

        const gpu = await init();
        if (isDisposed || !canvas) {
          gpu.dispose();
          return;
        }

        const output = surface(gpu, canvas, { dpr: Math.min(window.devicePixelRatio || 1, 2) });
        const shader = effect(gpu, cymaticsShaderSource);
        const startTime = performance.now();

        const loop = frameLoop(gpu, (f) => {
          const elapsed = (performance.now() - startTime) / 1000;
          const energy = cosmicAudio.getAverageEnergy();

          shader.set({
            uniforms: {
              resolution: output.size,
              time: elapsed,
              frequency: selectedPreset.freq,
              audioEnergy: energy,
              modalN: modalN,
              modalM: modalM,
              paletteAura: hexToVec3(selectedPreset.auraHex),
            },
          });
          f.pass(output, shader);
        });

        cleanupGpu = () => {
          loop.stop();
          gpu.dispose();
        };
      } catch (err) {
        console.warn('[vGPU] Cymatics WebGPU init skipped, falling back to 2D Canvas:', err);
        setUseWebGpu(false);
      }
    }

    mountGpu();

    return () => {
      isDisposed = true;
      if (cleanupGpu) cleanupGpu();
    };
  }, [useWebGpu, selectedPreset, modalN, modalM]);

  // ---------------------------------------------------------------------------
  // Canvas 2D Fallback
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (useWebGpu) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render2d = () => {
      time += 0.02;
      canvas.width = canvas.clientWidth || 400;
      canvas.height = canvas.clientHeight || 400;
      const w = canvas.width;
      const h = canvas.height;
      const energy = cosmicAudio.getAverageEnergy();

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const radius = Math.min(w, h) * 0.42;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#D97706';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Render simplified 2D rosette harmonic nodes
      const petals = modalN * 2;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.02) {
        const r = radius * (0.5 + 0.4 * Math.sin(a * petals + time) * (1 + energy));
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = selectedPreset.auraHex;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render2d);
    };

    render2d();
    return () => cancelAnimationFrame(animId);
  }, [useWebGpu, selectedPreset, modalN, modalM]);

  return (
    <Card className="bg-[#1E293B]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-900/80 text-purple-300 border-purple-500/40 text-[10px] font-mono uppercase">
                vGPU Harmonic Engine
              </Badge>
              <span className="text-xs font-mono text-gray-400">WebGPU Physical Cymatics</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-space font-bold mt-1 text-white flex items-center gap-2">
              <Waves className="w-5 h-5 text-[#0EA5E9]" />
              Solfeggio Cymatic Resonance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-300 mt-0.5">
              Visualize physical Chladni plate nodal sound geometry in real-time.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={toggleSoundscape}
              className={`font-space text-xs gap-1.5 ${
                isPlayingAudio
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play {selectedPreset.freq}Hz Tone</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Main Cymatics Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visualizer Canvas Container */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative aspect-square w-full max-w-[420px] rounded-full overflow-hidden bg-gradient-to-b from-[#0B0F19] to-[#151226] border-2 border-purple-500/30 shadow-[0_0_50px_rgba(126,34,206,0.3)]">
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />

              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-purple-200 shadow-md">
                Mode ({modalN}, {modalM}) • {selectedPreset.freq}Hz
              </div>
            </div>
          </div>

          {/* Preset Details & Harmonic Tuning Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300">Active Harmonic</span>
                <Badge
                  style={{ backgroundColor: `${selectedPreset.auraHex}33`, color: selectedPreset.auraHex }}
                  className="font-mono text-xs border"
                >
                  {selectedPreset.chakra}
                </Badge>
              </div>
              <h3 className="text-lg font-space font-bold text-white">{selectedPreset.name}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{selectedPreset.description}</p>
            </div>

            {/* Modal Sliders */}
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                  <span>Radial Mode N: {modalN}</span>
                  <span className="text-purple-400">Harmonic Symmetry</span>
                </div>
                <Slider
                  min={1}
                  max={12}
                  step={1}
                  value={[modalN]}
                  onValueChange={(val) => setModalN(val[0])}
                  className="py-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                  <span>Azimuthal Mode M: {modalM}</span>
                  <span className="text-pink-400">Chladni Nodes</span>
                </div>
                <Slider
                  min={1}
                  max={12}
                  step={1}
                  value={[modalM]}
                  onValueChange={(val) => setModalM(val[0])}
                  className="py-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Solfeggio Scale Presets Selector */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Select Sacred Solfeggio Frequency</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SOLFEGGIO_PRESETS.map((preset) => {
              const isSelected = selectedPreset.freq === preset.freq;
              return (
                <button
                  key={preset.freq}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-purple-900/60 to-pink-900/40 border-purple-500 shadow-lg shadow-purple-950/40 ring-1 ring-purple-400/40'
                      : 'bg-[#0F172A]/60 border-white/5 hover:border-white/20 hover:bg-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{preset.freq} Hz</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: preset.auraHex }}
                    />
                  </div>
                  <p className="text-[11px] font-space text-purple-200 mt-1 truncate">{preset.name.split(' ')[1] || preset.name}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{preset.chakra}</p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
