import { useState } from 'react';
import Hero from '@/components/home/Hero';
import DailyQuote from '@/components/home/DailyQuote';
import FeatureGrid from '@/components/home/FeatureGrid';
import Newsletter from '@/components/home/Newsletter';
import SpiritualSpaceQuiz from '@/components/features/SpiritualSpaceQuiz';
import WelcomeCarousel from '@/components/onboarding/WelcomeCarousel';

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
        <DailyQuote />
        <FeatureGrid />
        <SpiritualSpaceQuiz />
        <Newsletter />
      </main>
    </>
  );
};

export default Home;
