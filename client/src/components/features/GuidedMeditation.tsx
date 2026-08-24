import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Play,
  Clock,
  Sparkles,
  ExternalLink,
  Search,
  Moon,
  Sun,
  Flame,
  Waves,
  Compass,
} from 'lucide-react';

interface GuidedSession {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  durationMinutes: number;
  theme: 'cosmic' | 'astral' | 'chakra' | 'sleep' | 'solar' | 'lunar';
  level: 'beginner' | 'intermediate' | 'advanced';
  videoId: string;
  thumbnail: string;
  tags: string[];
}

const GUIDED_MEDITATIONS: GuidedSession[] = [
  {
    id: '1',
    title: 'Deep Space Cosmic Alignment & 432 Hz Sound Bath',
    channelTitle: 'Cosmic Channeling',
    description: 'Immerse your body and consciousness into the universal grid with 432Hz deep space resonance and celestial visualization.',
    durationMinutes: 15,
    theme: 'cosmic',
    level: 'beginner',
    videoId: 'w0gBwZ77j9M',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&auto=format&fit=crop&q=80',
    tags: ['432Hz', 'Cosmic Alignment', 'Deep Peace', 'Sound Bath'],
  },
  {
    id: '2',
    title: 'Astral Projection & Higher Dimensional Consciousness Journey',
    channelTitle: 'Universal Astral Pathways',
    description: 'A gentle, step-by-step guided meditation to expand beyond physical boundaries and travel through the starfields of consciousness.',
    durationMinutes: 25,
    theme: 'astral',
    level: 'advanced',
    videoId: 'hHW1oYw642k',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    tags: ['Astral Travel', 'Theta Waves', 'Expansion', 'Lucid Mind'],
  },
  {
    id: '3',
    title: 'Full Moon Emotional Cleansing & Celestial Renewal',
    channelTitle: 'Lunar Alchemy',
    description: 'Harness lunar magnetic frequencies to dissolve subconscious tension, forgive past cycles, and invite radiant clarity.',
    durationMinutes: 20,
    theme: 'lunar',
    level: 'intermediate',
    videoId: 'eKFTSSKCzWA',
    thumbnail: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&auto=format&fit=crop&q=80',
    tags: ['Full Moon', 'Emotional Healing', 'Renewal', 'Release'],
  },
  {
    id: '4',
    title: 'Solar Plexus Prana & Creative Vitality Activation',
    channelTitle: 'Solar Breathwork',
    description: 'Connect with our host star, the Sun, to ignite your inner flame, energize the physical vessel, and boost confidence.',
    durationMinutes: 10,
    theme: 'solar',
    level: 'beginner',
    videoId: 'M576WGiDBdQ',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    tags: ['Solar Light', 'Prana', 'Vitality', 'Focus'],
  },
  {
    id: '5',
    title: '7 Chakras Cosmic Harmonization & 528 Hz Healing',
    channelTitle: 'Sacred Frequencies',
    description: 'Align each energetic chakra vortex from root to crown with sacred geometry tones and guided universal light streams.',
    durationMinutes: 30,
    theme: 'chakra',
    level: 'intermediate',
    videoId: '1ZYbU8csapM',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tags: ['528Hz', '7 Chakras', 'Energy Body', 'Harmonization'],
  },
  {
    id: '6',
    title: 'Deep Cosmic Sleep & Delta Wave Night Journey',
    channelTitle: 'Slumber Sanctuary',
    description: 'Drift effortlessly into the starlit void with delta frequencies, soothing cosmic ocean winds, and peaceful deep rest guidance.',
    durationMinutes: 45,
    theme: 'sleep',
    level: 'beginner',
    videoId: '86YLFOog4GM',
    thumbnail: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
    tags: ['Deep Sleep', 'Delta Waves', 'Insomnia Relief', 'Starlight'],
  },
];

const THEME_ICONS: Record<string, any> = {
  cosmic: Compass,
  astral: Sparkles,
  lunar: Moon,
  solar: Sun,
  chakra: Flame,
  sleep: Waves,
};

