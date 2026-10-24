import React from 'react';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Sliders, Mail, MapPin } from 'lucide-react';

const PrivacyPolicy = () => {
  const openCookieModal = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-preferences'));
    }
  };

  return (
    <>
      <SEO
        title="Privacy Policy & Data Protection | Cosmic Channeling"
        description="Understand how Cosmic Channeling protects your personal data, secure authentication tokens, and astronomical preferences."
        canonical="https://cosmic-channeling.vercel.app/privacy"
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-[#94A3B8] uppercase">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>GDPR &amp; ePrivacy Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-[#F8FAFC] tracking-tight">
            Privacy Policy &amp; Data Stewardship
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-mono">
            Effective Date: October 24, 2026
          </p>
        </div>

        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-[#94A3B8]">
          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">Welcome to Cosmic Channeling</h2>
            <p>
              At Cosmic Channeling, we believe the universe thrives on mutual trust and transparency. This Privacy Policy explains how we collect, use, and protect your data as you explore the intersection of astrophysics and meditative consciousness.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">1. Information We Collect</h2>
            <div className="space-y-2">
              <p className="font-medium text-[#E2E8F0]">Personal Data:</p>
              <p>When you register for an account, subscribe to our newsletter, or save Astro-Journal entries, we may collect:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Your display name or handle</li>
                <li>Your email address</li>
                <li>Hashed authentication credentials and JWT session tokens</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <p className="font-medium text-[#E2E8F0]">Non-Personal &amp; Device Telemetry:</p>
              <p>We use privacy-preserving telemetry and client-side storage to optimize your experience:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Audio synthesizer volume and carrier frequency preferences (stored in your browser)</li>
                <li>Anonymous page navigation metrics to identify broken endpoints</li>
                <li>Approximate coordinates for stargazing and night sky clarity indices (never shared)</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Deliver real-time Web Audio soundscapes and synchronized breathing pacers.</li>
              <li>Maintain your authenticated sessions and Astro-Journal entries securely.</li>
              <li>Never sell, lease, or monetize your personal data to third-party data brokers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">3. Cookie Consent &amp; Your Choices</h2>
            <p>
              We adhere strictly to the EU General Data Protection Regulation (GDPR) and the ePrivacy Directive. Non-essential cookies and analytics are blocked by default until you grant explicit consent.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openCookieModal}
                className="border-white/10 hover:bg-white/5 text-[#E2E8F0] rounded-xl text-xs gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                Manage Cookie Preferences
              </Button>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">4. Data Subject Rights (GDPR &amp; CCPA)</h2>
            <p>You have the right to request access to your personal data, rectify inaccuracies, export your journal history, or request full deletion of your account at any time.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">5. Security Standards</h2>
            <p>
              All traffic is encrypted in transit using TLS 1.3. Server infrastructure is deployed across Cloudflare edge networks with strict Content Security Policies (CSP), HTTP Strict Transport Security (HSTS), and anti-tamper safeguards.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/[0.06]">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">6. Data Controller &amp; Contact Point</h2>
            <div className="space-y-1.5 text-xs">
              <p><strong className="text-[#E2E8F0]">Organization:</strong> Cosmic Channeling Studio &amp; Labs</p>
              <p><strong className="text-[#E2E8F0]">Registered Address:</strong> Indiranagar, 100 Feet Road, Bengaluru, Karnataka 560038, India</p>
              <p><strong className="text-[#E2E8F0]">Privacy Inquiries:</strong> support@cosmic-channeling.vercel.app</p>
            </div>
          </section>
        </Card>
      </div>
    </>
  );
};

export default PrivacyPolicy;
