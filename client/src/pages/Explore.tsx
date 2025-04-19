import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CelestialObject } from '@/types';

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
  // Format date if it exists
  const formattedDate = item.pubDate ? new Date(item.pubDate).toLocaleDateString() : null;
  
  return (
    <Card className="bg-[#1E293B] border-[#334155] hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-36 md:h-auto relative">
            <img 
              src={item.image} 
              alt={item.title}
              className="h-full w-full object-cover"
            />
            {item.type === 'news' && (
              <Badge className="absolute top-2 right-2 bg-[#EC4899]">
                {item.source || 'News'}
              </Badge>
            )}
            {item.type === 'fact' && (
              <Badge className="absolute top-2 right-2 bg-[#0EA5E9]">
                Fact
              </Badge>
            )}
          </div>
          <div className="p-4 md:p-6 md:w-2/3">
            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
            <p className="text-sm text-[#94A3B8] mb-3 line-clamp-2">
              {item.content}
            </p>
            {formattedDate && (
              <p className="text-xs text-[#64748B] mb-3">
                Published: {formattedDate}
              </p>
            )}
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#7E22CE] hover:text-[#EC4899] text-sm flex items-center transition-colors"
            >
              Read more <i className="ri-external-link-line ml-1"></i>
            </a>
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

  // Query for space news and facts
  const { data: spaceNews = [], isLoading: isLoadingNews } = useQuery<SpaceNewsItem[]>({
    queryKey: ['/api/space-news'],
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
  const fallbackData = {
    planets: [
      {
        id: "saturn",
        name: "Saturn",
        type: "planet",
        image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth."
      },
      {
        id: "mars",
        name: "Mars",
        type: "planet",
        image: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        description: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. Mars is often called the 'Red Planet' due to its reddish appearance."
      }
    ],
    galaxies: [
      {
        id: "andromeda",
        name: "Andromeda Galaxy",
        type: "galaxy",
        image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        description: "The Andromeda Galaxy, also known as Messier 31, is a spiral galaxy approximately 2.5 million light-years from Earth and the nearest major galaxy to the Milky Way."
      }
    ],
    nebulae: [
      {
        id: "orion",
        name: "Orion Nebula",
        type: "nebula",
        image: "https://images.unsplash.com/photo-1570032257806-7272438f38da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        description: "The Orion Nebula is a diffuse nebula situated in the Milky Way, being south of Orion's Belt in the constellation of Orion. It is one of the brightest nebulae, and is visible to the naked eye in the night sky."
      }
    ],
    exoplanets: [
      {
        id: "trappist1e",
        name: "TRAPPIST-1e",
        type: "exoplanet",
        image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
        description: "TRAPPIST-1e is an exoplanet orbiting the ultra-cool dwarf star TRAPPIST-1. It is the fourth planet in order of distance from its star. It is very likely tidally locked, with one face always towards its star."
      }
    ]
  };

  // Use fallback data if API fails
  useEffect(() => {
    if (!celestialObjects && !isLoadingCelestial) {
      const categoryData = fallbackData[selectedCategory as keyof typeof fallbackData];
      if (categoryData && categoryData.length > 0) {
        setSelectedObject(categoryData[0]);
      }
    }
  }, [celestialObjects, isLoadingCelestial, selectedCategory]);

  const getFilteredObjects = () => {
    if (celestialObjects) {
      return celestialObjects.filter((obj: CelestialObject) => 
        obj.type.toLowerCase() === selectedCategory.slice(0, -1).toLowerCase()
      );
    }
    return fallbackData[selectedCategory as keyof typeof fallbackData] || [];
  };

  // Whether to show news tab content
  const [showingNews, setShowingNews] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-5xl mx-auto mb-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
              Explore the Universe
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-2xl mx-auto">
            Journey through the cosmos and discover the wonders of space. From planets to distant galaxies, explore the beauty and mystery of our universe.
          </p>
        </div>
        
        <Tabs defaultValue="planets" onValueChange={(value) => {
          if (value === 'news') {
            setShowingNews(true);
          } else {
            setShowingNews(false);
            setSelectedCategory(value);
          }
        }}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="galaxies">Galaxies</TabsTrigger>
            <TabsTrigger value="nebulae">Nebulae</TabsTrigger>
            <TabsTrigger value="exoplanets">Exoplanets</TabsTrigger>
            <TabsTrigger value="news">Space News</TabsTrigger>
          </TabsList>
          
          {/* Celestial objects tabs content */}
          {['planets', 'galaxies', 'nebulae', 'exoplanets'].map((category) => (
            <TabsContent key={category} value={category} className="focus:outline-none">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {isLoadingCelestial ? (
                    <div className="bg-[#1E293B] rounded-lg w-full h-96 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0EA5E9]"></div>
                    </div>
                  ) : selectedObject ? (
                    <div className="bg-[#1E293B] rounded-lg overflow-hidden">
                      <div className="h-64 w-full overflow-hidden">
                        <img 
                          src={selectedObject.image} 
                          alt={selectedObject.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h2 className="text-2xl font-space font-bold mb-3">{selectedObject.name}</h2>
                        <p className="text-[#F1F5F9] mb-4">{selectedObject.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs bg-[#7E22CE]/20 text-[#7E22CE] px-3 py-1 rounded-full">{selectedObject.type}</span>
                          <a 
                            href={`https://science.nasa.gov/${selectedObject.type !== 'planet' ? 'universe' : selectedObject.name.toLowerCase()}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs bg-[#0EA5E9]/20 text-[#0EA5E9] px-3 py-1 rounded-full hover:bg-[#0EA5E9]/30 transition-colors"
                          >
                            Scientific Data
                          </a>
                          <a 
                            href={`https://en.wikipedia.org/wiki/${selectedObject.name}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs bg-[#EC4899]/20 text-[#EC4899] px-3 py-1 rounded-full hover:bg-[#EC4899]/30 transition-colors"
                          >
                            Learn More
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
                  <h3 className="text-lg font-space font-medium mb-3">Browse {category}</h3>
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {isLoadingCelestial ? (
                      Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-20 bg-[#1E293B] rounded-md animate-pulse"></div>
                      ))
                    ) : (
                      getFilteredObjects().map((obj: CelestialObject) => (
                        <Card 
                          key={obj.id}
                          className={`bg-[#1E293B] border-[#334155] hover:border-[#7E22CE]/40 transition-all cursor-pointer ${
                            selectedObject?.id === obj.id ? 'border-[#7E22CE]' : ''
                          }`}
                          onClick={() => setSelectedObject(obj)}
                        >
                          <CardContent className="p-0">
                            <div className="flex items-center">
                              <div className="h-20 w-20 flex-shrink-0">
                                <img 
                                  src={obj.image} 
                                  alt={obj.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-3">
                                <h4 className="font-medium">{obj.name}</h4>
                                <p className="text-xs text-[#64748B] line-clamp-2">
                                  {obj.description.substring(0, 60)}...
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                    
                    {!isLoadingCelestial && getFilteredObjects().length === 0 && (
                      <p className="text-center text-[#64748B] py-6">No {category} available</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
          
          {/* Space News tab content */}
          <TabsContent value="news" className="focus:outline-none">
            {isLoadingNews ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-36 bg-[#1E293B] rounded-md animate-pulse"></div>
                ))}
              </div>
            ) : spaceNews.length > 0 ? (
              <div className="space-y-6">
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
