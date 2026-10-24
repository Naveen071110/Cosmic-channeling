import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Sparkles, Compass, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StickyMobileCta() {
  const [location] = useLocation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after scrolling 150px down so it doesn't obscure the hero header immediately
    const handleScroll = () => {
      if (window.scrollY > 180) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show if dismissed, or already on /meditate or /auth pages
  if (dismissed || !visible || location === "/meditate" || location === "/auth") {
    return null;
  }

  return (
    <aside
      aria-label="Quick Access Celestial Actions"
      className="fixed bottom-3 left-3 right-3 z-40 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-[#090A0F]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.85)]">
        <Link href="/meditate" className="flex-1">
          <Button
            size="sm"
            className="w-full bg-white text-[#090A0F] hover:bg-slate-200 font-medium text-xs h-9 rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-600 shrink-0" />
            <span className="truncate">Begin 432Hz Soundscape</span>
          </Button>
        </Link>

        <Link href="/explore">
          <Button
            size="sm"
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-[#E2E8F0] text-xs h-9 px-3 rounded-xl shrink-0"
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            <span>Atlas</span>
          </Button>
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg transition-colors shrink-0"
          aria-label="Dismiss quick action bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
