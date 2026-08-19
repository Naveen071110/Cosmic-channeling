import { useState, useEffect } from 'react';
import { getRandomItem } from '@/lib/utils';
import { cosmicQuestions, cosmicAffirmations } from '@/data/cosmicData';

type CosmicPattern = {
  imageUrl: string;
  question: string;
  affirmation: string;
};

export default function RandomCosmicGenerator() {
  const [loading, setLoading] = useState(false);
  const [pattern, setPattern] = useState<CosmicPattern>({
    imageUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80',
    question: getRandomItem(cosmicQuestions),
    affirmation: getRandomItem(cosmicAffirmations)
  });

  const generateNewPattern = async () => {
    setLoading(true);
    
    try {
      // Fetch space image from our cached APOD backend
      const response = await fetch('/api/nasa/apod');
      const data: any = await response.json().catch(() => ({}));
      
      setPattern({
        imageUrl: data.url || data.hdurl || 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80',
        question: getRandomItem(cosmicQuestions),
        affirmation: getRandomItem(cosmicAffirmations)
      });
    } catch (error) {
      console.error('Error fetching cosmic image:', error);
      // Fallback to just changing the question and affirmation
      setPattern(prev => ({
        ...prev,
        question: getRandomItem(cosmicQuestions),
        affirmation: getRandomItem(cosmicAffirmations)
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to get a cosmic image when the component first mounts
    const fetchInitialImage = async () => {
      try {
        const response = await fetch('/api/nasa/apod');
        const data: any = await response.json().catch(() => ({}));
        
        if (data && (data.url || data.hdurl)) {
          setPattern(prev => ({
            ...prev,
            imageUrl: data.url || data.hdurl
          }));
        }
      } catch (error) {
        console.error('Error fetching initial cosmic image:', error);
      }
    };
    
    fetchInitialImage();
  }, []);

  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-magic-line text-2xl text-cosmic-pink mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Oracle</h3>
        </div>
        
        <div className="relative h-48 mb-4 overflow-hidden rounded-md">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-space-800">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cosmic-purple"></div>
            </div>
          ) : (
            <img 
              src={pattern.imageUrl} 
              alt="Cosmic Oracle" 
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" 
              loading="lazy"
            />
          )}
        </div>
        
        <div className="mb-4">
          <h4 className="text-xs uppercase tracking-wider text-cosmic-pink mb-1 font-semibold">Contemplation</h4>
          <p className="text-sm font-medium mb-3">{pattern.question}</p>
          
          <h4 className="text-xs uppercase tracking-wider text-cosmic-blue mb-1 font-semibold">Affirmation</h4>
          <p className="text-sm italic text-space-600">"{pattern.affirmation}"</p>
        </div>
        
        <button 
          onClick={generateNewPattern}
          disabled={loading}
          className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-pink hover:opacity-90 text-white py-2 px-4 rounded-md transition-opacity flex items-center justify-center text-sm font-medium disabled:opacity-50"
        >
          <i className="ri-refresh-line mr-2"></i>
          {loading ? 'Aligning...' : 'Channel New Pattern'}
        </button>
      </div>
    </div>
  );
}
