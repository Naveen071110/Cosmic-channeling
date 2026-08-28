import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { init, effect, surface, frameLoop } from 'vgpu';
import blackHoleShaderSource from '@/shaders/blackHoleRaymarch.wgsl';
import { Orbit, Sparkles, RefreshCw, Eye, Flame, Compass, Maximize2 } from 'lucide-react';

interface BlackHoleTarget {
  id: string;
  name: string;
  type: string;
  mass: string;
  distance: string;
  spin: number;
  temperature: number;
  description: string;
}

const BLACK_HOLE_TARGETS: BlackHoleTarget[] = [
  {
    id: 'sagittarius-a',
    name: 'Sagittarius A*',
    type: 'Supermassive Black Hole',
    mass: '4.154 × 10⁶ M☉',
    distance: '26,673 ly (Galactic Core)',
    spin: 0.9,
    temperature: 1.2,
    description: 'The supermassive gravitational anchor at the exact dynamical center of the Milky Way galaxy.',
  },
  {
    id: 'm87-star',
    name: 'Messier 87*',
    type: 'Supergiant Black Hole',
    mass: '6.5 × 10⁹ M☉',
    distance: '53.5 Mly (Virgo Cluster)',
    spin: 0.8,
    temperature: 1.0,
    description: 'The historic first-ever imaged black hole by the Event Horizon Telescope, powering a 5,000 ly relativistic jet.',
  },
  {
    id: 'gargantua',
    name: 'Gargantua (Kerr Metric)',
    type: 'Extreme Kerr Singularity',
    mass: '1.0 × 10⁸ M☉',
    distance: 'Hypothetical (Interstellar Frame)',
    spin: 1.3,
    temperature: 1.4,
    description: 'A near-extremal rotating Kerr black hole featuring extreme gravitational time dilation and twin photon spheres.',
  },
  {
    id: 'cygnus-x1',
    name: 'Cygnus X-1',
    type: 'Stellar Microquasar',
    mass: '21.2 M☉',
    distance: '7,300 ly (Cygnus Arm)',
    spin: 0.95,
    temperature: 0.8,
    description: 'The first widely accepted stellar-mass black hole candidate, actively stripping plasma from a blue supergiant companion.',
  },
];

