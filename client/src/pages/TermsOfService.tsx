import React from 'react';
import SEO from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Terms of Service & API Guidelines | Cosmic Channeling"
        description="Review the terms and conditions for exploring Cosmic Channeling, accessing public space telemetry, and using our meditation tools."
        canonical="https://cosmic-channeling.vercel.app/terms"
      />
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono tracking-widest text-[#94A3B8] uppercase">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sanctuary Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-space text-[#F8FAFC] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-mono">
            Effective Date: October 24, 2026
          </p>
        </div>

        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-10 space-y-8 text-sm leading-relaxed text-[#94A3B8]">
          <p className="text-[#E2E8F0]">
            By accessing or using Cosmic Channeling, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue access to the sanctuary.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">1. Acceptance of Terms</h2>
            <p>
              These Terms apply to all visitors, registered explorers, API consumers, and automated agents accessing Cosmic Channeling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">2. Intellectual Property &amp; Open Science</h2>
            <p>
              All proprietary synthesis algorithms, audio engines, and curated interactive guides are protected by intellectual property laws. Public astronomical telemetry, NASA APOD imagery, and public domain celestial catalogs remain under their respective open licenses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">3. Disclaimer of Scientific &amp; Medical Advice</h2>
            <p>
              The audio soundscapes (432Hz and 528Hz Solfeggio frequencies) and meditation breathing pacers provided on this platform are designed solely for relaxation, mindfulness, and educational appreciation of astronomy. They do not constitute licensed medical, psychological, or clinical therapy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">4. Acceptable Use &amp; Developer API Rules</h2>
            <p>When accessing our platform or public endpoints (OpenAPI 3.1 &amp; llms.txt), you agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Deploy unauthorized distributed denial-of-service (DDoS) traffic or brute-force endpoints.</li>
              <li>Circumvent client authentication barriers or exploit cross-site scripting vulnerabilities.</li>
              <li>Transmit unlawful, abusive, or malicious content through community or feedback channels.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">5. Limitation of Liability</h2>
            <p>
              In no event shall Cosmic Channeling, its developers, or contributors be held liable for any indirect, incidental, or consequential damages resulting from platform downtime, network latency, or external astronomical feed disruptions.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-white/[0.06]">
            <h2 className="text-lg font-space font-semibold text-[#F8FAFC]">6. Governing Law &amp; Correspondence</h2>
            <div className="space-y-1.5 text-xs">
              <p><strong className="text-[#E2E8F0]">Jurisdiction:</strong> Bengaluru, Karnataka, India</p>
              <p><strong className="text-[#E2E8F0]">Direct Inquiries:</strong> support@cosmic-channeling.vercel.app</p>
            </div>
          </section>
        </Card>
      </div>
    </>
  );
};

export default TermsOfService;
