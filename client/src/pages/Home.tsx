import Hero from '@/components/home/Hero';
import DailyQuote from '@/components/home/DailyQuote';
import FeatureGrid from '@/components/home/FeatureGrid';
import Newsletter from '@/components/home/Newsletter';
import SpiritualSpaceQuiz from '@/components/features/SpiritualSpaceQuiz';

const Home = () => {
  return (
    <main className="container mx-auto px-4 py-8">
      <Hero />
      <DailyQuote />
      <FeatureGrid />
      <SpiritualSpaceQuiz />
      <Newsletter />
    </main>
  );
};

export default Home;
