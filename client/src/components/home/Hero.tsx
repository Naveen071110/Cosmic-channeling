import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles, Telescope, Radio, Orbit, Compass, Star } from 'lucide-react';

const Hero = () => {
  return (
    <header className="relative flex flex-col items-center justify-center min-h-[60vh] text-center py-20 px-4 overflow-hidden">
      {/* 1. LCP Hero Background Image with Atmospheric Blend */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
          alt="Deep space spiral galaxy nebula with stars and cosmic dust tapestry" 
          className="w-full h-full object-cover" 
          width={1400}
          height={800}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 via-transparent to-[#0F172A]" />
      </div>

      {/* 2. Animated Cosmic Aura Nebulae (Floating & Pulsing Ambient Energy Orbs) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/25 via-pink-500/20 to-sky-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-pink-600/15 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '2.5s' }} />

      {/* 3. Orbiting Planetary Celestial Guides */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {/* Outer Orbit Ring */}
        <div className="w-[620px] h-[620px] rounded-full border border-purple-500/10 animate-spin [animation-duration:60s] relative">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
        </div>
        {/* Inner Orbit Ring */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-sky-400/15 animate-spin [animation-duration:35s] [animation-direction:reverse]">
          <div className="absolute -bottom-1.5 right-1/4 w-3 h-3 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-300 shadow-[0_0_12px_rgba(14,165,233,0.8)]" />
        </div>
      </div>

      {/* 4. Twinkling Floating Starlight Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-16 text-yellow-300/60 animate-float" style={{ animationDuration: '4s' }}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute top-24 right-20 text-pink-400/60 animate-float" style={{ animationDuration: '5.5s', animationDelay: '1.2s' }}>
          <Star className="w-4 h-4" />
        </div>
        <div className="absolute bottom-16 left-1/4 text-sky-400/50 animate-float" style={{ animationDuration: '6s', animationDelay: '2s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute bottom-20 right-1/4 text-purple-400/60 animate-float" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}>
          <Star className="w-5 h-5" />
        </div>
      </div>
      
      {/* 5. Core Hero Content */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-mono backdrop-blur-md shadow-lg shadow-purple-950/60 animate-float" style={{ animationDuration: '5s' }}>
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin [animation-duration:8s]" />
          <span>Real-Time Solfeggio Soundscapes &amp; NASA Telemetry</span>
        </div>

        {/* Primary Page H1 incorporating target keywords */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space tracking-tight">
          <span className="bg-gradient-to-r from-[#EC4899] via-purple-300 to-[#0EA5E9] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
            Deep Space Sanctuary &amp; Solfeggio Meditation
          </span>
        </h1>

        {/* High Keyword-Density Value Proposition (<100 words) */}
        <p className="text-base sm:text-lg md:text-xl text-[#F1F5F9] max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
          Experience pure 432Hz &amp; 528Hz harmonic Solfeggio soundscapes, an interactive 30+ HD Celestial Atlas, and live NASA space telemetry. Expand your consciousness and discover your celestial alignment in our deep space meditation sanctuary.
        </p>

        {/* Quick Action CTAs with Hover Glow Effects */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link href="/meditate">
            <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white text-xs sm:text-sm h-11 px-6 shadow-xl shadow-purple-950/70 hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all transform hover:-translate-y-0.5">
              <Radio className="w-4 h-4 mr-2 text-pink-200" />
              Begin 432Hz Meditation
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="border-purple-500/40 hover:bg-purple-950/50 text-purple-200 hover:text-white text-xs sm:text-sm h-11 px-6 backdrop-blur-md shadow-lg shadow-purple-950/40 hover:border-purple-400 transition-all transform hover:-translate-y-0.5">
              <Telescope className="w-4 h-4 mr-2 text-sky-400" />
              Explore Celestial Atlas
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;
