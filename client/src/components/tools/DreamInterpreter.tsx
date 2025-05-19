import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Moon, Stars, Sparkles, History, Bookmark, Calendar, Lock } from 'lucide-react';
import LoginDialog from '@/components/ui/LoginDialog';

// Types for dream interpretation data
type Interpretation = {
  text: string;
  themes: string[];
  cosmicSignificance: string;
  advice: string;
};

type DreamRecord = {
  id: string;
  date: Date;
  dream: string;
  interpretation?: Interpretation;
};

// Sample data for dream symbols and their meanings
const dreamSymbols = [
  { symbol: 'Moon', meaning: 'Intuition, hidden emotions, subconscious desires', cosmic: 'Connected to lunar cycles and feminine energy' },
  { symbol: 'Stars', meaning: 'Aspirations, spiritual guidance, destiny', cosmic: 'Represents your connection to the universe and infinite possibilities' },
  { symbol: 'Water', meaning: 'Emotions, the unconscious mind, purification', cosmic: 'Element associated with intuition and emotional healing' },
  { symbol: 'Flying', meaning: 'Freedom, transcending limitations, spiritual elevation', cosmic: 'Ascending to higher planes of consciousness' },
  { symbol: 'Falling', meaning: 'Loss of control, insecurity, letting go', cosmic: 'Surrendering to cosmic forces beyond your control' },
  { symbol: 'Animals', meaning: 'Instincts, aspects of self, natural forces', cosmic: 'Spirit guides or totems offering wisdom' },
  { symbol: 'Trees', meaning: 'Growth, strength, connection to nature', cosmic: 'Represents the world tree connecting realms of existence' },
  { symbol: 'Doors/Gates', meaning: 'Opportunities, transitions, choices', cosmic: 'Portals between different dimensions or states of being' },
  { symbol: 'Light', meaning: 'Awareness, truth, spiritual awakening', cosmic: 'Divine cosmic energy and enlightenment' },
  { symbol: 'Darkness', meaning: 'Unknown, fear, potential for growth', cosmic: 'The void of creation, where all possibilities exist' },
];

// Dream records will be loaded from the server when the user is logged in
const emptyDreamRecords: DreamRecord[] = [];

