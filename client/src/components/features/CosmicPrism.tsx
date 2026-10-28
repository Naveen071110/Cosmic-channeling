import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cosmicAudio } from '@/lib/WebAudioCosmicSynth';
import { Sparkles, Radio, RotateCw, Orbit, Compass, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type FormationMode = 'nebula' | 'mandala' | 'galaxy';

const MODE_INDICES: Record<FormationMode, number> = {
  nebula: 0.0,
  mandala: 1.0,
  galaxy: 2.0,
};

export default function CosmicPrism() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);
  const [formationMode, setFormationMode] = useState<FormationMode>('nebula');
  const [, setIsInteracting] = useState(false);

  // Refs for animation loop synchronization without tearing down WebGL pipeline
  const activeFrequencyRef = useRef<number | null>(null);
  const currentModeRef = useRef<number>(0.0);
  const prevModeRef = useRef<number>(0.0);
  const morphProgressRef = useRef<number>(1.0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDisposed = false;
    let isContextLost = false;
    let animationId = 0;
    let isVisible = true;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 340;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // 2. Renderer with Mobile-Hardened DPR Capping (Max 1.75 to prevent thermal throttling)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
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
      ior: 1.62,
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

    // 6. Refracted Chromatic Rainbow Dispersion Shader Fan with Audio Reactivity
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
      uniform float uAudioEnergy;
      uniform float uFrequency;

      vec3 physhue2rgb(float hue, float ratio) {
        return smoothstep(
          vec3(0.0), vec3(1.0),
          abs(mod(hue + vec3(0.0, 1.0, 2.0) * ratio, 1.0) * 2.0 - 1.0)
        );
      }

      void main() {
        float hue = mix(0.78, 0.02, vUv.y);

        // Active Solfeggio frequency shift
        if (uFrequency > 500.0) {
          hue = mix(hue, 0.38, 0.55); // Emerald Green shift (528Hz)
        } else if (uFrequency > 400.0) {
          hue = mix(hue, 0.76, 0.55); // Violet Ray shift (432Hz)
        }

        vec3 color = physhue2rgb(hue, 0.33);

        float alpha = smoothstep(0.02, 0.25, vUv.x) * (1.0 - smoothstep(0.65, 1.0, vUv.x));
        float edge = sin(vUv.y * 3.14159);
        alpha *= pow(edge, 0.55);

        // Sound-reactive shimmer
        float shimmer = 0.88 + 0.12 * sin(uTime * 3.5 + vUv.x * 12.0) + (uAudioEnergy * 0.4);
        alpha *= shimmer * uIntensity;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const fanGeometry = new THREE.PlaneGeometry(3.6, 2.4, 32, 32);
    const pos = fanGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const progress = (x + 1.8) / 3.6;
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
        uAudioEnergy: { value: 0.0 },
        uFrequency: { value: 0.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const rainbowFan = new THREE.Mesh(fanGeometry, rainbowMaterial);
    scene.add(rainbowFan);

    // 7. GPU-Calculated Particle Choreography Engine (3,000 Parallel Particles)
    const PARTICLE_COUNT = 3000;
    const particleGeometry = new THREE.BufferGeometry();

    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pPhases = new Float32Array(PARTICLE_COUNT);
    const pRadii = new Float32Array(PARTICLE_COUNT);
    const pSpeeds = new Float32Array(PARTICLE_COUNT);
    const pSeeds = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const radius = 0.6 + Math.random() * 2.4;
      const angle = Math.random() * Math.PI * 2;
      const heightOffset = (Math.random() - 0.5) * 1.8;

      pPositions[i * 3 + 0] = Math.cos(angle) * radius;
      pPositions[i * 3 + 1] = heightOffset;
      pPositions[i * 3 + 2] = Math.sin(angle) * radius;

      pPhases[i] = Math.random() * Math.PI * 2;
      pRadii[i] = radius;
      pSpeeds[i] = 0.4 + Math.random() * 0.8;
      pSeeds[i] = Math.random();
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(pPhases, 1));
    particleGeometry.setAttribute('aRadius', new THREE.BufferAttribute(pRadii, 1));
    particleGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(pSpeeds, 1));
    particleGeometry.setAttribute('aSeed', new THREE.BufferAttribute(pSeeds, 1));

    const particleVertexShader = `
      attribute float aPhase;
      attribute float aRadius;
      attribute float aSpeed;
      attribute float aSeed;

      uniform float uTime;
      uniform float uMode;
      uniform float uPrevMode;
      uniform float uMorph;
      uniform float uAudioEnergy;
      uniform float uFrequency;

      varying float vSeed;
      varying float vRadius;
      varying float vAudio;

      vec3 calculatePosition(float mode) {
        if (mode < 0.5) {
          // Mode 0: Nebula Vortex (Swirling dual-arm vortex with vertical turbulence)
          float theta = aPhase + uTime * 0.35 * aSpeed;
          float r = aRadius * (1.0 + 0.3 * uAudioEnergy);
          float yWave = sin(theta * 2.0 + uTime * 1.2) * 0.4 + (position.y * 0.7);
          return vec3(r * cos(theta), yWave, r * sin(theta));
        } else if (mode < 1.5) {
          // Mode 1: Sacred Geometry Mandala (6-fold Flower of Life harmonic rosettes)
          float petals = 6.0;
          float theta = aPhase + uTime * 0.18;
          float r = aRadius * (0.65 + 0.45 * sin(theta * petals)) * (1.0 + 0.35 * uAudioEnergy);
          float yWave = sin(uTime * 1.5 + aPhase * 3.0) * 0.22;
          return vec3(r * cos(theta), yWave, r * sin(theta));
        } else {
          // Mode 2: Spiral Galaxy (Logarithmic spiral with differential rotation & core bulge)
          float armOffset = mod(aSeed * 100.0, 2.0) > 1.0 ? 3.14159 : 0.0;
          float omega = 0.75 / (0.4 + aRadius);
          float theta = aPhase * 0.5 + (uTime * omega) + armOffset;
          float r = aRadius * 1.6 * (1.0 + 0.25 * uAudioEnergy);
          float coreBulge = exp(-aRadius * 2.2) * 0.45;
          float yWave = (position.y * 0.25 + sin(uTime * 0.8 + aPhase) * 0.08) * (1.0 + coreBulge);
          return vec3(r * cos(theta), yWave, r * sin(theta));
        }
      }

      void main() {
        vSeed = aSeed;
        vRadius = aRadius;
        vAudio = uAudioEnergy;

        vec3 posPrev = calculatePosition(uPrevMode);
        vec3 posCurr = calculatePosition(uMode);
        vec3 finalPos = mix(posPrev, posCurr, smoothstep(0.0, 1.0, uMorph));

        vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Dynamic Point Attenuation based on depth & audio resonance
        float baseSize = 4.5 + (uAudioEnergy * 6.5);
        gl_PointSize = baseSize * (1.0 / -mvPosition.z) * 170.0;
        gl_PointSize = clamp(gl_PointSize, 1.5, 30.0);
      }
    `;

    const particleFragmentShader = `
      uniform float uTime;
      uniform float uFrequency;
      uniform float uAudioEnergy;

      varying float vSeed;
      varying float vRadius;
      varying float vAudio;

      void main() {
        // Soft gaussian circular disc
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.02, dist);
        alpha = pow(alpha, 1.35);

        // Celestial Palette with Harmonic Tone Sensitivity
        vec3 colorStarlight = vec3(0.92, 0.95, 1.0);
        vec3 colorViolet = vec3(0.75, 0.52, 0.99); // 432 Hz
        vec3 colorEmerald = vec3(0.2, 0.83, 0.6);   // 528 Hz
        vec3 colorAzure = vec3(0.06, 0.65, 0.95);

        vec3 baseColor = mix(colorStarlight, colorAzure, vRadius / 3.0);

        if (uFrequency > 500.0) {
          baseColor = mix(baseColor, colorEmerald, 0.7);
        } else if (uFrequency > 400.0) {
          baseColor = mix(baseColor, colorViolet, 0.7);
        } else {
          float pulse = sin(uTime * 1.5 + vSeed * 6.28) * 0.5 + 0.5;
          baseColor = mix(baseColor, colorViolet, pulse * 0.45);
        }

        gl_FragColor = vec4(baseColor, alpha * (0.65 + 0.35 * vAudio));
      }
    `;

    const particleMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMode: { value: 0.0 },
        uPrevMode: { value: 0.0 },
        uMorph: { value: 1.0 },
        uAudioEnergy: { value: 0.0 },
        uFrequency: { value: 0.0 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particlePoints);

    // 8. Interactive Drag & Inertial Rotation
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

    // 9. WebGL Context Loss & Recovery Handlers
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(animationId);
      isContextLost = true;
      console.warn('[WebGL] Context lost. Pausing rendering loop.');
    };

    const handleContextRestored = () => {
      console.info('[WebGL] Context restored. Rebuilding GPU pipelines.');
      isContextLost = false;
      renderer.setSize(container.clientWidth || 600, container.clientHeight || 340);
      animate();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // 10. Visibility & Resize Handlers
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    const onResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', onResize);

    // 11. Animation Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      if (isDisposed || isContextLost) return;
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Zero-gravity idle rotation
      if (!isDragging) {
        targetRotationY += 0.0035;
        targetRotationX += Math.sin(elapsed * 0.5) * 0.0008;
      }

      // Smooth inertial damping
      prismGroup.rotation.y += (targetRotationY - prismGroup.rotation.y) * 0.08;
      prismGroup.rotation.x += (targetRotationX - prismGroup.rotation.x) * 0.08;
      prismGroup.position.y = Math.sin(elapsed * 1.2) * 0.08;

      // Sample real-time audio energy from Web Audio API
      const audioEnergy = cosmicAudio.getAverageEnergy();
      const freqTone = activeFrequencyRef.current || 0.0;

      // Update Rainbow dispersion uniforms
      rainbowMaterial.uniforms.uTime.value = elapsed;
      rainbowMaterial.uniforms.uAudioEnergy.value = audioEnergy;
      rainbowMaterial.uniforms.uFrequency.value = freqTone;

      // Update Particle choreography uniforms
      if (morphProgressRef.current < 1.0) {
        morphProgressRef.current = Math.min(1.0, morphProgressRef.current + delta * 1.8);
      }
      particleMaterial.uniforms.uTime.value = elapsed;
      particleMaterial.uniforms.uMode.value = currentModeRef.current;
      particleMaterial.uniforms.uPrevMode.value = prevModeRef.current;
      particleMaterial.uniforms.uMorph.value = morphProgressRef.current;
      particleMaterial.uniforms.uAudioEnergy.value = audioEnergy;
      particleMaterial.uniforms.uFrequency.value = freqTone;

      // Rotate particle cloud gently with the galactic field
      particlePoints.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Complete Resource Disposal on Unmount
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
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
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
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  const triggerFrequencyTone = (freq: number) => {
    setActiveFrequency(freq);
    activeFrequencyRef.current = freq;
    cosmicAudio.playBowlChime(freq);
    setTimeout(() => {
      setActiveFrequency(null);
      activeFrequencyRef.current = null;
    }, 3500);
  };

  const handleSelectFormation = (mode: FormationMode) => {
    if (mode === formationMode) return;
    prevModeRef.current = currentModeRef.current;
    currentModeRef.current = MODE_INDICES[mode];
    morphProgressRef.current = 0.0;
    setFormationMode(mode);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-2xl h-80 sm:h-96 mx-auto my-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-md overflow-hidden group select-none transition-all duration-300 hover:border-white/15"
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Top Status & Interaction Hint Badge */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[#E2E8F0] text-xs font-mono backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>Cosmic Light Channeler</span>
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8] bg-black/40 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          <RotateCw className="w-3 h-3 text-slate-400" />
          <span>Drag to rotate prism</span>
        </div>
      </div>

      {/* Switchable GPU Particle Formations Bar (Top-Center) */}
      <div className="absolute top-12 left-3.5 right-3.5 flex items-center justify-center gap-1.5 pointer-events-auto">
        <div className="inline-flex items-center p-1 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => handleSelectFormation('nebula')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
              formationMode === 'nebula'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3 h-3" />
            Nebula Vortex
          </button>

          <button
            onClick={() => handleSelectFormation('mandala')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
              formationMode === 'mandala'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3 h-3" />
            Sacred Mandala
          </button>

          <button
            onClick={() => handleSelectFormation('galaxy')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
              formationMode === 'galaxy'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3 h-3" />
            Spiral Galaxy
          </button>
        </div>
      </div>

      {/* Interactive Solfeggio Resonance Triggers along the Spectrum */}
      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerFrequencyTone(432)}
            className={`h-7 px-3 text-xs font-mono rounded-lg transition-all backdrop-blur-md ${
              activeFrequency === 432
                ? 'bg-white text-black border-white shadow-sm scale-105'
                : 'bg-black/60 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3 mr-1 text-slate-400" />
            432 Hz Violet Ray
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerFrequencyTone(528)}
            className={`h-7 px-3 text-xs font-mono rounded-lg transition-all backdrop-blur-md ${
              activeFrequency === 528
                ? 'bg-white text-black border-white shadow-sm scale-105'
                : 'bg-black/60 hover:bg-white/10 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3 mr-1 text-slate-400" />
            528 Hz Emerald Ray
          </Button>
        </div>

        <span className="hidden sm:inline text-[11px] text-[#94A3B8] font-mono">
          {activeFrequency ? `Resonating at ${activeFrequency} Hz` : 'Click ray to sound chime'}
        </span>
      </div>
    </div>
  );
}
