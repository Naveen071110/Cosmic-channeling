import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sparkles, Telescope, Radio } from 'lucide-react';

const Hero = () => {
  return (
    <header className="relative flex flex-col items-center justify-center min-h-[55vh] text-center py-16 px-4 overflow-hidden">
      {/* Optimized Hero LCP Background Image with High Fetch Priority & Explicit Dimensions */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80" 
          alt="Deep space spiral galaxy nebula with stars and cosmic dust tapestry" 
          className="w-full h-full object-cover" 
          width={1400}
          height={800}
          fetchPriority="high"
        />
      </div>
      
      <div className="z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-mono backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Real-Time Solfeggio Soundscapes &amp; NASA Telemetry</span>
        </div>

        {/* Primary Page H1 incorporating target keywords */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space tracking-tight">
          <span className="bg-gradient-to-r from-[#EC4899] via-purple-400 to-[#0EA5E9] bg-clip-text text-transparent">
            Deep Space Sanctuary &amp; Solfeggio Meditation
          </span>
        </h1>

        {/* High Keyword-Density Above-the-Fold Value Proposition (<100 words) */}
        <p className="text-base sm:text-lg md:text-xl text-[#F1F5F9] max-w-2xl mx-auto leading-relaxed">
          Experience pure 432Hz &amp; 528Hz harmonic Solfeggio soundscapes, an interactive 30+ HD Celestial Atlas, and live NASA space telemetry. Expand your consciousness and discover your celestial alignment in our deep space meditation sanctuary.
        </p>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <Link href="/meditate">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm h-10 px-5 shadow-lg shadow-purple-950/50">
              <Radio className="w-4 h-4 mr-2" />
              Begin 432Hz Meditation
            </Button>
          </Link>
          <Link href="/explore">
            <Button variant="outline" className="border-purple-500/40 hover:bg-white/5 text-purple-200 text-xs sm:text-sm h-10 px-5 backdrop-blur-sm">
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
