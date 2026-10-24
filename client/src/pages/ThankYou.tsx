import { Link } from "wouter";
import { CheckCircle2, Sparkles, Compass, BookOpen, ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

export default function ThankYou() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-16 bg-[#090A0F] text-[#F8FAFC]">
      <SEO
        title="Transmission Received | Cosmic Channeling"
        description="Your cosmic transmission has been harmonized with our sanctuary. Begin your 432Hz deep space meditation or explore the 30+ Celestial Atlas."
        canonical="https://cosmic-channeling.vercel.app/thank-you"
      />

      <div className="relative max-w-xl w-full mx-auto text-center">
        {/* Soft Ambient Radiance */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 md:p-12 shadow-2xl space-y-6">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono tracking-widest text-emerald-400 uppercase">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Transmission Synchronized</span>
          </div>

          {/* Success Starlight Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-b from-emerald-500/20 to-purple-500/5 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/40">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>

          {/* Display Headings */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC] font-space">
              Thank You for Connecting
            </h1>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-md mx-auto">
              Your message and energy have been registered into the cosmic registry. We look forward to exploring the infinite wonders of consciousness with you.
            </p>
          </div>

          {/* Value Summary Card */}
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-left space-y-2 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2 text-[#E2E8F0] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>What happens next?</span>
            </div>
            <p className="leading-relaxed">
              Our stellar team typically responds to correspondence within 24–48 planetary hours. In the meantime, immerse yourself in our free meditation sanctuary and real-time NASA feeds.
            </p>
          </div>

          {/* Onward Journey CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/meditate" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white text-[#090A0F] hover:bg-slate-200 font-medium px-5 py-2.5 rounded-xl transition-all shadow-md">
                <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
                432Hz Soundscapes
              </Button>
            </Link>

            <Link href="/explore" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-[#E2E8F0] px-5 py-2.5 rounded-xl">
                <Compass className="w-4 h-4 mr-2 text-cyan-400" />
                Explore Atlas
              </Button>
            </Link>

            <Link href="/journal" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-[#E2E8F0] px-5 py-2.5 rounded-xl">
                <BookOpen className="w-4 h-4 mr-2 text-purple-400" />
                Astro-Journal
              </Button>
            </Link>
          </div>

          {/* Return Home Link */}
          <div className="pt-2">
            <Link href="/" className="inline-flex items-center text-xs text-[#94A3B8] hover:text-white transition-colors">
              Return to Sanctuary Homepage
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
