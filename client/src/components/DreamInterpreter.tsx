import { useState } from 'react';
import { extractKeywords } from '@/lib/utils';
import { dreamSymbols } from '@/data/dreamSymbols';

type Interpretation = {
  text: string;
  themes: string[];
};

export default function DreamInterpreter() {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  
  const interpretDream = () => {
    if (!dreamText.trim()) return;
    
    // Extract keywords from the dream description
    const keywords = extractKeywords(dreamText);
    
    // Find matching symbols in our dream dictionary
    const matchedSymbols = keywords
      .map(keyword => dreamSymbols.find(symbol => 
        symbol.keywords.some(k => k.includes(keyword) || keyword.includes(k))
      ))
      .filter(Boolean);
    
    if (matchedSymbols.length === 0) {
      // If no matches, provide a generic cosmic interpretation
      setInterpretation({
        text: "Your dream contains cosmic elements that suggest an awakening connection to the universe. Pay attention to the emotions you felt during this dream, as they reveal your spiritual state.",
        themes: ["Cosmic Connection", "Self Discovery"]
      });
      return;
    }
    
    // Create an interpretation based on matched symbols
    const uniqueSymbols = Array.from(new Set(matchedSymbols));
    const interpretationText = uniqueSymbols
      .map(symbol => symbol?.interpretation)
      .join(' ');
    
    // Extract unique themes
    const allThemes = uniqueSymbols.flatMap(symbol => symbol?.themes || []);
    const uniqueThemes = Array.from(new Set(allThemes));
    
    setInterpretation({
      text: interpretationText || "Your dream suggests a deepening cosmic awareness.",
      themes: uniqueThemes.length > 0 ? uniqueThemes : ["Cosmic Connection"]
    });
  };

  return (
    <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg hover:shadow-cosmic transition-all hover:border-cosmic-purple/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-sparkling-2-line text-2xl text-cosmic-blue mr-3"></i>
          <h3 className="text-xl font-medium">Dream Interpreter</h3>
        </div>
        
        <textarea 
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          placeholder="Describe your cosmic dream..." 
          className="w-full bg-space-950 border border-space-800 rounded-md p-3 text-space-100 placeholder-space-600 focus:border-cosmic-purple focus:outline-none transition-colors mb-4 resize-none h-24"
        />
        
        <button 
          onClick={interpretDream}
          disabled={!dreamText.trim()}
          className={`w-full ${dreamText.trim() ? 'bg-space-800 hover:bg-space-700' : 'bg-space-800 opacity-50 cursor-not-allowed'} text-space-50 py-2 rounded-md transition-colors flex items-center justify-center mb-4`}
        >
          <i className="ri-moon-line mr-2"></i> Interpret Dream
        </button>
        
        {interpretation && (
          <div className="bg-space-950 rounded-md p-4 border border-space-800">
            <h4 className="text-cosmic-pink mb-2 font-medium">Cosmic Interpretation</h4>
            <p className="text-space-100 text-sm mb-3">
              {interpretation.text}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {interpretation.themes.map((theme, index) => (
                <span 
                  key={index} 
                  className={`text-xs ${
                    index % 3 === 0 ? 'bg-cosmic-blue/20 text-cosmic-blue' : 
                    index % 3 === 1 ? 'bg-cosmic-purple/20 text-cosmic-purple' : 
                    'bg-cosmic-pink/20 text-cosmic-pink'
                  } px-2 py-1 rounded-full`}
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
