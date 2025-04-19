import { useState, useEffect } from 'react';
import { getRandomItem } from '@/lib/utils';
import { cosmicQuotes } from '@/data/cosmicData';

export default function DailyQuote() {
  const [quote, setQuote] = useState(cosmicQuotes[0]);
  
  useEffect(() => {
    // Check if we already have a daily quote stored for today
    const today = new Date().toDateString();
    const storedQuoteData = localStorage.getItem('dailyCosmicQuote');
    
    if (storedQuoteData) {
      const { date, savedQuote } = JSON.parse(storedQuoteData);
      
      if (date === today) {
        setQuote(savedQuote);
      } else {
        // It's a new day, get a new random quote
        const newQuote = getRandomItem(cosmicQuotes);
        setQuote(newQuote);
        localStorage.setItem('dailyCosmicQuote', JSON.stringify({
          date: today,
          savedQuote: newQuote
        }));
      }
    } else {
      // First visit, store a random quote
      const newQuote = getRandomItem(cosmicQuotes);
      setQuote(newQuote);
      localStorage.setItem('dailyCosmicQuote', JSON.stringify({
        date: today,
        savedQuote: newQuote
      }));
    }
  }, []);
  
  const handleInspireMe = () => {
    let newQuote = getRandomItem(cosmicQuotes);
    // Make sure we don't get the same quote twice in a row
    while (newQuote.text === quote.text) {
      newQuote = getRandomItem(cosmicQuotes);
    }
    setQuote(newQuote);
  };

  return (
    <section className="max-w-3xl mx-auto my-12">
      <div className="bg-space-900 bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-space-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-space font-bold text-space-50">Today's Cosmic Insight</h2>
          <div className="h-6 w-6 rounded-full bg-cosmic-blue animate-pulse-slow"></div>
        </div>
        
        <blockquote className="mb-6">
          <p className="text-lg italic text-space-100">
            "{quote.text}"
          </p>
          <footer className="mt-2 text-space-600 text-right">— {quote.author}</footer>
        </blockquote>
        
        <button 
          onClick={handleInspireMe}
          className="w-full bg-space-800 hover:bg-space-700 text-space-50 py-2 rounded-md transition-colors flex items-center justify-center"
        >
          <i className="ri-sparkling-line mr-2"></i> Inspire Me
        </button>
      </div>
    </section>
  );
}
