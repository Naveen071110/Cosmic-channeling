import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Sliders, CheckCircle2, Sparkles, Activity, Target } from 'lucide-react';
import { useConsent } from '@/lib/cookies/useConsent';
import { CATEGORY_INFO, COOKIE_REGISTRY } from '@/lib/cookies/config';
import { CookieCategory } from '@/lib/cookies/types';

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CookiePreferencesModal({
  open,
  onOpenChange,
}: CookiePreferencesModalProps) {
  const { consent, updatePreferences, acceptAll } = useConsent();

  const [functional, setFunctional] = useState<boolean>(false);
  const [analytics, setAnalytics] = useState<boolean>(false);
  const [marketing, setMarketing] = useState<boolean>(false);

  useEffect(() => {
    if (consent) {
      setFunctional(consent.functional);
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    }
  }, [consent, open]);

  const handleSave = () => {
    updatePreferences({
      functional,
      analytics,
      marketing,
    });
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    onOpenChange(false);
  };

  const getCategoryIcon = (cat: CookieCategory) => {
    switch (cat) {
      case 'necessary':
        return <Lock className="w-4 h-4 text-emerald-400" />;
      case 'functional':
        return <Sliders className="w-4 h-4 text-purple-400" />;
      case 'analytics':
        return <Activity className="w-4 h-4 text-sky-400" />;
      case 'marketing':
        return <Target className="w-4 h-4 text-pink-400" />;
    }
  };

  const isToggled = (cat: CookieCategory) => {
    if (cat === 'necessary') return true;
    if (cat === 'functional') return functional;
    if (cat === 'analytics') return analytics;
    if (cat === 'marketing') return marketing;
    return false;
  };

  const setToggle = (cat: CookieCategory, val: boolean) => {
    if (cat === 'functional') setFunctional(val);
    else if (cat === 'analytics') setAnalytics(val);
    else if (cat === 'marketing') setMarketing(val);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto bg-[#0B0F19]/95 backdrop-blur-2xl border-purple-500/40 text-white p-6 shadow-2xl">
        <DialogHeader className="text-left space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Privacy &amp; Cookie Governance</span>
          </div>
          <DialogTitle className="text-2xl font-space font-bold text-white">
            Cookie &amp; Consent Preferences
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-300 leading-relaxed">
            We value your privacy. Customize your cookie preferences below. Strictly necessary cookies are required to provide authentication and CSRF security, while optional cookies enhance audio memory and telemetry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-3">
          {(Object.keys(CATEGORY_INFO) as CookieCategory[]).map((catKey) => {
            const cat = CATEGORY_INFO[catKey];
            const checked = isToggled(catKey);

            return (
              <div
                key={catKey}
                className="p-4 rounded-xl bg-[#0F172A]/90 border border-[#334155] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5 shrink-0 mt-0.5">
                      {getCategoryIcon(catKey)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{cat.title}</h4>
                        <Badge
                          className={`text-[10px] font-mono uppercase ${
                            cat.required
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                              : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                          }`}
                        >
                          {cat.badge}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">{cat.description}</p>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    <Switch
                      checked={checked}
                      disabled={cat.required}
                      onCheckedChange={(val) => setToggle(catKey, val)}
                      aria-label={`Toggle ${cat.title}`}
                    />
                  </div>
                </div>

                {/* Cookie List Accordion/Tag preview */}
                <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] uppercase font-mono text-gray-500">Active Cookies:</span>
                  {cat.cookies.map((cKey) => {
                    const cDef = COOKIE_REGISTRY[cKey];
                    return (
                      <span
                        key={cKey}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/5 text-gray-300"
                        title={cDef?.description}
                      >
                        {cKey}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAcceptAll}
            className="w-full sm:w-auto text-xs text-purple-300 hover:text-white"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Accept All Cookies
          </Button>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-xs text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-5 shadow-md shadow-purple-900/40"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
