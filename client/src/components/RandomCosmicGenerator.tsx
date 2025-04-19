import { useState, useEffect } from 'react';
import { getRandomItem } from '@/lib/utils';
import { cosmicQuestions, cosmicAffirmations } from '@/data/cosmicData';

// NASA APOD API endpoint
const APOD_API_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = 'DEMO_KEY'; // Using NASA's demo key

type CosmicPattern = {
  imageUrl: string;
  question: string;
  affirmation: string;
};

export default function RandomCosmicGenerator() {
  const [loading, setLoading] = useState(false);
  const [pattern, setPattern] = useState<CosmicPattern>({
    imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    question: getRandomItem(cosmicQuestions),
    affirmation: getRandomItem(cosmicAffirmations)
  });

  const generateNewPattern = async () => {
    setLoading(true);
    
    try {
      // Fetch a random space image from NASA's APOD API
      const response = await fetch(`${APOD_API_URL}?api_key=${NASA_API_KEY}`);
      const data = await response.json();
      
      setPattern({
        imageUrl: data.url || 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
        question: getRandomItem(cosmicQuestions),
        affirmation: getRandomItem(cosmicAffirmations)
      });
    } catch (error) {
      console.error('Error fetching NASA image:', error);
      // Fallback to just changing the question and affirmation
      setPattern({
        ...pattern,
        question: getRandomItem(cosmicQuestions),
        affirmation: getRandomItem(cosmicAffirmations)
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get a NASA image when the component first mounts
    const fetchInitialImage = async () => {
      try {
        const response = await fetch(`${APOD_API_URL}?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        if (data && data.url) {
          setPattern(prev => ({
            ...prev,
            imageUrl: data.url
          }));
        }
      } catch (error) {
        console.error('Error fetching initial NASA image:', error);
        // Keep the default image in case of error
      }
    };
    
    fetchInitialImage();
  }, []);

  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-magic-line text-2xl text-cosmic-pink mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Generator</h3>
        </div>
        
        <div className="bg-space-950 rounded-md p-4 mb-6 border border-space-800">
          <div className="relative h-32 mb-3 overflow-hidden rounded">
            <img 
              src={pattern.imageUrl} 
              alt="Cosmic visual" 
              className="w-full h-full object-cover" 
              loading="lazy"
            />
          </div>
          
          <p className="text-cosmic-blue mb-2 text-sm font-medium">Quantum Question:</p>
          <p className="text-space-100 text-sm italic mb-3">
            {pattern.question}
          </p>
          
          <p className="text-cosmic-pink text-sm font-medium">Cosmic Affirmation:</p>
          <p className="text-space-100 text-sm">
            {pattern.affirmation}
          </p>
        </div>
        
        <button 
          onClick={generateNewPattern}
          disabled={loading}
          className="w-full bg-cosmic-purple hover:bg-purple-800 text-white py-2 rounded-md transition-colors flex items-center justify-center"
        >
          {loading ? (
            <span>Generating...</span>
          ) : (
            <>
              <i className="ri-refresh-line mr-2"></i> Generate New Cosmic Pattern
            </>
          )}
        </button>
      </div>
    </div>
  );
}
