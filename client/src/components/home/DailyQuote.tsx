import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Quote {
  text: string;
  author: string;
}

const DailyQuote = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  const { data: quotes, isLoading, isError } = useQuery({
    queryKey: ['/api/quotes'],
    enabled: true,
  });

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      // Get a random quote on initial load
      getRandomQuote();
    }
  }, [quotes]);

  const getRandomQuote = () => {
    if (quotes && quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }
  };

  // If the API fails, use a fallback quote
  useEffect(() => {
    if (isError) {
      setCurrentQuote({
        text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
        author: "Carl Sagan"
      });
    }
  }, [isError]);

  return (
    <section className="max-w-3xl mx-auto my-12">
      <Card className="bg-[#1E293B] bg-opacity-80 backdrop-blur-sm rounded-xl p-6 border border-[#334155] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-space font-bold text-[#F8FAFC]">Today's Cosmic Insight</h2>
          <div className="h-6 w-6 rounded-full bg-[#0EA5E9] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        </div>
        
        {isLoading ? (
          <div className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC4899]"></div>
          </div>
        ) : (
          <>
            <blockquote className="mb-6">
              <p className="text-lg italic text-[#F1F5F9]">
                "{currentQuote?.text}"
              </p>
              <footer className="mt-2 text-[#64748B] text-right">— {currentQuote?.author}</footer>
            </blockquote>
            
            <Button 
              onClick={getRandomQuote}
              variant="outline" 
              className="w-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] py-2 rounded-md transition-colors flex items-center justify-center"
            >
              <i className="ri-sparkling-line mr-2"></i> Inspire Me
            </Button>
          </>
        )}
      </Card>
    </section>
  );
};

export default DailyQuote;
