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
      <Card className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-2xl shadow-none hover:border-white/15 transition-all duration-300">
        <CardHeader className="pb-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-300" />
              <CardTitle className="text-xl font-semibold font-space text-[#F8FAFC]">
                Daily Cosmic Wisdom
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-xs text-slate-300 border-white/10 bg-white/[0.03] font-mono">
              Live Channel
            </Badge>
          </div>
          <CardDescription className="text-xs text-[#94A3B8] font-normal">
            Timeless universal insights to align your mind and consciousness with the cosmos
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <div className="min-h-[140px] flex flex-col justify-center relative">
            {isLoading ? (
              <div className="text-center py-6">
                <RefreshCw className="mx-auto h-6 w-6 text-slate-400 animate-spin" />
                <p className="text-[#94A3B8] text-xs mt-3 font-mono">Channeling daily cosmic wisdom...</p>
              </div>
            ) : currentQuote ? (
              <div className="space-y-4">
                <div className="relative">
                  <QuoteIcon className="absolute -top-3 -left-2 h-8 w-8 text-white/5 -z-0" />
                  <blockquote className="text-[#F8FAFC] text-lg sm:text-xl font-light leading-relaxed pl-4 z-10 relative italic">
                    "{currentQuote.text}"
                  </blockquote>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
                  <div className="pl-4">
                    <p className="text-[#E2E8F0] text-base font-medium">— {currentQuote.author}</p>
                    {currentQuote.source && (
                      <p className="text-[#94A3B8] text-xs">{currentQuote.source}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
                    {(currentQuote.tags || ['Wisdom', 'Cosmic Consciousness']).map((tag, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="bg-white/[0.02] text-slate-300 text-[11px] border-white/10 font-normal"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-[#94A3B8] text-center text-sm">No quote available. Try refreshing.</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-white/[0.06] pt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGetRandomQuote}
            disabled={isRefreshing}
            className="border-white/15 hover:bg-white/[0.06] text-[#E2E8F0] hover:text-white rounded-xl h-9 px-4 text-xs font-medium backdrop-blur-sm transition-all"
          >
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Inspire Me With Another Insight
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}