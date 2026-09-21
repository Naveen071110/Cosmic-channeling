import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cosmicAudio } from '@/lib/WebAudioCosmicSynth';
import { Sparkles, Radio, Eye, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CosmicPrism() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;
    let animationId = 0;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 340;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x0ea5e9, 2.5, 10);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xec4899, 2.5, 10);
    pinkLight.position.set(2, -1, 2);
    scene.add(pinkLight);

    // 4. Prism Group (Contains Prism & Edge Lines)
    const prismGroup = new THREE.Group();
    scene.add(prismGroup);

    // Triangular Prism Geometry: 3-sided cylinder
    const prismGeometry = new THREE.CylinderGeometry(1.15, 1.15, 1.8, 3, 1);
    prismGeometry.rotateX(Math.PI / 2);
    prismGeometry.rotateZ(Math.PI / 6);

    // Physical Glass Material with transmission, roughness & IOR
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      transmission: 0.95,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.62, // Crown glass
      thickness: 1.4,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      toneMapped: false,
    });

    const prismMesh = new THREE.Mesh(prismGeometry, glassMaterial);
    prismGroup.add(prismMesh);

    // Luminous Crystal Bevel Edges
    const edgesGeometry = new THREE.EdgesGeometry(prismGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.45,
      linewidth: 1.5,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    prismGroup.add(edgesMesh);

    // 5. Incident White Light Beam (Left to Center)
    const beamGroup = new THREE.Group();
    scene.add(beamGroup);

    const beamGeo = new THREE.CylinderGeometry(0.035, 0.035, 3.2, 16);
    beamGeo.rotateZ(Math.PI / 2);
    beamGeo.translate(-1.8, 0, 0);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const incidentBeam = new THREE.Mesh(beamGeo, beamMat);
    beamGroup.add(incidentBeam);

    // Soft laser aura for incident beam
    const auraGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 16);
    auraGeo.rotateZ(Math.PI / 2);
    auraGeo.translate(-1.8, 0, 0);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const beamAura = new THREE.Mesh(auraGeo, auraMat);
    beamGroup.add(beamAura);

    // 6. Refracted Chromatic Rainbow Dispersion Shader Fan (Center to Right)
    const rainbowVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * viewMatrix * modelPosition;
      }
    `;

    const rainbowFragmentShader = `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uIntensity;

      vec3 physhue2rgb(float hue, float ratio) {
        return smoothstep(
          vec3(0.0), vec3(1.0),
          abs(mod(hue + vec3(0.0, 1.0, 2.0) * ratio, 1.0) * 2.0 - 1.0)
        );
      }

      void main() {
        // vUv.x: 0.0 (near prism) -> 1.0 (far right)
        // vUv.y: 0.0 (violet 432Hz) -> 1.0 (red 285Hz)
        float hue = mix(0.78, 0.02, vUv.y);
        vec3 color = physhue2rgb(hue, 0.33);

        // Volumetric distance falloff
        float alpha = smoothstep(0.02, 0.25, vUv.x) * (1.0 - smoothstep(0.65, 1.0, vUv.x));
        
        // Edge curve smoothing
        float edge = sin(vUv.y * 3.14159);
        alpha *= pow(edge, 0.55);

        // Gentle cosmic shimmer
        float shimmer = 0.88 + 0.12 * sin(uTime * 3.5 + vUv.x * 12.0);
        alpha *= shimmer * uIntensity;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // Fan Plane Geometry: spreads wider as it moves away from the prism
    const fanGeometry = new THREE.PlaneGeometry(3.6, 2.4, 32, 32);
    // Displace vertices into a fanning cone
    const pos = fanGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const progress = (x + 1.8) / 3.6; // 0 at left, 1 at right
      pos.setY(i, y * (0.2 + progress * 1.1));
    }
    fanGeometry.computeVertexNormals();
    fanGeometry.translate(1.9, 0, 0);

    const rainbowMaterial = new THREE.ShaderMaterial({
      vertexShader: rainbowVertexShader,
      fragmentShader: rainbowFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.85 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const rainbowFan = new THREE.Mesh(fanGeometry, rainbowMaterial);
    scene.add(rainbowFan);

    // 7. Interactive Drag & Inertial Rotation
    let targetRotationX = 0.2;
    let targetRotationY = -0.4;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;

      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 8. IntersectionObserver (Pause RAF when off-screen)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // 9. Resize Handler
    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // 10. Animation Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed) return;
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Idle zero-gravity floating tumble
      if (!isDragging) {
        targetRotationY += 0.0035;
        targetRotationX += Math.sin(elapsed * 0.5) * 0.0008;
      }

      // Smooth inertial damping
      prismGroup.rotation.y += (targetRotationY - prismGroup.rotation.y) * 0.08;
      prismGroup.rotation.x += (targetRotationX - prismGroup.rotation.x) * 0.08;

      // Subtle vertical floating bob
      prismGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;

      // Update rainbow shader
      rainbowMaterial.uniforms.uTime.value = elapsed;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationId);
      observer.disconnect();

      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', onResize);

      scene.clear();
      prismGeometry.dispose();
      glassMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      fanGeometry.dispose();
      rainbowMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const triggerFrequencyTone = (freq: number) => {
    setActiveFrequency(freq);
    cosmicAudio.playBowlChime(freq);
    setTimeout(() => setActiveFrequency(null), 3500);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl h-72 sm:h-80 mx-auto my-4 rounded-2xl bg-gradient-to-b from-purple-950/20 via-black/40 to-transparent border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] backdrop-blur-sm overflow-hidden group select-none"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Status & Interaction Hint Badge */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-purple-500/30 text-purple-200 text-xs font-mono backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin [animation-duration:8s]" />
          <span>Cosmic Light Channeler</span>
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-black/40 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
          <RotateCw className="w-3 h-3 text-sky-400 animate-spin [animation-duration:12s]" />
          <span>Drag to rotate prism</span>
        </div>
      </div>

      {/* Interactive Solfeggio Resonance Triggers along the Spectrum */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerFrequencyTone(432)}
            className={`h-7 px-2.5 text-xs font-mono transition-all backdrop-blur-md ${
              activeFrequency === 432
                ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-105'
                : 'bg-black/60 hover:bg-purple-950/60 text-purple-300 border-purple-500/30'
            }`}
          >
            <Radio className="w-3 h-3 mr-1 text-pink-400" />
            432 Hz Violet Ray
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerFrequencyTone(528)}
            className={`h-7 px-2.5 text-xs font-mono transition-all backdrop-blur-md ${
              activeFrequency === 528
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] scale-105'
                : 'bg-black/60 hover:bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
            }`}
          >
            <Radio className="w-3 h-3 mr-1 text-emerald-400" />
            528 Hz Emerald Ray
          </Button>
        </div>

        <span className="hidden sm:inline text-[11px] text-purple-300/80 font-mono">
          {activeFrequency ? `Resonating at ${activeFrequency} Hz` : 'Click ray to sound chime'}
        </span>
      </div>
    </div>
  );
}
