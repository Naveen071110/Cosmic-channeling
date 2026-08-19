import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'galaxy' | 'nebula' | 'exoplanet';
  image: string;
  description: string;
}

const UniverseExplorer = () => {
  const [selectedType, setSelectedType] = useState<string>('planets');
  const [selectedObject, setSelectedObject] = useState<CelestialObject | null>(null);

  const { data: celestialObjects = [], isLoading } = useQuery<CelestialObject[]>({
    queryKey: ['/api/celestial'],
  });

  useEffect(() => {
    if (celestialObjects && celestialObjects.length > 0) {
      const filtered = celestialObjects.filter((obj) => 
        obj.type.toLowerCase() === selectedType.toLowerCase().slice(0, -1)
      );
      
      if (filtered.length > 0) {
        setSelectedObject(filtered[0]);
      }
    }
  }, [celestialObjects, selectedType]);

  const handleFilterClick = (filter: string) => {
    setSelectedType(filter);
  };

  // Fallback data if API fails
  useEffect(() => {
    if (!celestialObjects.length && !isLoading) {
      setSelectedObject({
        id: "saturn",
        name: "Saturn",
        type: "planet",
        image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=1000&q=80",
        description: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth."
      });
    }
  }, [celestialObjects, isLoading]);

  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-planet-line text-2xl text-[#0EA5E9] mr-3"></i>
          <h3 className="text-xl font-medium text-white">Explore Universe</h3>
        </div>
        
        <div className="relative h-40 mb-4 overflow-hidden rounded-md">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-[#0F172A]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0EA5E9]"></div>
            </div>
          ) : selectedObject ? (
            <>
              <img 
                src={selectedObject.image} 
                alt={selectedObject.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F172A] to-transparent p-3">
                <span className="font-medium text-sm text-white">{selectedObject.name}</span>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0F172A] text-gray-400 text-sm">
              No celestial object selected
            </div>
          )}
        </div>
        
        <div className="flex overflow-x-auto pb-2 gap-2 mb-4 no-scrollbar">
          {['planets', 'galaxies', 'nebulae', 'exoplanets'].map((filter) => (
            <button 
              key={filter}
              onClick={() => handleFilterClick(filter)} 
              className={`flex-shrink-0 capitalize ${selectedType === filter ? 'bg-[#0EA5E9] text-white' : 'bg-[#334155] hover:bg-[#475569] text-gray-300'} px-3 py-1.5 rounded-full text-xs transition-colors`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-300 line-clamp-3 mb-4">
          {selectedObject?.description || "Explore planets, distant galaxies, glowing nebulae, and extrasolar worlds across deep cosmic space."}
        </p>
      </div>
    </div>
  );
};

export default UniverseExplorer;
