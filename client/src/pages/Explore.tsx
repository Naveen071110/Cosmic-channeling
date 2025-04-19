import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CelestialObject } from '@/types';

const Explore = () => {
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('planets');
  
  const { data: celestialObjects, isLoading } = useQuery({
    queryKey: ['/api/celestial'],
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
    if (!celestialObjects && !isLoading) {
      const categoryData = fallbackData[selectedCategory as keyof typeof fallbackData];
      if (categoryData && categoryData.length > 0) {
        setSelectedObject(categoryData[0]);
      }
    }
  }, [celestialObjects, isLoading, selectedCategory]);

  const getFilteredObjects = () => {
    if (celestialObjects) {
      return celestialObjects.filter((obj: CelestialObject) => 
        obj.type.toLowerCase() === selectedCategory.slice(0, -1).toLowerCase()
      );
    }
    return fallbackData[selectedCategory as keyof typeof fallbackData] || [];
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-5xl mx-auto">
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
        
        <Tabs defaultValue="planets" onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="planets">Planets</TabsTrigger>
            <TabsTrigger value="galaxies">Galaxies</TabsTrigger>
            <TabsTrigger value="nebulae">Nebulae</TabsTrigger>
            <TabsTrigger value="exoplanets">Exoplanets</TabsTrigger>
          </TabsList>
          
          {['planets', 'galaxies', 'nebulae', 'exoplanets'].map((category) => (
            <TabsContent key={category} value={category} className="focus:outline-none">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {isLoading ? (
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
                          <span className="text-xs bg-[#0EA5E9]/20 text-[#0EA5E9] px-3 py-1 rounded-full">Scientific Data</span>
                          <span className="text-xs bg-[#EC4899]/20 text-[#EC4899] px-3 py-1 rounded-full">Cosmic Energy</span>
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
                    {isLoading ? (
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
                    
                    {!isLoading && getFilteredObjects().length === 0 && (
                      <p className="text-center text-[#64748B] py-6">No {category} available</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </main>
  );
};

export default Explore;
