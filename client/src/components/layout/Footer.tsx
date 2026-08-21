import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19]/80 backdrop-blur-md border-t border-[#334155]/60 mt-auto text-gray-400 text-sm">
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Column */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#7E22CE] flex items-center justify-center shadow-sm shadow-purple-900/40">
                <i className="ri-planet-line text-base text-[#F8FAFC]"></i>
              </div>
              <h3 className="text-base font-space font-bold bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
                Cosmic Channeling
              </h3>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed pr-4">
              Explore the living universe through harmonic meditation, celestial data, and cosmic mindfulness.
            </p>
            <div className="pt-1">
              <a
                href="https://www.youtube.com/@CosmicChanneling001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#EC4899] transition-colors"
                aria-label="Cosmic Channeling YouTube"
              >
                <i className="ri-youtube-line text-base text-red-400"></i>
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>
          
          {/* Explore Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 font-mono">Explore</h4>
            <div className="space-y-2 text-xs">
              <Link href="/meditate" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Guided Meditations
              </Link>
              <Link href="/explore" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Celestial Objects
              </Link>
              <Link href="/journal" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Astro-Journal
              </Link>
              <Link href="/tools" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Cosmic Tools & Signals
              </Link>
            </div>
          </div>
          
          {/* Content & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 font-mono">Resources</h4>
            <div className="space-y-2 text-xs">
              <Link href="/downloads" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Resource Vault (4K/Audio)
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Cosmic Insights Blog
              </Link>
              <Link href="/religions" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Spiritual Traditions
              </Link>
              <Link href="/subscribe" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Cosmic Membership
              </Link>
            </div>
          </div>
          
          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-200 font-mono">Legal & Privacy</h4>
            <div className="space-y-2 text-xs">
              <Link href="/terms" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/auth" className="block text-gray-400 hover:text-sky-400 transition-colors">
                Account Portal
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Attribution Bar */}
        <div className="border-t border-[#334155]/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center sm:text-left">
            © {currentYear} Cosmic Channeling. All rights reserved.
          </p>

          {/* Portfolio Attribution Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-gray-400 hover:text-gray-200 transition-all duration-300 shadow-sm group">
            <span>Built with</span>
            <span className="text-red-500 inline-block transition-transform duration-300 group-hover:scale-125" aria-label="love">
              ❤️
            </span>
            <span>by</span>
            <a
              href="https://naveenguru.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-purple-300 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 hover:to-sky-400 hover:bg-clip-text transition-all duration-200 underline-offset-4 hover:underline cursor-pointer"
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
