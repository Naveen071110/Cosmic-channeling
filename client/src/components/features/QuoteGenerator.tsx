import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';

// Type for quotes
interface CosmicQuote {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags: string[];
}

// Sample quotes
const quotes: CosmicQuote[] = [
  {
    id: '1',
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
    author: "Carl Sagan",
    source: "Cosmos",
    tags: ['wisdom', 'inspiration', 'cosmos']
  },
  {
    id: '2',
    text: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
    author: "Stephen Hawking",
    tags: ['curiosity', 'exploration', 'universe']
  },
  {
    id: '3',
    text: "For small creatures such as we, the vastness is bearable only through love.",
    author: "Carl Sagan",
    source: "Contact",
    tags: ['love', 'perspective', 'cosmos']
  },
  {
    id: '4',
    text: "We are all connected; To each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
    author: "Neil deGrasse Tyson",
    tags: ['connection', 'unity', 'cosmos']
  },
  {
    id: '5',
    text: "Not only are we in the universe, the universe is in us.",
    author: "Neil deGrasse Tyson",
    tags: ['perspective', 'cosmic', 'consciousness']
  }
];

export default function QuoteGenerator() {
  const [currentQuote, setCurrentQuote] = useState<CosmicQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to get a random quote
  const getRandomQuote = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
      setIsLoading(false);
    }, 800);
  };
  
  // Get a random quote on component mount
  useEffect(() => {
    getRandomQuote();
  }, []);
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-white">Daily Cosmic Quote</CardTitle>
          <CardDescription>
            Wisdom from the cosmos to inspire your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-[150px] flex flex-col justify-center">
            {isLoading ? (
              <div className="text-center py-4">
                <RefreshCw className="mx-auto h-8 w-8 text-purple-400 animate-spin" />
                <p className="text-gray-400 mt-4">Channeling cosmic wisdom...</p>
              </div>
            ) : currentQuote ? (
              <div className="space-y-4">
                <blockquote className="text-gray-100 text-xl font-light leading-relaxed">
                  "{currentQuote.text}"
                </blockquote>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                  <div className="flex-shrink-0">
                    <p className="text-purple-300 text-lg">— {currentQuote.author}</p>
                    {currentQuote.source && (
                      <p className="text-gray-400">{currentQuote.source}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-start sm:justify-end">
                    {currentQuote.tags.map((tag, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="bg-purple-900/20 text-purple-300 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center">No quote available. Try refreshing.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t border-purple-500/20 pt-4">
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={getRandomQuote}
              disabled={isLoading}
              className="border-purple-500/30 hover:bg-purple-900/30"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              New Quote
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}