import SEO from '@/components/SEO';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Github, Youtube, Globe, Sparkles, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Technical Support & Developer Relations | Cosmic Channeling"
        description="Get in touch with the Cosmic Channeling team for technical support, feedback, developer API questions, and community connections."
        canonical="https://cosmic-channeling.vercel.app/contact"
      />
      <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-12">
      {/* Title */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
          <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
          <span>Support & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold font-space text-white">
          Contact <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">Cosmic Channeling</span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Have questions, technical feedback, partnership inquiries, or developer API requests? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Support Card */}
        <Card className="bg-[#0F172A]/90 border-purple-500/30 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-full bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-space font-bold text-white">Direct Email Support</h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            For technical support, account assistance, or bug reports, please email our engineering team directly:
          </p>
          <div className="p-3 bg-black/40 rounded-lg border border-white/10 font-mono text-xs text-sky-300">
            support@cosmic-channeling.vercel.app
          </div>
          <p className="text-[11px] text-gray-400">We typically respond to developer and user inquiries within 24 to 48 business hours.</p>
        </Card>

        {/* Community & Developer Channels */}
        <Card className="bg-[#0F172A]/90 border-[#334155] p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-full bg-pink-900/60 border border-pink-400/30 flex items-center justify-center text-pink-300">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-space font-bold text-white">Official Channels</h2>
          <div className="space-y-3 pt-1">
            <a
              href="https://github.com/Naveen071110/Cosmic-channeling"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-400" />
                GitHub Repository & Issues
              </span>
              <span className="text-gray-400 font-mono">Open Source</span>
            </a>

            <a
              href="https://www.youtube.com/@CosmicChanneling001"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-400" />
                YouTube Meditation Channel
              </span>
              <span className="text-gray-400 font-mono">@CosmicChanneling001</span>
            </a>

            <a
              href="https://naveenguru.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                Creator Portfolio
              </span>
              <span className="text-gray-400 font-mono">naveenguru.vercel.app</span>
            </a>
          </div>
        </Card>
      </div>
    </main>
    </>
  );
}
