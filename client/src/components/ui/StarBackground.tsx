import { useEffect, useRef, useState } from "react";
import { init, effect, surface, frameLoop } from "vgpu";
import starfieldShaderSource from "@/shaders/starfield.wgsl";

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useWebGpu, setUseWebGpu] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // 1. Hardware-Accelerated WebGPU Pipeline (vGPU)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !useWebGpu) return;

    let isDisposed = false;
    let cleanupGpu: (() => void) | null = null;

    async function mountWebGpu() {
      try {
        if (typeof navigator === "undefined" || !(navigator as any).gpu) {
          setUseWebGpu(false);
          return;
        }

        const gpu = await init();
        if (isDisposed || !canvas) {
          gpu.dispose();
          return;
        }

        const output = surface(gpu, canvas, { dpr: Math.min(window.devicePixelRatio || 1, 2) });
        const shader = effect(gpu, starfieldShaderSource);

        let pointer = [0.5, 0.5];
        const onMouseMove = (e: MouseEvent) => {
          if (window.innerWidth > 0 && window.innerHeight > 0) {
            pointer = [e.clientX / window.innerWidth, e.clientY / window.innerHeight];
          }
        };
        window.addEventListener("mousemove", onMouseMove);

        const startTime = performance.now();

        // 60-120 FPS hardware-accelerated GPU render pass
        const loop = frameLoop(gpu, (f) => {
          const elapsed = (performance.now() - startTime) / 1000;
          shader.set({
            uniforms: {
              resolution: output.size,
              pointer,
              time: elapsed,
              intensity: 1.0,
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
        console.warn("[vGPU] Starfield WebGPU initialization skipped, falling back to 2D canvas:", err);
        setUseWebGpu(false);
      }
    }

    mountWebGpu();

    return () => {
      isDisposed = true;
      if (cleanupGpu) cleanupGpu();
    };
  }, [useWebGpu]);

  // ---------------------------------------------------------------------------
  // 2. Resilient Canvas 2D Particle Engine with Dynamic Drifting & Twinkling
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (useWebGpu) return; // Skip 2D canvas if WebGPU is active

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    type Star = {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      baseColor: string;
    };

    const colorPalette = [
      "255, 255, 255", // Pure white
      "135, 206, 250", // Light sky blue
      "192, 132, 252", // Cosmic purple
      "244, 114, 182", // Nebula pink
      "253, 224, 71",  // Stardust gold
    ];

    const starCount = Math.min(Math.floor((canvas.width * canvas.height) / 3500), 200);
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const colorIndex = Math.floor(Math.random() * colorPalette.length);
      const opacity = Math.random() * 0.6 + 0.4;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.6,
        opacity,
        speed: Math.random() * 0.15 + 0.05,
        baseColor: colorPalette[colorIndex],
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    let lastTime = performance.now();

    const draw = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star, idx) => {
        // Slow vertical drift upwards
        star.y -= star.speed * 40 * delta;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }

        // Procedural twinkling
        const twinkle = Math.sin(now * 0.002 + idx * 0.7) * 0.3 + 0.7;
        const currentOpacity = Math.max(0.15, Math.min(1.0, star.opacity * twinkle));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (0.8 + twinkle * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.baseColor}, ${currentOpacity})`;
        ctx.shadowBlur = star.size > 1.2 ? 6 : 0;
        ctx.shadowColor = `rgba(${star.baseColor}, ${currentOpacity * 0.8})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Interactive cursor repulsion force
        const distX = mouseX - star.x;
        const distY = mouseY - star.y;
        const dist = Math.sqrt(distX * distX + distY * distY);

        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 3000;
          star.x -= (distX / dist) * force * 100 * delta;
          star.y -= (distY / dist) * force * 100 * delta;
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [useWebGpu]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none w-full h-full z-0 opacity-80"
    />
  );
}