import { useState } from 'react';
import { celestialBodies, CelestialBodyType, CelestialBody } from '@/data/celestialBodies';

export default function UniverseExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<CelestialBodyType>('planets');
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(
    celestialBodies.filter(body => body.type === 'planets')[0]
  );
  
  const filteredBodies = celestialBodies.filter(body => body.type === selectedCategory);
  
  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-planet-line text-2xl text-cosmic-blue mr-3"></i>
          <h3 className="text-xl font-medium">Explore Universe</h3>
        </div>
        
        <div className="relative h-40 mb-4 overflow-hidden rounded-md">
          {selectedBody && (
            <>
              <img 
                src={selectedBody.imageUrl} 
                alt={selectedBody.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-space-950 to-transparent p-3">
                <span className="font-medium text-sm">{selectedBody.name}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex overflow-x-auto pb-2 gap-2 mb-4 no-scrollbar">
          <button 
            onClick={() => {
              setSelectedCategory('planets');
              setSelectedBody(celestialBodies.filter(body => body.type === 'planets')[0]);
            }} 
            className={`flex-shrink-0 ${selectedCategory === 'planets' ? 'bg-cosmic-blue' : 'bg-space-800 hover:bg-space-700'} text-white px-3 py-1.5 rounded-full text-xs transition-colors`}
          >
            Planets
          </button>
          <button 
            onClick={() => {
              setSelectedCategory('galaxies');
              setSelectedBody(celestialBodies.filter(body => body.type === 'galaxies')[0]);
            }} 
            className={`flex-shrink-0 ${selectedCategory === 'galaxies' ? 'bg-cosmic-blue' : 'bg-space-800 hover:bg-space-700'} text-white px-3 py-1.5 rounded-full text-xs transition-colors`}
          >
            Galaxies
          </button>
          <button 
            onClick={() => {
              setSelectedCategory('nebulae');
              setSelectedBody(celestialBodies.filter(body => body.type === 'nebulae')[0]);
            }} 
            className={`flex-shrink-0 ${selectedCategory === 'nebulae' ? 'bg-cosmic-blue' : 'bg-space-800 hover:bg-space-700'} text-white px-3 py-1.5 rounded-full text-xs transition-colors`}
          >
            Nebulae
          </button>
          <button 
            onClick={() => {
              setSelectedCategory('exoplanets');
              setSelectedBody(celestialBodies.filter(body => body.type === 'exoplanets')[0]);
            }} 
            className={`flex-shrink-0 ${selectedCategory === 'exoplanets' ? 'bg-cosmic-blue' : 'bg-space-800 hover:bg-space-700'} text-white px-3 py-1.5 rounded-full text-xs transition-colors`}
          >
            Exoplanets
          </button>
        </div>
        
        {selectedBody && (
          <div className="bg-space-950 p-3 rounded-md mb-4 text-sm">
            <p className="text-space-100 mb-2">{selectedBody.description}</p>
            <p className="text-cosmic-blue italic">{selectedBody.cosmicQuote}</p>
          </div>
        )}
        
        <div className="flex overflow-x-auto gap-2 pb-2 mb-4 no-scrollbar">
          {filteredBodies.map((body) => (
            <button
              key={body.id}
              onClick={() => setSelectedBody(body)}
              className={`w-12 h-12 flex-shrink-0 rounded-full overflow-hidden ${selectedBody?.id === body.id ? 'ring-2 ring-cosmic-pink' : ''}`}
            >
              <img 
                src={body.thumbnailUrl || body.imageUrl} 
                alt={body.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        
        <button 
          onClick={() => {
            const currentIndex = filteredBodies.findIndex(body => body.id === selectedBody?.id);
            const nextIndex = (currentIndex + 1) % filteredBodies.length;
            setSelectedBody(filteredBodies[nextIndex]);
          }}
          className="w-full bg-space-800 hover:bg-space-700 text-space-50 py-2 rounded-md transition-colors flex items-center justify-center"
        >
          <i className="ri-rocket-line mr-2"></i> Continue Exploring
        </button>
      </div>
    </div>
  );
}
