import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sparkles, Maximize2, ExternalLink, RefreshCw, Calendar, Info } from 'lucide-react';

export interface ApodData {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  isFallback?: boolean;
}

export default function NasaApodCard({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  const { data: apod, isLoading, refetch, isFetching } = useQuery<ApodData>({
    queryKey: ['/api/nasa/apod'],
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
  });

  if (isLoading) {
    return (
      <Card className="bg-[#0F172A]/80 border-[#334155] overflow-hidden animate-pulse">
        <div className="h-64 sm:h-80 bg-[#1E293B] flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-[#0EA5E9] animate-spin" />
        </div>
        <CardContent className="p-6">
          <div className="h-6 bg-[#1E293B] rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-[#1E293B] rounded w-full mb-2"></div>
          <div className="h-4 bg-[#1E293B] rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  if (!apod) {
    return null;
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-[#0F172A] via-[#1E1B4B]/70 to-[#0F172A] border-[#7E22CE]/30 hover:border-[#7E22CE]/60 transition-all duration-300 overflow-hidden group shadow-[0_4px_25px_rgba(124,58,237,0.15)]">
        <div className="relative overflow-hidden h-72 sm:h-96 w-full bg-black">
          {apod.media_type === 'video' ? (
            <iframe
              src={apod.url}
              title={apod.title}
              className="w-full h-full object-cover"
              allowFullScreen
            />
          ) : (
            <img
              src={apod.url}
              alt={`NASA Astronomy Picture of the Day: ${apod.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
              loading="lazy"
              onClick={() => setIsOpen(true)}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/40 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <Badge className="bg-[#7E22CE]/90 hover:bg-[#7E22CE] text-white backdrop-blur-md border border-purple-400/30 flex items-center gap-1.5 shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              NASA Astronomy Picture of the Day
            </Badge>

            <div className="flex items-center gap-2 pointer-events-auto">
              {apod.hdurl && apod.media_type === 'image' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-2.5 bg-black/60 hover:bg-black/90 text-white border-white/20 backdrop-blur-md"
                  onClick={() => setIsOpen(true)}
                  title="View full resolution"
                >
                  <Maximize2 className="h-3.5 w-3.5 mr-1" />
                  HD
                </Button>
              )}
            </div>
          </div>

          {/* Date pill on image */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-purple-200 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            <Calendar className="h-3 w-3 text-[#0EA5E9]" />
            <span>{apod.date}</span>
            {apod.copyright && <span>• © {apod.copyright}</span>}
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-space text-white tracking-wide">
                {apod.title}
              </h3>
            </div>
          </div>

          <p className="text-[#CBD5E1] text-sm leading-relaxed mb-4">
            {showFullText || compact
              ? apod.explanation
              : `${apod.explanation.slice(0, 220)}...`}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
            <button
              onClick={() => setShowFullText(!showFullText)}
              className="text-xs text-[#0EA5E9] hover:text-[#38BDF8] flex items-center gap-1 font-medium transition-colors"
            >
              <Info className="h-3.5 w-3.5" />
              {showFullText ? 'Show less' : 'Read full cosmic explanation'}
            </button>

            <div className="flex items-center gap-3">
              {apod.hdurl && (
                <a
                  href={apod.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  Original HD <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-gray-400 hover:text-white"
                onClick={() => refetch()}
                disabled={isFetching}
                title="Refresh image"
              >
                <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Resolution Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-5xl bg-[#090D16] border-[#334155] text-white p-2 sm:p-6 overflow-hidden">
          <DialogHeader className="px-2 pt-2">
            <DialogTitle className="text-lg sm:text-xl font-space text-white">
              {apod.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              NASA APOD • {apod.date} {apod.copyright ? `• © ${apod.copyright}` : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="relative max-h-[75vh] overflow-auto rounded-lg my-2 bg-black flex items-center justify-center">
            <img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              className="max-h-[70vh] w-auto object-contain"
            />
          </div>

          <p className="text-xs sm:text-sm text-gray-300 px-2 line-clamp-3 hover:line-clamp-none transition-all">
            {apod.explanation}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
