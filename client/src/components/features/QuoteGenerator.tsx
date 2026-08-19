import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { RefreshCw, Sparkles, Quote as QuoteIcon } from 'lucide-react';

interface CosmicQuote {
  id?: string;
  text: string;
  author: string;
  source?: string;
  tags?: string[];
  isFallback?: boolean;
}

export default function QuoteGenerator() {
  const [manualQuote, setManualQuote] = useState<CosmicQuote | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch daily quote
  const { data: dailyQuote, isLoading } = useQuery<CosmicQuote>({
    queryKey: ['/api/quotes/daily'],
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });

  const currentQuote = manualQuote || dailyQuote;

  // Fetch random cosmic quote on demand
  const handleGetRandomQuote = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/quotes/random');
      if (res.ok) {
        const quote = (await res.json()) as CosmicQuote;
        setManualQuote(quote);
      }
    } catch (e) {
      console.warn('Failed to fetch random quote, using local rotation:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-[#1E1B4B]/50 via-[#0F172A]/90 to-[#1E1B4B]/40 backdrop-blur-md border-[#7E22CE]/30 shadow-[0_4px_30px_rgba(124,58,237,0.12)]">
        <CardHeader className="pb-3 border-b border-purple-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-xl font-space text-white">
                Daily Cosmic Wisdom
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/30">
              Live Channel
            </Badge>
          </div>
          <CardDescription className="text-xs text-gray-400">
            Timeless universal insights to align your mind and consciousness with the cosmos
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <div className="min-h-[140px] flex flex-col justify-center relative">
            {isLoading ? (
              <div className="text-center py-6">
                <RefreshCw className="mx-auto h-7 w-7 text-purple-400 animate-spin" />
                <p className="text-gray-400 text-xs mt-3">Channeling daily cosmic wisdom...</p>
              </div>
            ) : currentQuote ? (
              <div className="space-y-4">
                <div className="relative">
                  <QuoteIcon className="absolute -top-3 -left-2 h-8 w-8 text-purple-500/20 -z-0" />
                  <blockquote className="text-gray-100 text-lg sm:text-xl font-light leading-relaxed pl-4 z-10 relative italic">
                    "{currentQuote.text}"
                  </blockquote>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
                  <div className="pl-4">
                    <p className="text-purple-300 text-base font-medium">— {currentQuote.author}</p>
                    {currentQuote.source && (
                      <p className="text-gray-400 text-xs">{currentQuote.source}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                    {(currentQuote.tags || ['Wisdom', 'Cosmic Consciousness']).map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-purple-900/30 text-purple-300 text-[11px] border-purple-500/20"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-center text-sm">No quote available. Try refreshing.</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-purple-500/10 pt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetRandomQuote}
            disabled={isRefreshing}
            className="border-purple-500/30 hover:bg-purple-900/30 text-purple-200 hover:text-white"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Inspire Me With Another Insight
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}