import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CelestialObject } from '@/types';
import NasaApodCard from '@/components/features/NasaApodCard';
import {
  Sparkles,
  Radio,
  ExternalLink,
  Maximize2,
  Telescope,
  Compass,
  Orbit,
  Eye,
  Info,
} from 'lucide-react';
import { celestialObjects as staticCelestialObjects } from '@/lib/data';

// Type for space news and facts coming from the API
interface SpaceNewsItem {
  title: string;
  content: string;
  pubDate?: string;
  url: string;
  type: 'news' | 'fact';
  source?: string;
  image: string;
}

const SpaceNewsCard = ({ item }: { item: SpaceNewsItem }) => {
  const formattedDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString() : null;

  return (
    <Card className="bg-[#1E293B] border-[#334155] hover:shadow-[0_0_20px_rgba(124,58,237,0.35)] transition-all hover:border-[#7E22CE]/60 group overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-44 md:h-auto relative overflow-hidden bg-black/50">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {item.type === 'news' && (
              <Badge className="absolute top-2 right-2 bg-[#EC4899] text-white shadow-md">
                {item.source || 'Spaceflight News'}
              </Badge>
            )}
            {item.type === 'fact' && (
              <Badge className="absolute top-2 right-2 bg-[#0EA5E9] text-white shadow-md">
                Cosmic Fact
              </Badge>
            )}
          </div>
          <div className="p-5 md:p-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-space font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#94A3B8] mb-4 line-clamp-3 leading-relaxed">
                {item.content}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              {formattedDate ? (
                <span className="text-xs text-[#64748B]">Published: {formattedDate}</span>
              ) : (
                <span className="text-xs text-[#64748B]">Source: {item.source || 'Space News'}</span>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0EA5E9] hover:text-[#38BDF8] text-xs font-medium flex items-center transition-colors"
              >
                Read full article <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<string>('planets');
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [hdModalOpen, setHdModalOpen] = useState<boolean>(false);

  // Query for celestial objects from API (falls back to expanded static data)
  const { data: apiCelestialObjects = [], isLoading: isLoadingCelestial } = useQuery<CelestialObject[]>({
    queryKey: ['/api/celestial'],
  });

  const allCelestialObjects = apiCelestialObjects.length > 0 ? apiCelestialObjects : staticCelestialObjects;

  // Query for space news and facts (from SNAPI v4 + RSS)
  const { data: spaceNews = [], isLoading: isLoadingNews } = useQuery<SpaceNewsItem[]>({
    queryKey: ['/api/space-news'],
    staleTime: 1000 * 60 * 30, // 30 min
  });

  // Filter objects by selected category tab
  const getFilteredObjects = (cat: string) => {
    return allCelestialObjects.filter((obj: CelestialObject) => {
      if (cat === 'planets') return obj.type === 'planet' || obj.type === 'solar';
      if (cat === 'galaxies') return obj.type === 'galaxy';
      if (cat === 'nebulae') return obj.type === 'nebula';
      if (cat === 'exoplanets') return obj.type === 'exoplanet';
      if (cat === 'blackholes') return obj.type === 'blackhole';
      return false;
    });
  };

  // Sync selected object when category changes
  useEffect(() => {
    if (selectedCategory !== 'apod' && selectedCategory !== 'news') {
      const items = getFilteredObjects(selectedCategory);
      if (items.length > 0) {
        setSelectedObject(items[0]);
      }
    }
  }, [selectedCategory, allCelestialObjects]);

  return (
    <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <section className="max-w-6xl mx-auto space-y-8">
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Telescope className="w-3.5 h-3.5" />
            <span>Deep Space Celestial Atlas & Observations</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-space">
            <span className="bg-gradient-to-r from-[#EC4899] via-purple-400 to-[#0EA5E9] bg-clip-text text-transparent">
              Explore the Universe
            </span>
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Journey through deep space with real NASA observation feeds, 30+ high-definition celestial worlds, and live global spaceflight dispatches.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <Tabs
          defaultValue="apod"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <div className="flex justify-center mb-8 overflow-x-auto pb-2 sm:pb-0">
            <TabsList className="grid grid-cols-3 sm:grid-cols-7 w-full max-w-4xl bg-[#1E293B] border border-white/10 p-1 rounded-2xl">
              <TabsTrigger value="apod" className="text-xs sm:text-sm font-space flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300 shrink-0" />
                <span>NASA APOD</span>
              </TabsTrigger>
              <TabsTrigger value="planets" className="text-xs sm:text-sm font-space">
                Solar System
              </TabsTrigger>
              <TabsTrigger value="galaxies" className="text-xs sm:text-sm font-space">
                Galaxies
              </TabsTrigger>
              <TabsTrigger value="nebulae" className="text-xs sm:text-sm font-space">
                Nebulae
              </TabsTrigger>
              <TabsTrigger value="exoplanets" className="text-xs sm:text-sm font-space">
                Exoplanets
              </TabsTrigger>
              <TabsTrigger value="blackholes" className="text-xs sm:text-sm font-space">
                Black Holes
              </TabsTrigger>
              <TabsTrigger value="news" className="text-xs sm:text-sm font-space flex items-center gap-1.5">
                <Radio className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                <span>Live News</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 1. NASA APOD Tab */}
          <TabsContent value="apod" className="focus:outline-none space-y-6">
            <div className="max-w-4xl mx-auto">
              <NasaApodCard />
            </div>
          </TabsContent>

          {/* 2-6. Celestial Atlas Category Tabs */}
          {['planets', 'galaxies', 'nebulae', 'exoplanets', 'blackholes'].map((categoryKey) => {
            const categoryObjects = getFilteredObjects(categoryKey);

            return (
              <TabsContent key={categoryKey} value={categoryKey} className="focus:outline-none space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Viewport: Main Featured Object Card */}
                  <div className="lg:col-span-8">
                    {selectedObject ? (
                      <Card className="bg-[#0F172A]/95 rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl backdrop-blur-xl">
                        {/* High-Res Hero Image with Expand Action */}
                        <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-black/60 group">
                          <img
                            src={selectedObject.hdImage || selectedObject.image}
                            alt={selectedObject.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/30 pointer-events-none" />

                          {/* Top Badges */}
                          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            <Badge className="bg-purple-950/80 text-purple-200 border border-purple-400/30 text-xs font-mono uppercase backdrop-blur-sm">
                              {selectedObject.type}
                            </Badge>
                            {selectedObject.constellation && (
                              <Badge className="bg-black/60 text-gray-200 border border-white/10 text-xs font-mono backdrop-blur-sm">
                                {selectedObject.constellation}
                              </Badge>
                            )}
                          </div>

                          {/* Expand Modal Trigger */}
                          <button
                            onClick={() => setHdModalOpen(true)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-purple-900/80 border border-white/20 text-white transition-all shadow-lg backdrop-blur-sm"
                            title="Expand Full HD Image"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Telemetry & Description Content */}
                        <div className="p-6 sm:p-8 space-y-6">
                          <div>
                            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                              <h2 className="text-2xl sm:text-3xl font-space font-bold text-white">
                                {selectedObject.name}
                              </h2>
                              {selectedObject.distance && (
                                <span className="text-xs font-mono text-sky-400 flex items-center gap-1">
                                  <Orbit className="w-3.5 h-3.5" />
                                  {selectedObject.distance}
                                </span>
                              )}
                            </div>

                            {selectedObject.mission && (
                              <p className="text-xs font-mono text-purple-300">
                                Observation: {selectedObject.mission}
                              </p>
                            )}
                          </div>

                          <p className="text-sm text-gray-200 leading-relaxed">
                            {selectedObject.description}
                          </p>

                          {/* Key Cosmic Fact */}
                          {selectedObject.keyFact && (
                            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
                                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                                <span>Cosmic Telemetry Insight</span>
                              </div>
                              <p className="text-xs text-purple-200/90 leading-relaxed italic">
                                {selectedObject.keyFact}
                              </p>
                            </div>
                          )}

                          {/* Action Links */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/5">
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={`https://science.nasa.gov/${selectedObject.type !== 'planet' ? 'universe' : selectedObject.name.toLowerCase()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs bg-[#0EA5E9]/20 hover:bg-[#0EA5E9]/30 text-[#0EA5E9] px-3.5 py-1.5 rounded-lg transition-colors border border-[#0EA5E9]/30"
                              >
                                <span>NASA Science Data</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              <a
                                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selectedObject.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3.5 py-1.5 rounded-lg transition-colors border border-white/10"
                              >
                                <span>Encyclopedia</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                            <Button
                              size="sm"
                              onClick={() => setHdModalOpen(true)}
                              className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white text-xs h-8 px-4"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              View 4K Visual
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <div className="bg-[#1E293B] rounded-2xl h-96 flex items-center justify-center border border-white/10">
                        <p className="text-gray-400 text-sm">Select a celestial object to view details.</p>
                      </div>
                    )}
                  </div>

                  {/* Right Sidebar: Object Catalog List */}
                  <div className="lg:col-span-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <h3 className="text-sm font-space font-bold text-white uppercase tracking-wider">
                        {categoryKey === 'planets'
                          ? 'Solar Objects'
                          : categoryKey === 'blackholes'
                          ? 'Black Holes'
                          : categoryKey}
                      </h3>
                      <Badge className="bg-[#1E293B] text-purple-300 border-purple-500/30 text-xs font-mono">
                        {categoryObjects.length} Wonders
                      </Badge>
                    </div>

                    <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
                      {categoryObjects.map((obj: CelestialObject) => {
                        const isSelected = selectedObject?.id === obj.id;

                        return (
                          <Card
                            key={obj.id}
                            onClick={() => setSelectedObject(obj)}
                            className={`bg-[#0F172A]/90 border transition-all cursor-pointer overflow-hidden group ${
                              isSelected
                                ? 'border-purple-500 shadow-md shadow-purple-950/60 ring-1 ring-purple-500/50'
                                : 'border-[#334155]/80 hover:border-purple-500/40 hover:bg-[#1E293B]'
                            }`}
                          >
                            <CardContent className="p-0">
                              <div className="flex items-center">
                                <div className="h-20 w-20 flex-shrink-0 bg-black/60 relative overflow-hidden">
                                  <img
                                    src={obj.image}
                                    alt={obj.name}
                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="p-3 min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 className="font-space font-semibold text-white text-xs sm:text-sm truncate group-hover:text-purple-300 transition-colors">
                                      {obj.name}
                                    </h4>
                                  </div>
                                  <p className="text-[11px] text-gray-400 font-mono truncate mt-0.5">
                                    {obj.distance || obj.constellation || obj.type}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}

          {/* 7. Live Spaceflight News Tab */}
          <TabsContent value="news" className="focus:outline-none space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-space text-white">
                  Live Global Spaceflight Feed
                </h3>
                <p className="text-xs text-gray-400">
                  Aggregated in real-time from Spaceflight News API & global space agencies
                </p>
              </div>
            </div>

            {isLoadingNews ? (
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-36 bg-[#1E293B] rounded-xl animate-pulse"></div>
                  ))}
              </div>
            ) : spaceNews.length > 0 ? (
              <div className="space-y-4">
                {spaceNews.map((item: SpaceNewsItem, i: number) => (
                  <SpaceNewsCard key={i} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-[#1E293B] rounded-2xl w-full py-12 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <p className="text-gray-400 mb-4 text-sm">Unable to fetch live space news at the moment</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-[#7E22CE] hover:bg-purple-800 text-white text-xs"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Full-Screen HD Contemplation Modal */}
      {selectedObject && (
        <Dialog open={hdModalOpen} onOpenChange={setHdModalOpen}>
          <DialogContent className="sm:max-w-[920px] max-h-[90vh] overflow-y-auto bg-[#0B0F19]/95 backdrop-blur-2xl border-purple-500/40 text-white p-4 sm:p-6 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-950/80 text-purple-200 border-purple-400/30 text-[10px] font-mono uppercase">
                  {selectedObject.type}
                </Badge>
                {selectedObject.distance && (
                  <span className="text-xs text-sky-400 font-mono">• {selectedObject.distance}</span>
                )}
              </div>
              <DialogTitle className="text-2xl font-space font-bold text-white">
                {selectedObject.name}
              </DialogTitle>
            </DialogHeader>

            <div className="relative rounded-xl overflow-hidden bg-black max-h-[520px] flex items-center justify-center my-3 shadow-xl border border-white/10">
              <img
                src={selectedObject.hdImage || selectedObject.image}
                alt={selectedObject.name}
                className="w-full h-full object-contain max-h-[500px]"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {selectedObject.description}
              </p>
              {selectedObject.keyFact && (
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200">
                  <span className="font-bold mr-1">Key Insight:</span>
                  {selectedObject.keyFact}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