export default function GuidedMeditation() {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSession, setActiveSession] = useState<GuidedSession | null>(null);

  const filteredSessions = useMemo(() => {
    return GUIDED_MEDITATIONS.filter((item) => {
      // Theme filter
      if (selectedTheme !== 'all' && item.theme !== selectedTheme) return false;

      // Duration filter
      if (selectedDuration === 'short' && item.durationMinutes > 15) return false;
      if (selectedDuration === 'medium' && (item.durationMinutes <= 15 || item.durationMinutes > 30)) return false;
      if (selectedDuration === 'long' && item.durationMinutes <= 30) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [selectedTheme, selectedDuration, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-space font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-sky-300 bg-clip-text text-transparent mb-2">
          Guided Cosmic Journeys
        </h2>
        <p className="text-xs sm:text-sm text-gray-300">
          Curated guided meditation sessions playable directly in-app or via YouTube. Expand awareness, tune your chakras, and explore the universe within.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0F172A]/90 p-4 rounded-2xl border border-white/10 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search guided meditations by topic (e.g. 432Hz, sleep, astral)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Duration Selector */}
          <div className="flex gap-1.5 shrink-0 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Lengths' },
              { id: 'short', label: '≤ 15 min' },
              { id: 'medium', label: '15 - 30 min' },
              { id: 'long', label: '30+ min' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDuration(d.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  selectedDuration === d.id
                    ? 'bg-purple-600 text-white font-medium shadow-sm'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Category Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { id: 'all', label: 'All Themes' },
            { id: 'cosmic', label: 'Cosmic Alignment' },
            { id: 'astral', label: 'Astral Journey' },
            { id: 'chakra', label: 'Chakra 528Hz' },
            { id: 'lunar', label: 'Lunar Cleansing' },
            { id: 'solar', label: 'Solar Prana' },
            { id: 'sleep', label: 'Deep Sleep' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTheme(t.id)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedTheme === t.id
                  ? 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white font-medium shadow-sm shadow-purple-900/30'
                  : 'bg-white/5 text-gray-400 hover:text-gray-200 hover:bg-white/10 border border-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Guided Meditation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const IconComponent = THEME_ICONS[session.theme] || Sparkles;

          return (
            <Card
              key={session.id}
              className="bg-[#0F172A]/90 border-[#334155] hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-purple-900/20"
            >
              <div>
                {/* Thumbnail with overlay play trigger */}
                <div
                  onClick={() => setActiveSession(session)}
                  className="aspect-video relative overflow-hidden bg-black/60 cursor-pointer"
                >
                  <img
                    src={session.thumbnail}
                    alt={`Thumbnail for guided meditation: ${session.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-950/80 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  <Badge className="absolute top-3 right-3 bg-purple-950/80 text-purple-200 border border-purple-500/30 text-[10px] uppercase font-mono">
                    {session.theme}
                  </Badge>

                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-[11px] text-gray-200 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{session.durationMinutes} mins</span>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <IconComponent className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-[11px] text-gray-400 truncate">{session.channelTitle}</span>
                  </div>
                  <CardTitle className="text-base font-space text-white leading-snug line-clamp-2">
                    {session.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  <CardDescription className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                    {session.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-1">
                    {session.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/50 text-purple-300 border border-purple-500/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </div>

              <CardFooter className="pt-3 border-t border-white/5 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setActiveSession(session)}
                  className="flex-1 bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-8"
                >
                  <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                  Play in App
                </Button>
                <a
                  href={`https://www.youtube.com/watch?v=${session.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-2.5 h-8 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs border border-white/10 transition-colors"
                  title="Open on YouTube in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-16 bg-[#0F172A]/40 rounded-2xl border border-white/5">
          <p className="text-gray-400 text-sm mb-3">No guided meditations found matching your search.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedTheme('all');
              setSelectedDuration('all');
              setSearchQuery('');
            }}
            className="border-white/10 text-xs text-gray-300"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* In-App YouTube Player Lightbox Modal */}
      {activeSession && (
        <Dialog open={!!activeSession} onOpenChange={(open) => !open && setActiveSession(null)}>
          <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto bg-[#0B0F19]/95 backdrop-blur-xl border-purple-500/40 text-white p-4 sm:p-6 shadow-2xl">
            <DialogHeader className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-900/60 text-purple-200 border-purple-400/30 text-[10px] uppercase font-mono">
                  {activeSession.theme} Journey
                </Badge>
                <span className="text-xs text-gray-400">• {activeSession.durationMinutes} Minutes</span>
              </div>
              <DialogTitle className="text-lg sm:text-xl font-space font-bold text-white">
                {activeSession.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400">
                {activeSession.channelTitle}
              </DialogDescription>
            </DialogHeader>

            {/* Responsive 16:9 YouTube Embed */}
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg my-2">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeSession.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeSession.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Session Notes & External Link Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-300">
              <p className="line-clamp-2 leading-relaxed flex-1">
                {activeSession.description}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${activeSession.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-950/60 transition-colors shrink-0"
              >
                <i className="ri-youtube-line text-sm"></i>
                <span>Open in YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}