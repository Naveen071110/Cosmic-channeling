import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-3xl text-center mb-2 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </CardTitle>
          <p className="text-center text-muted-foreground">Last Updated: 04/21/2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">Welcome to Cosmic Channeling</h3>
            <p className="text-[#F1F5F9]">
              At Cosmic Channeling, we believe the universe thrives on trust. This Privacy Policy explains how we 
              collect, use, and protect your data as you explore the intersection of science and soul.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">1. Information We Collect</h3>
            <p className="text-[#F1F5F9] font-medium">Personal Data:</p>
            <p className="text-[#F1F5F9]">
              When you sign up for meditations, Astro-Journals, or newsletters, we may collect:
            </p>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Payment details (processed securely via third parties like PayPal/Stripe)</li>
            </ul>
            
            <p className="text-[#F1F5F9] font-medium mt-4">Non-Personal Data:</p>
            <p className="text-[#F1F5F9]">
              We use cookies and analytics tools (e.g., Google Analytics) to track:
            </p>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Browsing behavior</li>
              <li>Device type (to optimize your cosmic experience)</li>
              <li>Location (for stargazing recommendations)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">2. How We Use Your Data</h3>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Deliver personalized cosmic content (e.g., meditation timers, Astro-Journal prompts).</li>
              <li>Improve our website's functionality and user experience.</li>
              <li>Send newsletters (you can unsubscribe anytime using the link in emails).</li>
              <li>Never sell your data to third parties.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">3. Third-Party Services</h3>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Payment processors (Stripe, PayPal) handle transactions securely.</li>
              <li>Email services (Mailchimp, ConvertKit) manage newsletters.</li>
            </ul>
            <p className="text-[#F1F5F9]">
              These partners have their own privacy policies, which we recommend reviewing.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">4. Your Rights</h3>
            <ul className="list-disc pl-6 text-[#F1F5F9] space-y-1">
              <li>Access, update, or delete your data by contacting us at singhnaveen360@gmail.com.</li>
              <li>Opt out of cookies via browser settings (note: some site features may break).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">5. Security</h3>
            <p className="text-[#F1F5F9]">
              We use SSL encryption and secure servers, but remember: no digital system is 100% 
              immune to black holes (or hackers).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">6. Changes to This Policy</h3>
            <p className="text-[#F1F5F9]">
              Cosmic laws evolve. We'll notify you of updates via email or website banners.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-xl font-medium text-[#F1F5F9]">Contact Us</h3>
            <p className="text-[#F1F5F9]">
              For cosmic inquiries or data requests:
              <br />
              Email: singhnaveen360@gmail.com
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;