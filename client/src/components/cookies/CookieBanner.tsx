import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles, Sliders, X, Check, Cookie } from 'lucide-react';
import { useConsent } from '@/lib/cookies/useConsent';
import CookiePreferencesModal from './CookiePreferencesModal';

export default function CookieBanner() {
  const { hasResponded, isReady, acceptAll, rejectNonEssential } = useConsent();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Avoid any hydration mismatch by mounting client-side
    setMounted(true);

    const handleOpenModal = () => {
      setModalOpen(true);
    };

    window.addEventListener('open-cookie-preferences', handleOpenModal);
    return () => {
      window.removeEventListener('open-cookie-preferences', handleOpenModal);
    };
  }, []);

  if (!mounted || !isReady) return null;

  return (
    <>
      {/* Floating Bottom Cookie Banner */}
      {!hasResponded && (
        <div
          role="region"
          aria-label="Cookie Consent Banner"
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 animate-in fade-in slide-in-from-bottom-5 duration-500"
        >
          <div className="rounded-2xl p-5 bg-[#0B0F19]/95 backdrop-blur-2xl border border-purple-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(147,51,234,0.25)] text-white space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5 shadow-md">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-space font-bold text-white">Your Privacy &amp; Stardust Memory</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30 font-mono">
                    GDPR • ePrivacy
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  We use cookies to maintain your authenticated cosmic sessions, prevent CSRF vulnerabilities, and remember your audio synthesizer preferences. Non-essential cookies are blocked until you choose to opt in.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                size="sm"
                onClick={acceptAll}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white text-xs h-8 font-medium shadow-md shadow-purple-950/60"
              >
                <Check className="w-3.5 h-3.5 mr-1" />
                Accept All
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={rejectNonEssential}
                className="flex-1 border-white/10 hover:bg-white/5 text-gray-300 text-xs h-8"
              >
                Reject Optional
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setModalOpen(true)}
                className="text-purple-300 hover:text-white text-xs h-8 px-2.5"
              >
                <Sliders className="w-3.5 h-3.5 mr-1" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      <CookiePreferencesModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
