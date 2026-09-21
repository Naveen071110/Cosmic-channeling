import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#090A0F]/90 backdrop-blur-md border-t border-white/[0.08] mt-auto text-[#94A3B8] text-sm">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <i className="ri-planet-line text-base text-[#F8FAFC]"></i>
              </div>
              <h3 className="text-base font-space font-semibold text-[#F8FAFC] tracking-tight">
                Cosmic Channeling
              </h3>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed pr-4 font-normal">
              Explore the living universe through harmonic meditation, celestial data, and cosmic mindfulness.
            </p>
            <div className="pt-1">
              <a
                href="https://www.youtube.com/@CosmicChanneling001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
                aria-label="Cosmic Channeling YouTube"
              >
                <i className="ri-youtube-line text-base text-red-400"></i>
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>
          
          {/* Explore Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F8FAFC]">Explore</h4>
            <div className="space-y-2 text-xs">
              <Link href="/meditate" className="block text-[#94A3B8] hover:text-white transition-colors">
                Guided Meditations
              </Link>
              <Link href="/explore" className="block text-[#94A3B8] hover:text-white transition-colors">
                Celestial Objects
              </Link>
              <Link href="/journal" className="block text-[#94A3B8] hover:text-white transition-colors">
                Astro-Journal
              </Link>
              <Link href="/tools" className="block text-[#94A3B8] hover:text-white transition-colors">
                Cosmic Tools & Signals
              </Link>
            </div>
          </div>
          
          {/* Content & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F8FAFC]">Platform</h4>
            <div className="space-y-2 text-xs">
              <Link href="/about" className="block text-[#94A3B8] hover:text-white transition-colors">
                About & Vision
              </Link>
              <Link href="/blog" className="block text-[#94A3B8] hover:text-white transition-colors">
                Cosmic Insights Blog
              </Link>
              <Link href="/religions" className="block text-[#94A3B8] hover:text-white transition-colors">
                Spiritual Traditions
              </Link>
              <Link href="/subscribe" className="block text-[#94A3B8] hover:text-white transition-colors">
                Cosmic Membership
              </Link>
              <Link href="/contact" className="block text-[#94A3B8] hover:text-white transition-colors">
                Contact & Support
              </Link>
            </div>
          </div>

          {/* Developers & AI Discovery */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F8FAFC]">Developers & AI</h4>
            <div className="space-y-2 text-xs">
              <Link href="/developers" className="block text-[#94A3B8] hover:text-white transition-colors">
                Developer Hub
              </Link>
              <a href="/openapi.json" target="_blank" rel="noopener noreferrer" className="block text-[#94A3B8] hover:text-white transition-colors">
                OpenAPI 3.1 Spec
              </a>
              <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="block text-[#94A3B8] hover:text-white transition-colors">
                Agent Guide (llms.txt)
              </a>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="block text-[#94A3B8] hover:text-white transition-colors">
                XML Sitemap
              </a>
            </div>
          </div>
          
          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#F8FAFC]">Legal & Privacy</h4>
            <div className="space-y-2 text-xs">
              <Link href="/terms" className="block text-[#94A3B8] hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-[#94A3B8] hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))}
                className="block text-left text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
              >
                Cookie Preferences
              </button>
              <Link href="/auth" className="block text-[#94A3B8] hover:text-white transition-colors">
                Account Portal
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Attribution Bar */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <p className="text-center sm:text-left font-normal">
            © {currentYear} Cosmic Channeling. All rights reserved.
          </p>

          {/* Portfolio Attribution Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-[#94A3B8] hover:text-white transition-all duration-300 shadow-sm group">
            <span>Built with</span>
            <span className="text-red-400 inline-block transition-transform duration-300 group-hover:scale-125" aria-label="love">
              ❤️
            </span>
            <span>by</span>
            <a
              href="https://naveenguru.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-200 hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
              title="Visit Naveen's Portfolio"
            >
              Naveen
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
