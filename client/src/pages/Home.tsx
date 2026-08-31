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
      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* 1. Hero Section (Includes H1 and Semantic Header) */}
        <Hero />

        {/* 2. Live Celestial Alignment & Stargazing Clarity */}
        <section aria-label="Live Celestial Stargazing and Solar Alignment">
          <StargazingWidget />
        </section>

        {/* 3. Daily NASA Astronomy Picture of the Day (APOD) */}
        <section aria-labelledby="nasa-apod-heading">
          <div className="text-center mb-6">
            <h2 id="nasa-apod-heading" className="text-2xl sm:text-3xl font-bold font-space">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                Deep Space Daily Discovery
              </span>
            </h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xl mx-auto">
              Live celestial imagery from NASA’s deep-space observation satellites and space telescopes
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <NasaApodCard />
          </div>
        </section>

        {/* 4. Daily Cosmic Wisdom Channel */}
        <section aria-labelledby="cosmic-inspiration-heading">
          <div className="text-center mb-6">
            <h2 id="cosmic-inspiration-heading" className="text-2xl sm:text-3xl font-bold font-space">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Daily Cosmic Inspiration
              </span>
            </h2>
          </div>
          <QuoteGenerator />
        </section>

        {/* 5. Core Feature Grid */}
        <FeatureGrid />

        {/* 6. Astral Test */}
        <section aria-labelledby="astral-test-heading">
          <div className="text-center mb-8">
            <h2 id="astral-test-heading" className="text-2xl sm:text-3xl font-bold font-space">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Discover Your Cosmic Potential
              </span>
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
