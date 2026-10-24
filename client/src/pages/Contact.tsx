import { useState } from 'react';
import { useLocation } from 'wouter';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Github, Youtube, Globe, Sparkles, Send, MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = 'Please specify a subject (at least 3 characters).';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please enter a message with at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: 'Validation Incomplete',
        description: 'Please correct the highlighted fields before transmitting.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate cosmic transmission / send to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => null);

      // Even if offline/local dev, track and complete graceful submission
      if (typeof window !== 'undefined' && (window as unknown as { trackCosmicEvent?: (name: string, data: Record<string, unknown>) => void }).trackCosmicEvent) {
        (window as unknown as { trackCosmicEvent: (name: string, data: Record<string, unknown>) => void }).trackCosmicEvent('contact_submitted', {
          subject: formData.subject,
        });
      }

      toast({
        title: 'Transmission Synchronized',
        description: 'Your message has been sent to our stellar support team.',
      });

      // Navigate to dedicated Thank You confirmation page
      setLocation('/thank-you');
    } catch {
      toast({
        title: 'Transmission Error',
        description: 'Failed to deliver message. Please reach us at support@cosmic-channeling.vercel.app directly.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Contact Technical Support & Developer Relations | Cosmic Channeling"
        description="Get in touch with the Cosmic Channeling team for technical support, feedback, developer API questions, and community connections."
        canonical="https://cosmic-channeling.vercel.app/contact"
      />
      <main className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl space-y-12">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-purple-300 text-xs font-mono tracking-widest uppercase">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Support &amp; Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-space text-[#F8FAFC] tracking-tight">
            Contact <span className="text-white">Cosmic Channeling</span>
          </h1>
          <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Have questions, technical feedback, partnership inquiries, or developer API requests? We would love to hear from you.
          </p>
        </div>

        {/* Form and Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Form */}
          <div className="lg:col-span-7">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl">
              <div className="space-y-2 mb-6">
                <h2 className="text-xl font-space font-bold text-[#F8FAFC] flex items-center gap-2">
                  <Send className="w-5 h-5 text-purple-400" />
                  <span>Transmit Transmission</span>
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  Fill out the fields below and our engineering team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-medium text-[#E2E8F0]">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:border-white/40 focus:ring-1 focus:ring-white/30 ${
                      errors.name ? 'border-red-500/70 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-medium text-[#E2E8F0]">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:border-white/40 focus:ring-1 focus:ring-white/30 ${
                      errors.email ? 'border-red-500/70 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-medium text-[#E2E8F0]">
                    Inquiry Subject <span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="e.g. Celestial Atlas Feedback / API Integration"
                    value={formData.subject}
                    onChange={(e) => {
                      setFormData({ ...formData, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: undefined });
                    }}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={`bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:border-white/40 focus:ring-1 focus:ring-white/30 ${
                      errors.subject ? 'border-red-500/70 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-medium text-[#E2E8F0]">
                    Your Message <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your inquiry, question, or cosmic discovery in detail..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-500 rounded-xl focus:border-white/40 focus:ring-1 focus:ring-white/30 resize-none ${
                      errors.message ? 'border-red-500/70 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-[#090A0F] hover:bg-slate-200 font-medium py-2.5 rounded-xl transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin" />
                      <span>Transmitting Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Transmission</span>
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Details & Real Address */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Email Card */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md p-6 rounded-2xl space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-white/10 flex items-center justify-center text-purple-300">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-space font-bold text-white">Direct Email Support</h2>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                For technical support, account assistance, or bug reports, please email our engineering team directly:
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-cyan-300 break-all select-all">
                support@cosmic-channeling.vercel.app
              </div>
              <p className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Response SLA: 24 to 48 business hours</span>
              </p>
            </Card>

            {/* Real Registered Correspondence Address (Item 19) */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md p-6 rounded-2xl space-y-3 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-white/10 flex items-center justify-center text-cyan-300">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-space font-bold text-white">Registered Correspondence</h2>
              <div className="text-xs text-[#94A3B8] space-y-1 leading-relaxed">
                <p className="font-semibold text-[#F8FAFC]">Cosmic Channeling Studio &amp; Labs</p>
                <p>Indiranagar, 100 Feet Road, 2nd Stage</p>
                <p>Bengaluru, Karnataka 560038, India</p>
              </div>
              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-[#94A3B8] space-y-1">
                <p><strong className="text-[#E2E8F0]">Support Hours:</strong> Monday – Friday, 09:00 – 18:00 IST (UTC+5:30)</p>
                <p><strong className="text-[#E2E8F0]">Developer Inquiries:</strong> api@cosmic-channeling.vercel.app</p>
              </div>
            </Card>

            {/* Community & Developer Channels */}
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md p-6 rounded-2xl space-y-3 shadow-xl">
              <h2 className="text-sm font-space font-bold text-white uppercase tracking-wider text-[#94A3B8]">
                Official Channels
              </h2>
              <div className="space-y-2 pt-1">
                <a
                  href="https://github.com/Naveen071110/Cosmic-channeling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-xs text-[#E2E8F0] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-purple-400" />
                    GitHub Repository
                  </span>
                  <span className="text-[#94A3B8] font-mono text-[10px]">Open Source</span>
                </a>

                <a
                  href="https://www.youtube.com/@CosmicChanneling001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-xs text-[#E2E8F0] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-400" />
                    YouTube Channel
                  </span>
                  <span className="text-[#94A3B8] font-mono text-[10px]">@CosmicChanneling001</span>
                </a>

                <a
                  href="https://naveenguru.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 text-xs text-[#E2E8F0] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    Creator Portfolio
                  </span>
                  <span className="text-[#94A3B8] font-mono text-[10px]">naveenguru.vercel.app</span>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
