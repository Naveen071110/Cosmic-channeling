import { useEffect, useRef, useState } from "react";
import { init, effect, surface, frameLoop } from "vgpu";
import foilShaderSource from "@/shaders/cosmicFoil.wgsl";

interface WebGpuHologramProps {
  rulingFrequency: number;
  auraHex?: string;
  className?: string;
}

// Convert Hex to normalized RGB vec3f
function hexToVec3(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16) || 0x7e22ce;
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function WebGpuHologram({
  rulingFrequency,
  auraHex = "#EC4899",
  className = "",
}: WebGpuHologramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDisposed = false;
    let cleanupGpu: (() => void) | null = null;

    async function mountWebGpu() {
      try {
        // Safe check for browser WebGPU support
        if (typeof navigator === "undefined" || !(navigator as any).gpu) {
          setIsSupported(false);
          return;
        }

        const gpu = await init();
        if (isDisposed || !canvas) {
          gpu.dispose();
          return;
        }

        const output = surface(gpu, canvas, { dpr: Math.min(window.devicePixelRatio || 1, 2) });
        const shader = effect(gpu, foilShaderSource);

        let pointer = [0.5, 0.5];
        const onMouseMove = (e: MouseEvent) => {
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            pointer = [
              Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
              Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
            ];
          }
        };
        window.addEventListener("mousemove", onMouseMove);

        const startTime = performance.now();

        // 60-120 FPS hardware-accelerated render loop
        const loop = frameLoop(gpu, (f) => {
          const elapsed = (performance.now() - startTime) / 1000;
          shader.set({
            uniforms: {
              resolution: output.size,
              pointer,
              time: elapsed,
              archetypeFrequency: rulingFrequency || 528,
              auraColor: hexToVec3(auraHex),
            },
          });
          f.pass(output, shader);
        });

        cleanupGpu = () => {
          window.removeEventListener("mousemove", onMouseMove);
          loop.stop();
          gpu.dispose();
        };
      } catch (err) {
        console.warn("[vGPU] WebGPU initialization skipped, falling back to CSS:", err);
        setIsSupported(false);
      }
    }

    mountWebGpu();

    return () => {
      isDisposed = true;
      if (cleanupGpu) cleanupGpu();
    };
  }, [rulingFrequency, auraHex]);

  if (!isSupported) {
    // Fallback: zero-jank CSS gradient layer for legacy browsers
    return (
      <div
        className={`absolute inset-0 pointer-events-none rounded-2xl opacity-60 bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-sky-500/20 ${className}`}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none rounded-2xl ${className}`}
    />
  );
}
