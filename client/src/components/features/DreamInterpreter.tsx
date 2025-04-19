import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface DreamInterpretation {
  interpretation: string;
  tags: string[];
}

const DreamInterpreter = () => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const { toast } = useToast();

  const interpretDream = async () => {
    if (!dreamText.trim()) {
      toast({
        title: "Dream description required",
        description: "Please describe your dream before interpreting.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsInterpreting(true);
      
      // Try to get interpretation from API
      const response = await apiRequest('POST', '/api/interpret-dream', { dreamText });
      const data = await response.json();
      setInterpretation(data);
      
    } catch (error) {
      console.error('Error interpreting dream:', error);
      
      // Fallback interpretation if API fails
      const cosmicWords = ['stars', 'universe', 'space', 'planet', 'galaxy', 'cosmic', 'moon', 'sun', 'light'];
      const dreamLower = dreamText.toLowerCase();
      
      let foundTags: string[] = [];
      if (dreamLower.includes('float') || dreamLower.includes('fly')) {
        foundTags.push('Spiritual Growth');
      }
      if (cosmicWords.some(word => dreamLower.includes(word))) {
        foundTags.push('Cosmic Connection');
      }
      if (dreamLower.includes('vast') || dreamLower.includes('big') || dreamLower.includes('expand')) {
        foundTags.push('Expansion');
      }
      
      if (foundTags.length === 0) {
        foundTags = ['Insight', 'Self-Discovery'];
      }
      
      setInterpretation({
        interpretation: `Your dream suggests a connection to cosmic consciousness. The symbols in your dream point to an awakening of higher awareness and potentially a spiritual journey.`,
        tags: foundTags
      });
      
      toast({
        title: "Using backup interpretation",
        description: "We couldn't connect to our cosmic interpreter. Using local analysis instead.",
      });
    } finally {
      setIsInterpreting(false);
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-sparkling-2-line text-2xl text-[#0EA5E9] mr-3"></i>
          <h3 className="text-xl font-medium">Dream Interpreter</h3>
        </div>
        
        <Textarea 
          placeholder="Describe your cosmic dream..." 
          value={dreamText}
          onChange={(e) => setDreamText(e.target.value)}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-3 text-[#F1F5F9] placeholder-[#64748B] focus:border-[#7E22CE] focus:outline-none transition-colors mb-4 resize-none h-24"
        />
        
        <Button 
          onClick={interpretDream}
          disabled={isInterpreting || !dreamText.trim()}
          className="w-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] py-2 rounded-md transition-colors flex items-center justify-center mb-4"
        >
          {isInterpreting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Interpreting...
            </>
          ) : (
            <>
              <i className="ri-moon-line mr-2"></i> Interpret Dream
            </>
          )}
        </Button>
        
        {interpretation && (
          <div className="bg-[#0F172A] rounded-md p-4 border border-[#334155]">
            <h4 className="text-[#EC4899] mb-2 font-medium">Cosmic Interpretation</h4>
            <p className="text-[#F1F5F9] text-sm mb-3">
              {interpretation.interpretation}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {interpretation.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className={`text-xs ${
                    index % 3 === 0 
                      ? 'bg-[#0EA5E9]/20 text-[#0EA5E9]' 
                      : index % 3 === 1 
                        ? 'bg-[#7E22CE]/20 text-[#7E22CE]' 
                        : 'bg-[#EC4899]/20 text-[#EC4899]'
                  } px-2 py-1 rounded-full`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamInterpreter;
