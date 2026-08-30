import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Sparkles, BookOpen, Check, Moon, Save, LogIn } from 'lucide-react';
import { useLocation } from 'wouter';

interface DreamInterpretation {
  interpretation: string;
  tags: string[];
}

const DreamInterpreter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<DreamInterpretation | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
      setIsSaved(false);
      
      // Try to get interpretation from API
      const response = await apiRequest('POST', '/api/interpret-dream', { dreamText });
      const data = (await response.json()) as DreamInterpretation;
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

  const saveDreamToJournal = async () => {
    if (!dreamText.trim() || !interpretation) return;

    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save your dream reflections to your cloud Astro-Journal.",
        variant: "destructive"
      });
      setLocation('/auth');
      return;
    }

    setIsSaving(true);
    try {
      const fullContent = `🌌 Cosmic Dream Reflection:\n${dreamText}\n\n✨ Cosmic Interpretation:\n${interpretation.interpretation}`;
      const tags = Array.from(new Set(["Cosmic Dream", "Dream Interpretation", ...interpretation.tags]));

      await apiRequest('POST', '/api/journal-entries', {
        text: fullContent,
        tags,
      });

      // Also persist to local backup
      try {
        const localKey = `cosmic_journal_${user.id}`;
        const existingRaw = localStorage.getItem(localKey);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        const newEntry = {
          id: String(Date.now()),
          date: new Date(),
          content: fullContent,
          tags,
          sentiment: 0.7,
          wordCount: fullContent.split(/\s+/).filter(Boolean).length,
          themes: ["Cosmic Dream", "Spiritual Insight"],
        };
        localStorage.setItem(localKey, JSON.stringify([newEntry, ...existing]));
      } catch {
        // ignore
      }

      setIsSaved(true);
      toast({
        title: "Dream Saved to Astro-Journal",
        description: "Your dream has been synchronized across all your devices.",
      });
    } catch (e) {
      console.error('Failed to save dream to journal:', e);
      toast({
        title: "Failed to Save",
        description: "Could not record dream to the cloud journal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sparkles className="w-5 h-5 text-[#0EA5E9] mr-2.5" />
            <h3 className="text-xl font-medium font-space text-white">Dream Interpreter</h3>
          </div>
          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
            AI + Hermetic Analysis
          </span>
        </div>
        
        <Textarea 
          placeholder="Describe your cosmic dream, symbols, or nighttime celestial visions..." 
          value={dreamText}
          onChange={(e) => {
            setDreamText(e.target.value);
            setIsSaved(false);
          }}
          className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-3 text-[#F1F5F9] placeholder-[#64748B] focus:border-[#7E22CE] focus:outline-none transition-colors mb-4 resize-none h-24 text-sm"
        />
        
        <Button 
          onClick={interpretDream}
          disabled={isInterpreting || !dreamText.trim()}
          className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-[#F8FAFC] py-2 rounded-md transition-colors flex items-center justify-center mb-4 text-xs sm:text-sm font-medium shadow-md"
        >
          {isInterpreting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Decoding Cosmic Symbols...
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 mr-2" /> Interpret Dream
            </>
          )}
        </Button>
        
        {interpretation && (
          <div className="bg-[#0F172A] rounded-md p-4 border border-[#334155] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[#EC4899] font-medium text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Cosmic Interpretation
              </h4>
            </div>
            
            <p className="text-[#F1F5F9] text-xs sm:text-sm leading-relaxed">
              {interpretation.interpretation}
            </p>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {interpretation.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className={`text-[11px] ${
                    index % 3 === 0 
                      ? 'bg-[#0EA5E9]/20 text-[#0EA5E9] border border-[#0EA5E9]/30' 
                      : index % 3 === 1 
                        ? 'bg-[#7E22CE]/20 text-[#7E22CE] border border-[#7E22CE]/30' 
                        : 'bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/30'
                  } px-2 py-0.5 rounded-full font-mono`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Cloud Save Action to Astro-Journal */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
              <Button
                size="sm"
                onClick={saveDreamToJournal}
                disabled={isSaving || isSaved}
                className={`text-xs h-8 px-3 ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white hover:opacity-90'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Saved to Astro-Journal
                  </>
                ) : isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white mr-1.5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    Save Dream to Astro-Journal
                  </>
                )}
              </Button>

              {isSaved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/journal')}
                  className="text-xs text-purple-300 hover:text-white h-8 px-2"
                >
                  View in Journal →
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamInterpreter;
