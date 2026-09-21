import { useState } from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import Newsletter from '@/components/home/Newsletter';
import FaqSection from '@/components/home/FaqSection';
import SpiritualSpaceQuiz from '@/components/features/SpiritualSpaceQuiz';
import WelcomeCarousel from '@/components/onboarding/WelcomeCarousel';
import QuoteGenerator from '@/components/features/QuoteGenerator';
import AstralTest from '@/components/features/AstralTest';
import NasaApodCard from '@/components/features/NasaApodCard';
import StargazingWidget from '@/components/features/StargazingWidget';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleOnboardingComplete = () => {
    setShowWelcome(false);
  };

  return (
    <>
      <SEO
        title="Deep Space Meditation & Solfeggio | Cosmic Channeling"
        description="Experience 432Hz/528Hz Solfeggio meditation soundscapes, 30+ HD Celestial Atlas, and live NASA space feeds. Connect with universal consciousness today."
        canonical="https://cosmic-channeling.vercel.app/"
      />
      {showWelcome && <WelcomeCarousel onComplete={handleOnboardingComplete} />}
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 space-y-24 sm:space-y-32 md:space-y-40">
        {/* 1. Hero Section (Includes H1 and Semantic Header) */}
        <Hero />

        {/* 2. Live Celestial Alignment & Stargazing Clarity */}
        <section aria-label="Live Celestial Stargazing and Solar Alignment">
          <StargazingWidget />
        </section>

        {/* 3. Daily NASA Astronomy Picture of the Day (APOD) */}
        <section aria-labelledby="nasa-apod-heading" className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 id="nasa-apod-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white font-space">
              Deep Space Daily Discovery
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              Live celestial imagery from NASA’s deep-space observation satellites and space telescopes
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <NasaApodCard />
          </div>
        </section>

        {/* 4. Daily Cosmic Wisdom Channel */}
        <section aria-labelledby="cosmic-inspiration-heading" className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 id="cosmic-inspiration-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white font-space">
              Daily Cosmic Inspiration
            </h2>
          </div>
          <QuoteGenerator />
        </section>

        {/* 5. Core Feature Grid */}
        <FeatureGrid />

        {/* 6. Astral Test */}
        <section aria-labelledby="astral-test-heading" className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 id="astral-test-heading" className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white font-space">
              Discover Your Cosmic Potential
            </h2>
          </div>
          <AstralTest />
        </section>

        {/* 7. Spiritual Space Quiz */}
        <SpiritualSpaceQuiz />

        {/* 8. On-Page FAQ Section matching FAQPage Schema.org */}
        <FaqSection />

        {/* 9. Newsletter */}
        <Newsletter />
      </main>
    </>
  );
};

export default Home;