export default function DreamInterpreter() {
  const { user } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [loginDialogContext, setLoginDialogContext] = useState('history');
  
  const [dreamText, setDreamText] = useState('');
  const [currentInterpretation, setCurrentInterpretation] = useState<Interpretation | null>(null);
  const [dreamRecords, setDreamRecords] = useState<DreamRecord[]>(emptyDreamRecords);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [activeTab, setActiveTab] = useState('interpret');
  
  // Function to interpret dreams (in a real app, this would connect to an API)
  const interpretDream = () => {
    if (!dreamText.trim()) return;
    
    setIsInterpreting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Analyze the dream text for keywords
      const lowerDream = dreamText.toLowerCase();
      const matchedSymbols = dreamSymbols.filter(symbol => 
        lowerDream.includes(symbol.symbol.toLowerCase())
      );
      
      // Generate potential themes based on matched symbols
      const potentialThemes = ['Self-discovery', 'Transformation', 'Healing', 'Guidance', 'Balance'];
      const selectedThemes = potentialThemes
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      // Create interpretation text based on matched symbols
      let interpretationText = 'Your dream suggests a journey of ';
      
      if (matchedSymbols.length > 0) {
        // Include specific symbol interpretations
        interpretationText += matchedSymbols.map(symbol => 
          `${symbol.meaning.toLowerCase()} (${symbol.symbol.toLowerCase()})`
        ).join(', and ') + '. ';
        
        interpretationText += 'Cosmically, this points to ' + 
          matchedSymbols.map(symbol => symbol.cosmic.toLowerCase()).join(' while also ') + '.';
      } else {
        // Generic interpretation if no symbols match
        interpretationText += 'self-discovery and connection with cosmic energies. ' +
          'The elements in your dream reflect aspects of your inner consciousness seeking expression.';
      }
      
      // Create full interpretation
      const interpretation: Interpretation = {
        text: interpretationText,
        themes: selectedThemes,
        cosmicSignificance: 'This dream coincides with the current planetary alignment between Jupiter and Neptune, enhancing intuitive insights and spiritual awareness.',
        advice: 'Reflect on the symbols in this dream during meditation. Consider journaling about the emotions you felt and any insights that arise.'
      };
      
      // If user is logged in, save the dream record
      if (user) {
        // Save the dream and interpretation
        const newDreamRecord: DreamRecord = {
          id: Date.now().toString(),
          date: new Date(),
          dream: dreamText,
          interpretation
        };
        
        setDreamRecords([newDreamRecord, ...dreamRecords]);
      } else {
        // Show login dialog to save the interpretation
        setLoginDialogContext('save');
        setShowLoginDialog(true);
      }
      
      // Show the interpretation to the user regardless of login status
      setCurrentInterpretation(interpretation);
      setIsInterpreting(false);
    }, 2000); // Simulate 2-second processing time
  };
  
  // Function to clear the current interpretation
  const newInterpretation = () => {
    setDreamText('');
    setCurrentInterpretation(null);
  };
  
  // Function to load a past dream for viewing
  const viewDreamRecord = (record: DreamRecord) => {
    // If user is not logged in, show login dialog
    if (!user) {
      setLoginDialogContext('view');
      setShowLoginDialog(true);
      return;
    }
    
    setDreamText(record.dream);
    setCurrentInterpretation(record.interpretation || null);
    setActiveTab('interpret');
  };
  
  // Function to handle login dialog close
  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false);
  };
  
  return (
    <div className="container mx-auto px-4">
      {/* Login Dialog */}
      <LoginDialog 
        isOpen={showLoginDialog} 
        onClose={handleCloseLoginDialog}
        title={loginDialogContext === 'view' 
          ? "Sign in to view your dream history" 
          : loginDialogContext === 'save' 
            ? "Sign in to save your interpretation" 
            : "Sign in to access"
        }
        description={loginDialogContext === 'view' 
          ? "Create an account or sign in to access your personal dream interpretations" 
          : loginDialogContext === 'save' 
            ? "Sign in to save this dream interpretation to your personal history" 
            : "Please sign in to continue"
        }
      />
      
      <Tabs defaultValue="interpret" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="interpret" className="flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            Interpret Dream
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <History className="mr-2 h-4 w-4" />
            Dream History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="interpret" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center">
                <Moon className="mr-2 h-5 w-5 text-purple-400" />
                Dream Interpreter
              </CardTitle>
              <CardDescription>
                Share your dream for cosmic interpretation and insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!currentInterpretation ? (
                <>
                  <Textarea
                    placeholder="Describe your dream in detail... What did you see, feel, and experience?"
                    className="min-h-[200px] bg-black/20 border-gray-700 focus:border-purple-500 text-gray-100"
                    value={dreamText}
                    onChange={(e) => setDreamText(e.target.value)}
                  />
                  <Button 
                    onClick={interpretDream} 
                    disabled={!dreamText.trim() || isInterpreting}
                    className="w-full bg-purple-700 hover:bg-purple-800"
                  >
                    {isInterpreting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Interpreting Dream...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Interpret Dream
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                      <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
                      Dream Insight
                    </h3>
                    <p className="text-gray-300">{currentInterpretation.text}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium text-white mb-2">Themes</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentInterpretation.themes.map((theme, index) => (
                        <Badge 
                          key={index}
                          variant="outline"
                          className="bg-purple-900/20 hover:bg-purple-900/30 text-purple-300"
                        >
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-md font-medium text-white mb-2 flex items-center">
                      <Stars className="mr-2 h-4 w-4 text-blue-400" />
                      Cosmic Significance
                    </h3>
                    <p className="text-gray-300">{currentInterpretation.cosmicSignificance}</p>
                  </div>
                  
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h3 className="text-md font-medium text-white mb-2">Spiritual Advice</h3>
                    <p className="text-gray-300">{currentInterpretation.advice}</p>
                  </div>
                  
                  <Button 
                    onClick={newInterpretation}
                    className="w-full bg-purple-700 hover:bg-purple-800"
                  >
                    Interpret Another Dream
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start border-t border-gray-800 pt-4">
              <h3 className="text-sm font-medium text-white mb-2">Common Dream Symbols</h3>
              <div className="flex flex-wrap gap-2">
                {dreamSymbols.slice(0, 5).map((symbol, index) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="bg-gray-900/40 hover:bg-gray-900/60 text-gray-300 cursor-default"
                    title={`${symbol.symbol}: ${symbol.meaning}`}
                  >
                    {symbol.symbol}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {dreamRecords.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30 p-8 text-center">
                <div className="mb-4">
                  <Moon className="mx-auto h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">No Dream Records Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start interpreting your dreams to build your personal dream journal with cosmic insights.
                </p>
                <Button 
                  onClick={() => setActiveTab('interpret')}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Interpret Your First Dream
                </Button>
              </Card>
            ) : (
              dreamRecords.map((record) => (
                <Card 
                  key={record.id}
                  className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => viewDreamRecord(record)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-400">
                          {record.date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Bookmark className="h-4 w-4 text-purple-400" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-300 line-clamp-2 mb-3">{record.dream}</p>
                    
                    {record.interpretation && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {record.interpretation.themes.map((theme, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            className="bg-purple-900/20 text-purple-300 text-xs"
                          >
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}