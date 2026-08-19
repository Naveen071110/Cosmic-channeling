import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CelestialObject } from '@/types';
import NasaApodCard from '@/components/features/NasaApodCard';
import { Sparkles, Globe, Orbit, Radio, ExternalLink } from 'lucide-react';

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

const Explore = () => {
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('planets');

  // Query for celestial objects
  const { data: celestialObjects = [], isLoading: isLoadingCelestial } = useQuery<CelestialObject[]>({
    queryKey: ['/api/celestial'],
  });

  // Query for space news and facts (from SNAPI v4 + RSS)
  const { data: spaceNews = [], isLoading: isLoadingNews } = useQuery<SpaceNewsItem[]>({
    queryKey: ['/api/space-news'],
    staleTime: 1000 * 60 * 30, // 30 min
  });

  useEffect(() => {
    if (celestialObjects && celestialObjects.length > 0) {
      const filteredObjects = celestialObjects.filter((obj: CelestialObject) =>
        obj.type.toLowerCase() === selectedCategory.slice(0, -1).toLowerCase()
      );

      if (filteredObjects.length > 0) {
        setSelectedObject(filteredObjects[0]);
      }
    }
  }, [celestialObjects, selectedCategory]);

  // Fallback data if API fails
  const fallbackData: Record<string, CelestialObject[]> = {
    planets: [
      {
        id: 'saturn',
        name: 'Saturn',
        type: 'planet',
        image: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1000&q=80',
        description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, with magnificent rings of ice and dust.',
      },
      {
        id: 'mars',
        name: 'Mars',
        type: 'planet',
        image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1000&q=80',
        description: 'Mars is the fourth planet from the Sun, known as the Red Planet due to its iron-rich surface and thin atmosphere.',
      },
    ],
    galaxies: [
      {
        id: 'andromeda',
        name: 'Andromeda Galaxy',
        type: 'galaxy',
        image: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80',
        description: 'The Andromeda Galaxy (Messier 31) is a spiral galaxy approximately 2.5 million light-years from Earth and the nearest major galaxy to the Milky Way.',
      },
    ],
    nebulae: [
      {
        id: 'orion',
        name: 'Orion Nebula',
        type: 'nebula',
        image: 'https://images.unsplash.com/photo-1570032257806-7272438f38da?auto=format&fit=crop&w=1000&q=80',
        description: 'The Orion Nebula is a diffuse nursery situated in the Milky Way, south of Orion’s Belt, where new stars are continuously born.',
      },
    ],
    exoplanets: [
      {
        id: 'trappist1e',
        name: 'TRAPPIST-1e',
        type: 'exoplanet',
        image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1400&q=80',
        description: 'TRAPPIST-1e is an Earth-sized exoplanet orbiting within the habitable zone of the ultra-cool dwarf star TRAPPIST-1, 40 light-years away.',
      },
    ],
  };

  const getFilteredObjects = () => {
    if (celestialObjects && celestialObjects.length > 0) {
      return celestialObjects.filter(
        (obj: CelestialObject) =>
          obj.type.toLowerCase() === selectedCategory.slice(0, -1).toLowerCase()
      );
    }
    return fallbackData[selectedCategory as keyof typeof fallbackData] || [];
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-5xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] via-purple-400 to-[#0EA5E9] bg-clip-text text-transparent">
              Explore the Universe
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Journey through deep space with real NASA observation feeds, live spaceflight news, and celestial catalogs of our cosmos.
          </p>
        </div>

        <Tabs
          defaultValue="apod"
          onValueChange={(value) => {
            if (value !== 'apod' && value !== 'news') {
              setSelectedCategory(value);
            }
          }}
        >
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-8 bg-[#1E293B] border border-white/10 p-1">
            <TabsTrigger value="apod" className="text-xs sm:text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-yellow-300" />
              NASA APOD
            </TabsTrigger>
            <TabsTrigger value="planets" className="text-xs sm:text-sm">Planets</TabsTrigger>
            <TabsTrigger value="galaxies" className="text-xs sm:text-sm">Galaxies</TabsTrigger>
            <TabsTrigger value="nebulae" className="text-xs sm:text-sm">Nebulae</TabsTrigger>
            <TabsTrigger value="exoplanets" className="text-xs sm:text-sm">Exoplanets</TabsTrigger>
            <TabsTrigger value="news" className="text-xs sm:text-sm">
              <Radio className="h-3.5 w-3.5 mr-1 text-sky-400" />
              Live News
            </TabsTrigger>
          </TabsList>

          {/* 1. NASA APOD Tab */}
          <TabsContent value="apod" className="focus:outline-none space-y-6">
            <div className="max-w-4xl mx-auto">
              <NasaApodCard />
            </div>
          </TabsContent>

          {/* 2-5. Celestial Objects Tabs */}
          {['planets', 'galaxies', 'nebulae', 'exoplanets'].map((category) => (
            <TabsContent key={category} value={category} className="focus:outline-none">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {isLoadingCelestial ? (
                    <div className="bg-[#1E293B] rounded-lg w-full h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
                    </div>
                  ) : selectedObject ? (
                    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg">
                      <div className="h-72 w-full overflow-hidden bg-black/40">
                        <img
                          src={selectedObject.image}
                          alt={selectedObject.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6">
                        <h2 className="text-2xl font-space font-bold text-white mb-3">
                          {selectedObject.name}
                        </h2>
                        <p className="text-[#F1F5F9] mb-6 leading-relaxed">
                          {selectedObject.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-[#7E22CE]/30 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30 capitalize">
                            {selectedObject.type}
                          </span>
                          <a
                            href={`https://science.nasa.gov/${selectedObject.type !== 'planet' ? 'universe' : selectedObject.name.toLowerCase()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-[#0EA5E9]/20 text-[#0EA5E9] px-3 py-1 rounded-full hover:bg-[#0EA5E9]/30 transition-colors flex items-center gap-1"
                          >
                            Scientific Data <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href={`https://en.wikipedia.org/wiki/${selectedObject.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-[#EC4899]/20 text-[#EC4899] px-3 py-1 rounded-full hover:bg-[#EC4899]/30 transition-colors flex items-center gap-1"
                          >
                            Encyclopedia <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#1E293B] rounded-lg w-full h-96 flex items-center justify-center">
                      <p className="text-[#64748B]">No {category} data available</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-space font-semibold text-white mb-3">
                    Browse {category}
                  </h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {isLoadingCelestial
                      ? Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <div
                              key={i}
                              className="h-20 bg-[#1E293B] rounded-md animate-pulse"
                            ></div>
                          ))
                      : getFilteredObjects().map((obj: CelestialObject) => (
                          <Card
                            key={obj.id}
                            className={`bg-[#1E293B] border-[#334155] hover:border-[#7E22CE]/60 transition-all cursor-pointer overflow-hidden ${
                              selectedObject?.id === obj.id
                                ? 'border-[#7E22CE] ring-1 ring-[#7E22CE]'
                                : ''
                            }`}
                            onClick={() => setSelectedObject(obj)}
                          >
                            <CardContent className="p-0">
                              <div className="flex items-center">
                                <div className="h-20 w-20 flex-shrink-0 bg-black/40">
                                  <img
                                    src={obj.image}
                                    alt={obj.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="p-3">
                                  <h4 className="font-medium text-white text-sm">{obj.name}</h4>
                                  <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">
                                    {obj.description.substring(0, 70)}...
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}

          {/* 6. Spaceflight News tab content */}
          <TabsContent value="news" className="focus:outline-none">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-space text-white">
                  Live Global Spaceflight Feed
                </h3>
                <p className="text-xs text-gray-400">
                  Aggregated in real-time from Spaceflight News API & space agencies
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
              <div className="bg-[#1E293B] rounded-lg w-full py-12 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#64748B] mb-4">Unable to fetch space news at the moment</p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-[#7E22CE] hover:bg-purple-800"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Explore;
