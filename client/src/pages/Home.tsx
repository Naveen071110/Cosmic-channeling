import { useState } from 'react';
import Hero from '@/components/home/Hero';
import FeatureGrid from '@/components/home/FeatureGrid';
import Newsletter from '@/components/home/Newsletter';
import SpiritualSpaceQuiz from '@/components/features/SpiritualSpaceQuiz';
import WelcomeCarousel from '@/components/onboarding/WelcomeCarousel';
import DailyQuote from '@/components/features/FixedDailyQuote';
import AstralConnectionTest from '@/components/features/AstralConnectionTest';

const Home = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  
  const handleOnboardingComplete = () => {
    setShowWelcome(false);
  };

  return (
    <>
      {showWelcome && <WelcomeCarousel onComplete={handleOnboardingComplete} />}
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Daily Cosmic Inspiration
            </span>
          </h2>
          <DailyQuote />
        </section>

        <FeatureGrid />
        
        <section className="my-16">
          <h2 className="text-2xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Discover Your Cosmic Potential
            </span>
          </h2>
          <AstralConnectionTest />
        </section>
        
        <SpiritualSpaceQuiz />
        <Newsletter />
      </main>
    </>
  );
};

export default Home;
