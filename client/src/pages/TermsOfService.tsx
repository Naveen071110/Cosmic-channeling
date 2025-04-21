import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-3xl text-center mb-2 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
              Terms of Service
            </span>
          </CardTitle>
          <p className="text-center text-muted-foreground">Last Updated: 04/21/2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-[#F1F5F9]">
            By using Cosmic Channeling, you agree to these terms. If you disagree, the universe might side-eye you. 🌌
          </p>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">1. Acceptance of Terms</h3>
            <p className="text-[#F1F5F9]">
              Accessing this website means you accept our Terms of Service and Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">2. Intellectual Property</h3>
            <p className="text-[#F1F5F9]">
              All content (videos, Astro-Journals, meditations) is owned by Cosmic Channeling unless stated otherwise.
            </p>
            <p className="text-[#F1F5F9]">
              You may share content for personal/non-commercial use with proper credit.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">3. Disclaimer</h3>
            <p className="text-[#F1F5F9]">
              Our content blends science and spirituality but is not professional advice.
            </p>
            <p className="text-[#F1F5F9]">
              Cosmic Channeling is not liable for:
            </p>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Misinterpretations of cosmic insights.</li>
              <li>Technical glitches during meditations (blame Mercury retrograde).</li>
              <li>Decisions made based on our content.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">4. User Conduct</h3>
            <p className="text-[#F1F5F9]">Do not:</p>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Hack our website to "channel" restricted data.</li>
              <li>Spam the comments with non-cosmic propaganda.</li>
              <li>Use our content for harmful or commercial purposes.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">5. Payments & Refunds</h3>
            <p className="text-[#F1F5F9]">
              Digital products (e.g., frequency guides) are non-refundable unless defective.
            </p>
            <p className="text-[#F1F5F9]">
              Subscriptions can be canceled anytime.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">6. Termination</h3>
            <p className="text-[#F1F5F9]">
              We reserve the right to ban users who violate these terms or disrupt the cosmic vibe.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">7. Limitation of Liability</h3>
            <p className="text-[#F1F5F9]">
              Cosmic Channeling is not responsible for:
            </p>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Interstellar interruptions (e.g., internet outages).</li>
              <li>Emotional reactions to cosmic horror stories.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">Contact Us</h3>
            <p className="text-[#F1F5F9]">
              For questions or cosmic complaints:
              <br />
              Email: singhnaveen360@gmail.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsOfService;