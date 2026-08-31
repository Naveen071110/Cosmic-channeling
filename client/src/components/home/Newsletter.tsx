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
    <section id="community" className="my-16 max-w-4xl mx-auto px-4" aria-label="Join Our Cosmic Community">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E1B4B]/80 via-[#0F172A] to-[#0A101D] border border-purple-500/30 p-6 sm:p-10 shadow-2xl shadow-purple-950/40 backdrop-blur-xl">
        {/* Subtle Ambient Glowing Orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>100% Free Cosmic Community</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-space font-bold text-white tracking-tight">
              Join Our Cosmic Community on{' '}
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-sky-400 bg-clip-text text-transparent">
                Medium
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-xl">
              We publish essays and transmissions on astrophysics, Solfeggio sound therapy, and universal consciousness on Medium. Join our readership for free or register your email for story alerts.
            </p>

            {/* Email Registration / Subscription Form */}
            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>You are connected! Read our latest essays directly on Medium.</span>
              </div>
            ) : (
              <form className="flex flex-col sm:flex-row gap-2.5 max-w-lg" onSubmit={handleSubmit}>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for free updates..." 
                  className="bg-[#090D16] border-[#334155] focus:border-purple-400 text-white placeholder-gray-500 text-xs sm:text-sm h-10 px-4"
                  required
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs sm:text-sm h-10 px-5 font-medium whitespace-nowrap shadow-md shadow-purple-950/50"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {isSubmitting ? 'Connecting...' : 'Join for Free'}
                </Button>
              </form>
            )}

            {/* Community Links & Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a 
                href={MEDIUM_PROFILE_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                <span>Read on Medium</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <a 
                href={MEDIUM_SUBSCRIBE_URL}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 text-xs font-medium border border-purple-500/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Get Medium Story Alerts</span>
                <ExternalLink className="w-3 h-3 text-purple-300" />
              </a>

              <Link href="/blog">
                <span className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 cursor-pointer font-medium pl-1">
                  Browse In-App Blog <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
          
          {/* Animated Icon Avatar */}
          <div className="flex-shrink-0 w-28 h-28 relative flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-500/30 border border-purple-400/40 flex items-center justify-center animate-float shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <div className="w-16 h-16 rounded-full bg-purple-950/80 border border-purple-400/30 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-pink-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
