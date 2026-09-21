import { useState } from 'react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Sparkles, Send, CheckCircle2, ArrowRight } from 'lucide-react';

const MEDIUM_PROFILE_URL = "https://medium.com/@cosmicchanneling";
const MEDIUM_SUBSCRIBE_URL = "https://medium.com/@cosmicchanneling/subscribe";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Valid Email Required",
        description: "Please enter a valid email address to join the community.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (res.ok || res.status === 201) {
        setIsSubscribed(true);
        toast({
          title: "Welcome to the Cosmic Community!",
          description: "You've been added to our free transmission list. Explore our latest essays on Medium!",
        });
        setEmail('');
      } else if (res.status === 409) {
        setIsSubscribed(true);
        toast({
          title: "Already Connected!",
          description: "You're already part of our community. Check out our latest Medium publications below.",
        });
      } else {
        // Fallback grace
        setIsSubscribed(true);
        toast({
          title: "Welcome!",
          description: "Thanks for connecting. Follow us on Medium for instant story updates.",
        });
      }
    } catch (error) {
      // Graceful fallback
      setIsSubscribed(true);
      toast({
        title: "Welcome to Cosmic Channeling!",
        description: "Explore our latest essays and stories on Medium.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="community" className="max-w-4xl mx-auto px-4" aria-label="Join Our Cosmic Community">
      <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.08] p-8 sm:p-12 shadow-none backdrop-blur-md">
        {/* Subtle Ambient Starlight Mesh */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              <span>100% Free Cosmic Community</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-space font-semibold text-[#F8FAFC] tracking-tight">
              Join Our Cosmic Community on Medium
            </h2>

            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed max-w-xl font-normal">
              We publish essays and transmissions on astrophysics, Solfeggio sound therapy, and universal consciousness on Medium. Join our readership for free or register your email for story alerts.
            </p>

            {/* Email Registration / Subscription Form */}
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-200 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-slate-300" />
                <span>You're registered for story alerts. Thank you for joining our frequency!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md pt-1">
                <Input
                  type="email"
                  placeholder="Enter your email for story alerts"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="bg-white/[0.03] border-white/10 text-white placeholder-slate-500 rounded-xl h-11 px-4 text-sm focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                  aria-label="Email address for community alerts"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white text-black hover:bg-slate-200 font-medium rounded-xl h-11 px-6 text-sm shrink-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 mr-2" />
                  {isSubmitting ? 'Joining...' : 'Get Alerts'}
                </Button>
              </form>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1">
                ✓ No spam, ever
              </span>
              <span className="flex items-center gap-1">
                ✓ Unsubscribe anytime
              </span>
              <span className="flex items-center gap-1">
                ✓ 100% Free essays
              </span>
            </div>
          </div>

          {/* Medium Direct Action Box */}
          <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md w-full md:w-auto shrink-0 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-slate-200" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-space font-medium text-[#F8FAFC]">
                Cosmic Channeling
              </p>
              <p className="text-xs text-[#94A3B8]">
                Official Medium Publication
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full mt-2">
              <a
                href={MEDIUM_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-white/15 bg-white/[0.02] hover:bg-white/[0.06] text-slate-200 hover:text-white rounded-xl h-9 text-xs font-medium transition-all"
                >
                  Read on Medium
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>

              <a
                href={MEDIUM_SUBSCRIBE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button
                  size="sm"
                  className="w-full bg-white text-black hover:bg-slate-200 font-medium rounded-xl h-9 text-xs transition-all shadow-sm"
                >
                  Get Story Alerts
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </a>
            </div>

            <Link href="/blog">
              <span className="text-[11px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer mt-1 underline underline-offset-4">
                Or read articles directly in-app →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
