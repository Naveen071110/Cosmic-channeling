import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useSubscription } from '@/hooks/use-subscription';

const Tools = () => {
  const [activeTab, setActiveTab] = useState('patterns');
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#059669] bg-clip-text text-transparent">
              Cosmic Tools
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-2xl mx-auto">
            Expand your cosmic consciousness with our specialized spiritual tools for insights and transformation.
          </p>
        </div>
        
        <Tabs defaultValue="patterns" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="patterns">Cosmic Pattern Generator</TabsTrigger>
            <TabsTrigger value="dreams">Dream Interpreter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patterns" className="focus:outline-none">
            <CosmicPatternGenerator />
          </TabsContent>
          
          <TabsContent value="dreams" className="focus:outline-none">
            <DreamInterpreter />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

const CosmicPatternGenerator = () => {
  const [currentPattern, setCurrentPattern] = useState<CosmicPattern | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isSubscribed } = useSubscription();
  const [, setLocation] = useLocation();
  
  const patterns: CosmicPattern[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      question: "What patterns from your past are ready to be transformed into wisdom?",
      affirmation: "I transmute old patterns into cosmic wisdom that guides my journey."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      question: "Which star in your inner constellation needs more attention right now?",
      affirmation: "I nurture the hidden stars within me, allowing them to shine with their natural brightness."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1590907047706-ee9c08cf3189?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      question: "What cosmic message is trying to reach you through synchronicities?",
      affirmation: "I am attuned to the universe's messages, recognizing the patterns that guide me forward."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      question: "Which cosmic cycle are you completing, and what new one is beginning?",
      affirmation: "I honor the natural cycles of endings and beginnings in my spiritual journey."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      question: "What sacred geometry is forming in your current life experiences?",
      affirmation: "I perceive the divine structure underlying all my experiences, trusting in cosmic order."
    }
  ];
  
  const generateRandomPattern = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/cosmic-patterns/random');
      
      if (response.ok) {
        const data = await response.json();
        setCurrentPattern(data);
      } else {
        console.error('Error fetching cosmic pattern');
        // Fallback to local patterns if API fails
        const randomIndex = Math.floor(Math.random() * patterns.length);
        setCurrentPattern(patterns[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching cosmic pattern:', error);
      // Fallback to local patterns if API fails
      const randomIndex = Math.floor(Math.random() * patterns.length);
      setCurrentPattern(patterns[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle redirect to pricing if not subscribed
  const redirectToPricing = () => {
    setLocation('/pricing');
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-[#F1F5F9]">Cosmic Pattern Generator</CardTitle>
          <CardDescription>Receive a unique cosmic pattern with a reflective question and empowering affirmation</CardDescription>
          
          {!isSubscribed && (
            <div className="mt-2 py-2 px-3 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-md text-sm text-[#F1F5F9]">
              <span className="font-medium text-[#7C3AED]">Premium Feature:</span> Subscribe to unlock the Cosmic Pattern Generator
            </div>
          )}
        </CardHeader>
        
        {isSubscribed ? (
          <CardContent>
            {currentPattern ? (
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img src={currentPattern.imageUrl} alt="Cosmic Pattern" className="w-full h-full object-cover" />
                </div>
                
                <div className="p-4 border border-[#334155] rounded-lg bg-[#0F172A]">
                  <h4 className="text-lg font-medium text-[#059669] mb-2">Cosmic Question:</h4>
                  <p className="text-[#F1F5F9] italic">{currentPattern.question}</p>
                </div>
                
                <div className="p-4 border border-[#334155] rounded-lg bg-[#0F172A]">
                  <h4 className="text-lg font-medium text-[#F59E0B] mb-2">Affirmation:</h4>
                  <p className="text-[#F1F5F9]">{currentPattern.affirmation}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#059669]/20 flex items-center justify-center">
                  <i className="ri-seedling-line text-3xl text-[#059669]"></i>
                </div>
                <p className="text-[#94A3B8] mb-6">Press the button below to generate a random cosmic pattern for reflection and insight.</p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button 
                onClick={generateRandomPattern} 
                disabled={isLoading}
                className="bg-gradient-to-r from-[#059669] to-[#0EA5E9] hover:opacity-90 text-white"
              >
                {isLoading ? 'Channeling Cosmic Energy...' : 'Generate Cosmic Pattern'}
              </Button>
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="pb-2">
              <div className="text-center py-8">
                <img 
                  src="https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Premium cosmic content" 
                  className="w-64 h-64 object-cover rounded-full mx-auto mb-6 opacity-50 grayscale"
                />
                <h3 className="text-xl font-medium text-[#F1F5F9] mb-2">Unlock Cosmic Insights</h3>
                <p className="text-[#94A3B8] mb-6 max-w-md mx-auto">
                  Subscribe to Cosmic Channeling Premium to access the Cosmic Pattern Generator and receive unique cosmic guidance tailored for your spiritual journey.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center pb-8">
              <Button 
                onClick={redirectToPricing}
                className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-90 text-white"
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

const DreamInterpreter = () => {
  const [dreamText, setDreamText] = useState('');
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { isSubscribed } = useSubscription();
  const [, setLocation] = useLocation();
  
  type Interpretation = {
    text: string;
    themes: string[];
  };
  
  const interpretations: Interpretation[] = [
    {
      text: "Your dream suggests a connection to higher dimensions. The cosmic symbolism indicates you're receiving guidance from the universe. Pay attention to recurring symbols as they contain messages specifically for you.",
      themes: ["Spiritual Growth", "Divine Guidance", "Higher Consciousness"]
    },
    {
      text: "The elements in your dream reveal a process of inner transformation. You're shedding old patterns and embracing a new phase of your spiritual journey. This is a positive sign of evolution.",
      themes: ["Transformation", "Rebirth", "Shadow Work"]
    },
    {
      text: "Your dream reflects a deep yearning for cosmic connection. The astral imagery suggests your soul is reaching beyond earthly limitations to connect with the broader universe. This indicates an awakening of your cosmic consciousness.",
      themes: ["Cosmic Connection", "Soul Journey", "Awakening"]
    },
    {
      text: "The symbols in your dream point to unresolved emotional patterns that are ready to be healed. By acknowledging these feelings, you open the door to profound healing and spiritual growth.",
      themes: ["Emotional Healing", "Release", "Integration"]
    },
    {
      text: "This dream reveals your intuitive abilities are strengthening. The cosmic scenarios you experienced are actually your higher self communicating important insights about your current life path.",
      themes: ["Intuition", "Psychic Development", "Higher Self"]
    }
  ];
  
  const analyzeDream = async () => {
    if (!dreamText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dreamText }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setInterpretation({
          text: data.interpretation,
          themes: data.tags || []
        });
      } else {
        console.error('Error interpreting dream:', data.message);
        // Fallback to local interpretation if API fails
        const randomIndex = Math.floor(Math.random() * interpretations.length);
        setInterpretation(interpretations[randomIndex]);
      }
    } catch (error) {
      console.error('Dream interpretation error:', error);
      // Fallback to local interpretation if API fails
      const randomIndex = Math.floor(Math.random() * interpretations.length);
      setInterpretation(interpretations[randomIndex]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle redirect to pricing if not subscribed
  const redirectToPricing = () => {
    setLocation('/pricing');
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-[#1E293B] border-[#334155]">
        <CardHeader>
          <CardTitle className="text-[#F1F5F9]">Dream Interpreter</CardTitle>
          <CardDescription>Analyze your dreams through a cosmic lens to unveil their spiritual meaning</CardDescription>
          
          {!isSubscribed && (
            <div className="mt-2 py-2 px-3 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-md text-sm text-[#F1F5F9]">
              <span className="font-medium text-[#7C3AED]">Premium Feature:</span> Subscribe to unlock the Dream Interpreter
            </div>
          )}
        </CardHeader>
        
        {isSubscribed ? (
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="dreamText" className="text-[#F1F5F9]">Describe your dream:</Label>
                <Textarea 
                  id="dreamText"
                  placeholder="Enter the key elements of your dream... (e.g., I was floating among stars and encountered a being of light...)"
                  className="mt-2 bg-[#0F172A] border-[#334155] resize-none min-h-[150px]"
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                />
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={analyzeDream} 
                  disabled={isAnalyzing || !dreamText.trim()}
                  className="bg-gradient-to-r from-[#F59E0B] to-[#EC4899] hover:opacity-90 text-white"
                >
                  {isAnalyzing ? 'Consulting the Cosmic Consciousness...' : 'Interpret Dream'}
                </Button>
              </div>
              
              {interpretation && (
                <div className="mt-6 p-4 border border-[#334155] rounded-lg bg-[#0F172A]">
                  <h4 className="text-lg font-medium text-[#F59E0B] mb-3">Cosmic Interpretation:</h4>
                  <p className="text-[#F1F5F9] mb-4">{interpretation.text}</p>
                  
                  <h5 className="text-md font-medium text-[#EC4899] mb-2">Key Themes:</h5>
                  <div className="flex flex-wrap gap-2">
                    {interpretation.themes.map((theme, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-[#EC4899]/20 text-[#EC4899] text-xs rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        ) : (
          <>
            <CardContent className="pb-2">
              <div className="text-center py-8">
                <img 
                  src="https://images.unsplash.com/photo-1535979014625-490718314e4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                  alt="Premium dream interpretation" 
                  className="w-64 h-64 object-cover rounded-full mx-auto mb-6 opacity-50 grayscale"
                />
                <h3 className="text-xl font-medium text-[#F1F5F9] mb-2">Interpret Your Dreams</h3>
                <p className="text-[#94A3B8] mb-6 max-w-md mx-auto">
                  Subscribe to Cosmic Channeling Premium to unlock the Dream Interpreter and discover the hidden cosmic messages in your dreams.
                </p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center pb-8">
              <Button 
                onClick={redirectToPricing}
                className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:opacity-90 text-white"
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

type CosmicPattern = {
  imageUrl: string;
  question: string;
  affirmation: string;
};

export default Tools;