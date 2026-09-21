import { lazy, Suspense } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles, Telescope, Radio, Orbit, Compass, Star } from 'lucide-react';

const CosmicPrism = lazy(() => import('@/components/features/CosmicPrism'));

const Hero = () => {
  return (
    <header className="relative flex flex-col items-center justify-center min-h-[65vh] text-center py-16 sm:py-24 px-4 overflow-hidden">
      {/* 1. LCP Hero Background Image with Atmospheric Blend */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
          alt="Deep space spiral galaxy nebula with stars and cosmic dust tapestry" 
          className="w-full h-full object-cover" 
          width={1400}
          height={800}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#090A0F] via-transparent to-[#090A0F]" />
      </div>

      {/* 2. Subdued Celestial Ambient Mesh (Soft, refined atmospheric illumination) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 3. Orbiting Planetary Celestial Guides (Minimalist, fine starlight strokes) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Outer Orbit Ring */}
        <div className="w-[640px] h-[640px] rounded-full border border-white/[0.04] animate-spin [animation-duration:80s] relative">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
        {/* Inner Orbit Ring */}
        <div className="absolute w-[460px] h-[460px] rounded-full border border-white/[0.05] animate-spin [animation-duration:45s] [animation-direction:reverse]">
          <div className="absolute -bottom-1 right-1/4 w-2 h-2 rounded-full bg-slate-300/70 shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </div>
      </div>

      {/* 4. Twinkling Floating Starlight Accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-16 text-white/30 animate-float" style={{ animationDuration: '6s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-24 right-20 text-white/25 animate-float" style={{ animationDuration: '7s', animationDelay: '1.5s' }}>
          <Star className="w-3.5 h-3.5" />
        </div>
        <div className="absolute bottom-16 left-1/4 text-white/20 animate-float" style={{ animationDuration: '8s', animationDelay: '2.5s' }}>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="absolute bottom-20 right-1/4 text-white/25 animate-float" style={{ animationDuration: '6.5s', animationDelay: '1s' }}>
          <Star className="w-3.5 h-3.5" />
        </div>
      </div>
      
      {/* 5. Core Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-7">
        {/* Minimalist Micro-Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-[#E2E8F0] text-xs font-mono tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>Real-Time Solfeggio Soundscapes &amp; NASA Telemetry</span>
        </div>

        {/* Primary Page H1 with crisp, disciplined typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold font-space tracking-tight text-[#F8FAFC]">
          Deep Space Sanctuary &amp; Solfeggio Meditation
        </h1>

        {/* High Keyword-Density Value Proposition (<100 words) */}
        <p className="text-base sm:text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-normal">
          Experience pure 432Hz &amp; 528Hz harmonic Solfeggio soundscapes, an interactive 30+ HD Celestial Atlas, and live NASA space telemetry. Expand your consciousness and discover your celestial alignment in our deep space meditation sanctuary.
        </p>

        {/* 6. Interactive 3D Cosmic Prism Centerpiece */}
        <Suspense fallback={
          <div className="w-full max-w-2xl h-72 sm:h-80 mx-auto my-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col items-center justify-center gap-3 backdrop-blur-md">
            <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white/70 animate-spin" />
            <span className="text-xs font-mono text-[#94A3B8]">Aligning Optical Crystal Prism...</span>
          </div>
        }>
          <CosmicPrism />
        </Suspense>

        {/* Tactile, Minimalist CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/meditate">
            <Button className="bg-white text-black hover:bg-slate-200 text-xs sm:text-sm font-medium h-11 px-7 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <Radio className="w-4 h-4 mr-2 text-slate-800" />
              Begin 432Hz Meditation
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="border-white/15 bg-white/[0.02] hover:bg-white/[0.06] text-[#E2E8F0] hover:text-white text-xs sm:text-sm font-medium h-11 px-7 rounded-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
              <Telescope className="w-4 h-4 mr-2 text-slate-300" />
              Explore Celestial Atlas
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;
