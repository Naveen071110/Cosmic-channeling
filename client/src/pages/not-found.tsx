import { Link } from "wouter";
import { Compass, Home, Sparkles, Radio, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-16 bg-[#090A0F] text-[#F8FAFC]">
      <SEO
        title="404: Deep Space Singularity | Cosmic Channeling"
        description="The celestial entity or cosmic coordinate you are seeking has drifted beyond our observable event horizon. Return to sanctuary or explore our 30+ Celestial Atlas."
        canonical="https://cosmic-channeling.vercel.app/404"
      />

      <div className="relative max-w-xl w-full mx-auto text-center">
        {/* Ambient Cosmic Radial Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 md:p-12 shadow-2xl space-y-6">
          {/* Micro-label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-[#94A3B8] uppercase">
            <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Telemetry Lost • Error 404</span>
          </div>

          {/* Starlight Compass Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-b from-purple-500/10 to-transparent border border-white/10 flex items-center justify-center text-purple-300 shadow-inner">
            <Compass className="w-10 h-10 stroke-[1.2] animate-spin duration-1000" style={{ animationDuration: "25s" }} />
          </div>

          {/* Display Title */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC] font-space">
              Lost in the Deep Space Horizon
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-md mx-auto">
              The astronomical coordinate or sanctuary chamber you sought has shifted beyond our observable catalog. Let us guide you back to cosmic harmony.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white text-[#090A0F] hover:bg-slate-200 font-medium px-5 py-2.5 rounded-xl transition-all shadow-md">
                <Home className="w-4 h-4 mr-2" />
                Return to Sanctuary
              </Button>
            </Link>

            <Link href="/meditate" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-[#E2E8F0] px-5 py-2.5 rounded-xl">
                <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                432Hz Soundscapes
              </Button>
            </Link>

            <Link href="/explore" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-[#E2E8F0] px-5 py-2.5 rounded-xl">
                <Compass className="w-4 h-4 mr-2 text-cyan-400" />
                Celestial Atlas
              </Button>
            </Link>
          </div>

          {/* Quick Breadcrumbs */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-4 text-xs text-[#94A3B8]">
            <Link href="/tools" className="hover:text-white transition-colors">Cosmic Tools</Link>
            <span>•</span>
            <Link href="/journal" className="hover:text-white transition-colors">Astro-Journal</Link>
            <span>•</span>
            <Link href="/developers" className="hover:text-white transition-colors">Developer API</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Support Desk</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