export default function RelativisticBlackHoleViewer() {
  const [selectedTarget, setSelectedTarget] = useState<BlackHoleTarget>(BLACK_HOLE_TARGETS[0]);
  const [spinRate, setSpinRate] = useState<number>(0.9);
  const [temperature, setTemperature] = useState<number>(1.2);
  const [lensingStrength, setLensingStrength] = useState<number>(1.0);
  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.4 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [useWebGpu, setUseWebGpu] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; pX: number; pY: number }>({ x: 0, y: 0, pX: 0.5, pY: 0.4 });

  const handleSelectTarget = (target: BlackHoleTarget) => {
    setSelectedTarget(target);
    setSpinRate(target.spin);
    setTemperature(target.temperature);
  };

  // ---------------------------------------------------------------------------
  // Pointer Orbit Dragging
  // ---------------------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      pX: pointer.x,
      pY: pointer.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = (e.clientX - dragStartRef.current.x) / 300;
    const dy = (e.clientY - dragStartRef.current.y) / 300;

    setPointer({
      x: dragStartRef.current.pX + dx,
      y: Math.max(0.1, Math.min(0.9, dragStartRef.current.pY + dy)),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // ---------------------------------------------------------------------------
  // WebGPU Raymarching Pipeline
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

        const output = surface(gpu, canvas, { dpr: Math.min(window.devicePixelRatio || 1, 1.5) });
        const shader = effect(gpu, blackHoleShaderSource);
        const startTime = performance.now();

        const loop = frameLoop(gpu, (f) => {
          const elapsed = (performance.now() - startTime) / 1000;

          shader.set({
            uniforms: {
              resolution: output.size,
              pointer: [pointer.x, pointer.y],
              time: elapsed,
              spinRate: spinRate,
              diskTemperature: temperature,
              lensingStrength: lensingStrength,
            },
          });
          f.pass(output, shader);
        });

        cleanupGpu = () => {
          loop.stop();
          gpu.dispose();
        };
      } catch (err) {
        console.warn('[vGPU] Black Hole WebGPU init skipped, falling back to 2D canvas:', err);
        setUseWebGpu(false);
      }
    }

    mountGpu();

    return () => {
      isDisposed = true;
      if (cleanupGpu) cleanupGpu();
    };
  }, [useWebGpu, pointer, spinRate, temperature, lensingStrength]);

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

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);

      // Outer Accretion Glow
      const grad = ctx.createRadialGradient(0, 0, 30, 0, 0, 140);
      grad.addColorStop(0, 'rgba(255, 200, 100, 0.8)');
      grad.addColorStop(0.4, 'rgba(236, 72, 153, 0.5)');
      grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, 140, 45, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Black Hole Shadow (Event Horizon)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(render2d);
    };

    render2d();
    return () => cancelAnimationFrame(animId);
  }, [useWebGpu]);

  return (
    <Card className="bg-[#1E293B]/90 border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-white/5 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-950/80 text-sky-300 border-sky-500/40 text-[10px] font-mono uppercase">
                General Relativity Viewport
              </Badge>
              <span className="text-xs font-mono text-gray-400">Schwarzschild & Kerr Metric</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-space font-bold mt-1 text-white flex items-center gap-2">
              <Orbit className="w-5 h-5 text-purple-400" />
              Relativistic Singularity & Accretion Simulator
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-gray-300 mt-0.5">
              Simulates light deflection (gravitational lensing), photon sphere rings, and relativistic Doppler beaming.
            </CardDescription>
          </div>

          <Badge className="bg-purple-900/60 text-purple-200 border-purple-400/30 text-xs font-mono self-start sm:self-auto">
            Drag Viewport to Orbit Camera
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Main Raymarching Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Canvas Viewport */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center">
            <div
              className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-purple-500/30 shadow-[0_0_50px_rgba(14,165,233,0.2)] cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
              />

              {/* Viewport HUD Overlay */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono space-y-0.5 text-gray-300 pointer-events-none">
                <div className="text-white font-bold">{selectedTarget.name}</div>
                <div className="text-[10px] text-purple-300">Mass: {selectedTarget.mass}</div>
                <div className="text-[10px] text-sky-300">Distance: {selectedTarget.distance}</div>
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-gray-400 pointer-events-none">
                Raymarch 90 Steps • Einstein Geodesics
              </div>
            </div>
          </div>

          {/* Telemetry & Physics Modifiers */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-300">Active Metric</span>
              <h3 className="text-lg font-space font-bold text-white">{selectedTarget.name}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{selectedTarget.description}</p>
            </div>

            {/* Sliders */}
            <div className="p-4 rounded-2xl bg-[#0F172A]/80 border border-white/5 space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                  <span>Keplerian Spin: {spinRate.toFixed(2)} c</span>
                  <span className="text-purple-400">Plasma Velocity</span>
                </div>
                <Slider
                  min={0.2}
                  max={2.0}
                  step={0.05}
                  value={[spinRate]}
                  onValueChange={(val) => setSpinRate(val[0])}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                  <span>Accretion Temp: {temperature.toFixed(2)}</span>
                  <span className="text-amber-400">Synchrotron Glow</span>
                </div>
                <Slider
                  min={0.4}
                  max={1.8}
                  step={0.05}
                  value={[temperature]}
                  onValueChange={(val) => setTemperature(val[0])}
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-gray-300 mb-1.5">
                  <span>Gravitational Lensing: {(lensingStrength * 100).toFixed(0)}%</span>
                  <span className="text-sky-400">Light Deflection</span>
                </div>
                <Slider
                  min={0.1}
                  max={2.0}
                  step={0.05}
                  value={[lensingStrength]}
                  onValueChange={(val) => setLensingStrength(val[0])}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Target Selectors */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-mono uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Select Singularity Target</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {BLACK_HOLE_TARGETS.map((target) => {
              const isSelected = selectedTarget.id === target.id;
              return (
                <button
                  key={target.id}
                  onClick={() => handleSelectTarget(target)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-sky-950/60 to-purple-950/60 border-sky-400 shadow-lg shadow-sky-950/40 ring-1 ring-sky-400/40'
                      : 'bg-[#0F172A]/60 border-white/5 hover:border-white/20 hover:bg-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-white">{target.name}</span>
                    <Badge className="bg-sky-900/60 text-[9px] font-mono border-sky-500/30">
                      {target.type.split(' ')[0]}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-space text-sky-200 mt-1 truncate">{target.mass}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{target.distance}</p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
