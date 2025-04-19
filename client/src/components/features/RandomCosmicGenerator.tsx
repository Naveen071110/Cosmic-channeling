import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

interface CosmicPattern {
  image: string;
  question: string;
  affirmation: string;
}

const RandomCosmicGenerator = () => {
  const [currentPattern, setCurrentPattern] = useState<CosmicPattern | null>(null);
  
  const { data: cosmicData, isLoading } = useQuery({
    queryKey: ['/api/cosmic-patterns'],
  });

  // Generate a random pattern when data is loaded or when button is clicked
  const generatePattern = () => {
    if (cosmicData && cosmicData.length > 0) {
      const randomIndex = Math.floor(Math.random() * cosmicData.length);
      setCurrentPattern(cosmicData[randomIndex]);
    } else {
      // Fallback if API fails
      const fallbackPatterns = [
        {
          image: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          question: "If consciousness affects reality at the quantum level, how might your thoughts be shaping the universe?",
          affirmation: "I am a conscious participant in the universal flow of cosmic energy."
        },
        {
          image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1400&q=80",
          question: "What if the stars you see at night are sending you personal messages across time and space?",
          affirmation: "I am connected to the vast wisdom of the universe."
        }
      ];
      
      const randomIndex = Math.floor(Math.random() * fallbackPatterns.length);
      setCurrentPattern(fallbackPatterns[randomIndex]);
    }
  };

  useEffect(() => {
    generatePattern();
  }, [cosmicData]);
  
  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-magic-line text-2xl text-[#EC4899] mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Generator</h3>
        </div>
        
        <div className="bg-[#0F172A] rounded-md p-4 mb-6 border border-[#334155]">
          {isLoading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EC4899]"></div>
            </div>
          ) : (
            <>
              <div className="relative h-32 mb-3 overflow-hidden rounded">
                <img 
                  src={currentPattern?.image || "https://images.unsplash.com/photo-1543722530-d2c3201371e7"} 
                  alt="Cosmic image" 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
              
              <p className="text-[#0EA5E9] mb-2 text-sm font-medium">Quantum Question:</p>
              <p className="text-[#F1F5F9] text-sm italic mb-3">
                {currentPattern?.question}
              </p>
              
              <p className="text-[#EC4899] text-sm font-medium">Cosmic Affirmation:</p>
              <p className="text-[#F1F5F9] text-sm">
                {currentPattern?.affirmation}
              </p>
            </>
          )}
        </div>
        
        <Button 
          onClick={generatePattern}
          disabled={isLoading}
          className="w-full bg-[#7E22CE] hover:bg-purple-800 text-white py-2 rounded-md transition-colors flex items-center justify-center"
        >
          <i className="ri-refresh-line mr-2"></i> Generate New Cosmic Pattern
        </Button>
      </div>
    </div>
  );
};

export default RandomCosmicGenerator;
