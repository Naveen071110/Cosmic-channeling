import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Telescope, Heart, Waves, Globe, Compass, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Our Vision & Origins</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-space text-white">
          About <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">Cosmic Channeling</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Bridging modern astrophysical discovery with meditative consciousness expansion, sacred acoustic geometry, and universal wonder.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="bg-[#0F172A]/90 border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-xl">
        <h2 className="text-2xl font-space font-bold text-white flex items-center gap-2">
          <Telescope className="w-6 h-6 text-sky-400" />
          Our Mission: Look Up, Breathe In, Connect Out
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-gray-300 leading-relaxed">
          <p>
            As Carl Sagan famously remarked, <em>"The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."</em> In a hyper-accelerated, fragmented world, Cosmic Channeling was conceived as a digital sanctuary where the grandeur of deep space meets the stillness of human mindfulness.
          </p>
          <p>
            We believe that gazing at the James Webb Space Telescope’s cosmic cliffscapes or contemplating the Event Horizon of Sagittarius A* is not merely an intellectual pursuit—it is a profound spiritual experience that dissolves ego, reduces daily anxiety, and reconnects us to the vast cosmic tapestry.
          </p>
        </div>
      </Card>

      {/* Engineering & Sound Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#0F172A]/90 border-[#334155] p-6 space-y-4">
          <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <Waves className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-space font-bold text-white">Procedural Web Audio Synthesis</h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Rather than relying on lossy MP3 loops or third-party audio streams, our meditation sanctuary generates mathematical Solfeggio sine waves (432Hz Peace, 528Hz Vitality), 6Hz Theta binaural beat carriers, and Tibetan bowl strike harmonics in real-time directly inside the browser using the Web Audio API.
          </p>
        </Card>

        <Card className="bg-[#0F172A]/90 border-[#334155] p-6 space-y-4">
          <div className="w-10 h-10 rounded-full bg-sky-900/60 border border-sky-400/30 flex items-center justify-center text-sky-300">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-space font-bold text-white">Edge Performance & Agentic Web</h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Built with modern edge infrastructure across Vercel and Cloudflare Workers, Cosmic Channeling supports native OpenAPI 3.1 specifications, machine-readable <code>llms.txt</code> agent discovery, and instant <code>Accept: text/markdown</code> content negotiation for AI agents and human explorers alike.
          </p>
        </Card>
      </div>

      {/* Creator Attribution */}
      <Card className="bg-[#0B0F19] border-purple-500/40 p-6 sm:p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mx-auto text-white shadow-lg">
          <Heart className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-space font-bold text-white">Creator & Vision</h3>
        <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed">
          Cosmic Channeling is designed and built with ❤️ by <a href="https://naveenguru.vercel.app" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline font-medium">Naveen</a>. We are dedicated to creating high-craft, peaceful software that elevates human consciousness and inspires curiosity about the boundless universe.
        </p>
      </Card>
    </main>
  );
}
