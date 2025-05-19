import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Stars, 
  Sparkles, 
  Star, 
  Moon, 
  Sun, 
  RefreshCw,
  Calendar,
  LightbulbIcon,
  MapPin
} from 'lucide-react';

// Types for cosmic signals
type Signal = {
  id: string;
  type: 'synchronicity' | 'celestial' | 'energy' | 'intuition';
  title: string;
  description: string;
  significance: string;
  date: Date;
  strength: number; // 1-5
};

type CelestialEvent = {
  id: string;
  name: string;
  date: Date;
  description: string;
  significance: string;
  recommendations: string[];
};

// Sample cosmic signals
const sampleSignals: Signal[] = [
  {
    id: '1',
    type: 'synchronicity',
    title: 'Repeated Numbers',
    description: 'You\'ve been seeing the number sequence 1111 repeatedly throughout the day.',
    significance: 'The universe is highlighting alignment and opportunities opening up in your path.',
    date: new Date(),
    strength: 4
  },
  {
    id: '2',
    type: 'celestial',
    title: 'Full Moon Influence',
    description: 'The upcoming full moon in Pisces is amplifying your intuitive abilities.',
    significance: 'This is an ideal time for meditation, dream work, and connecting with your higher self.',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days in future
    strength: 5
  },
  {
    id: '3',
    type: 'energy',
    title: 'Crown Chakra Activation',
    description: 'You may notice tingling or pressure at the top of your head, indicating crown chakra activity.',
    significance: 'Your spiritual connection is strengthening, allowing for greater cosmic awareness and insight.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    strength: 3
  },
  {
    id: '4',
    type: 'intuition',
    title: 'Gut Feeling',
    description: 'You\'ve been experiencing strong gut feelings about an upcoming decision.',
    significance: 'Your higher self is communicating through intuition to guide you toward the optimal path.',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    strength: 4
  }
];

// Sample celestial events
const celestialEvents: CelestialEvent[] = [
  {
    id: '1',
    name: 'Mercury Retrograde',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days in future
    description: 'Mercury appears to move backward in its orbit, affecting communication and technology.',
    significance: 'A period for reflection, revision, and reassessment rather than starting new projects.',
    recommendations: [
      'Back up important data',
      'Double-check communications before sending',
      'Be patient with travel plans and technology',
      'Use this time for reviewing and refining existing projects'
    ]
  },
  {
    id: '2',
    name: 'Pleiades Alignment',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days in future
    description: 'The sun aligns with the Pleiades star cluster, creating a powerful cosmic portal.',
    significance: 'An opportunity for spiritual growth, enhanced intuition, and connection with higher consciousness.',
    recommendations: [
      'Meditate during dawn or dusk',
      'Work with crystals, especially clear quartz',
      'Journal any insights or messages received',
      'Perform rituals or ceremonies to honor ancestral wisdom'
    ]
  },
  {
    id: '3',
    name: 'New Moon in Leo',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in future
    description: 'A new lunar cycle begins in the sign of Leo, emphasizing creativity and self-expression.',
    significance: 'Perfect timing for setting intentions related to confidence, leadership, and creative projects.',
    recommendations: [
      'Create a vision board for your aspirations',
      'Start a new creative project',
      'Practice heart-opening meditations',
      'Set clear intentions for the lunar cycle ahead'
    ]
  }
];

export default function CosmicSignals() {
  const [signals, setSignals] = useState<Signal[]>(sampleSignals);
  const [events, setEvents] = useState<CelestialEvent[]>(celestialEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSignalTab, setActiveSignalTab] = useState<string>('all');
  
  // Function to filter signals by type
  const getFilteredSignals = () => {
    if (activeSignalTab === 'all') return signals;
    return signals.filter(signal => signal.type === activeSignalTab);
  };
  
  // Function to simulate refreshing signals
  const refreshSignals = () => {
    setIsRefreshing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Generate a new "synchronicity" signal
      const newSignal: Signal = {
        id: Date.now().toString(),
        type: 'synchronicity',
        title: 'Meaningful Coincidence',
        description: 'You encountered the same symbol three times in different contexts today.',
        significance: 'This repetition suggests you should pay attention to the meaning of this symbol in your life.',
        date: new Date(),
        strength: Math.floor(Math.random() * 3) + 3 // Random strength between 3-5
      };
      
      setSignals([newSignal, ...signals]);
      setIsRefreshing(false);
    }, 1500);
  };
  
  // Function to format date relative to today
  const formatRelativeDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.getTime() === today.getTime()) return 'Today';
    if (date.getTime() === tomorrow.getTime()) return 'Tomorrow';
    if (date.getTime() === yesterday.getTime()) return 'Yesterday';
    
    // Check if it's within a week
    const diffTime = Math.abs(date.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      if (date > today) return `In ${diffDays} days`;
      return `${diffDays} days ago`;
    }
    
    // Otherwise return the date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Function to get signal type icon
  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'synchronicity':
        return <RefreshCw className="h-4 w-4" />;
      case 'celestial':
        return <Moon className="h-4 w-4" />;
      case 'energy':
        return <Sparkles className="h-4 w-4" />;
      case 'intuition':
        return <LightbulbIcon className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };
  
  // Function to get strength stars
  const getStrengthStars = (strength: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        className={`h-3 w-3 ${index < strength ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };
  
  return (
    <div className="container mx-auto px-4">
      <Tabs defaultValue="signals" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="signals" className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            Cosmic Signals
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Celestial Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signals" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl text-white">Your Cosmic Signals</CardTitle>
                  <CardDescription>
                    Messages and signs from the universe aligned with your cosmic journey
                  </CardDescription>
                </div>
                <Button 
                  onClick={refreshSignals} 
                  disabled={isRefreshing}
                  size="sm"
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  {isRefreshing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Signals
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                <Badge 
                  variant="outline"
                  className={`cursor-pointer ${activeSignalTab === 'all' 
                    ? 'bg-purple-900/50 text-purple-300 border-purple-500/50' 
                    : 'bg-black/40 hover:bg-gray-900 text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveSignalTab('all')}
                >
                  All Signals
                </Badge>
                <Badge 
                  variant="outline"
                  className={`cursor-pointer ${activeSignalTab === 'synchronicity' 
                    ? 'bg-purple-900/50 text-purple-300 border-purple-500/50' 
                    : 'bg-black/40 hover:bg-gray-900 text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveSignalTab('synchronicity')}
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Synchronicities
                </Badge>
                <Badge 
                  variant="outline"
                  className={`cursor-pointer ${activeSignalTab === 'celestial' 
                    ? 'bg-purple-900/50 text-purple-300 border-purple-500/50' 
                    : 'bg-black/40 hover:bg-gray-900 text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveSignalTab('celestial')}
                >
                  <Moon className="mr-1 h-3 w-3" />
                  Celestial
                </Badge>
                <Badge 
                  variant="outline"
                  className={`cursor-pointer ${activeSignalTab === 'energy' 
                    ? 'bg-purple-900/50 text-purple-300 border-purple-500/50' 
                    : 'bg-black/40 hover:bg-gray-900 text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveSignalTab('energy')}
                >
                  <Sparkles className="mr-1 h-3 w-3" />
                  Energy
                </Badge>
                <Badge 
                  variant="outline"
                  className={`cursor-pointer ${activeSignalTab === 'intuition' 
                    ? 'bg-purple-900/50 text-purple-300 border-purple-500/50' 
                    : 'bg-black/40 hover:bg-gray-900 text-gray-400 hover:text-gray-300'}`}
                  onClick={() => setActiveSignalTab('intuition')}
                >
                  <LightbulbIcon className="mr-1 h-3 w-3" />
                  Intuition
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {getFilteredSignals().length === 0 ? (
                <div className="text-center py-10">
                  <Stars className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white">No Signals Detected</h3>
                  <p className="text-gray-400 max-w-md mx-auto mt-2">
                    The cosmos is quiet right now. Check back later or try refreshing to receive new signals aligned with your journey.
                  </p>
                </div>
              ) : (
                getFilteredSignals().map(signal => (
                  <Card key={signal.id} className="bg-black/40 border-purple-500/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-3 
                            ${signal.type === 'synchronicity' ? 'bg-green-900/20 text-green-400' : ''}
                            ${signal.type === 'celestial' ? 'bg-blue-900/20 text-blue-400' : ''}
                            ${signal.type === 'energy' ? 'bg-purple-900/20 text-purple-400' : ''}
                            ${signal.type === 'intuition' ? 'bg-yellow-900/20 text-yellow-400' : ''}
                          `}>
                            {getSignalTypeIcon(signal.type)}
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{signal.title}</h3>
                            <div className="flex items-center text-xs text-gray-400">
                              <span className="capitalize">{signal.type}</span>
                              <span className="mx-2">•</span>
                              <span>{formatRelativeDate(signal.date)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          {getStrengthStars(signal.strength)}
                        </div>
                      </div>
                      <p className="mt-3 text-gray-300">{signal.description}</p>
                      <div className="mt-3 p-3 rounded bg-purple-900/10 border border-purple-500/10">
                        <h4 className="text-sm font-medium text-purple-300 mb-1">Cosmic Significance:</h4>
                        <p className="text-gray-300 text-sm">{signal.significance}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4">
              <p className="text-sm text-gray-400">
                Cosmic signals are personalized insights based on cosmic patterns, synchronicities, and energetic shifts aligned with your unique journey.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-xl text-white">Upcoming Celestial Events</CardTitle>
              <CardDescription>
                Astronomical and energetic events that can influence your cosmic experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {events.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <h3 className="text-lg font-medium text-white">No Upcoming Events</h3>
                  <p className="text-gray-400 max-w-md mx-auto mt-2">
                    There are no significant celestial events in the near future. Check back later for updates.
                  </p>
                </div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="border border-purple-500/20 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white text-lg">{event.name}</h3>
                        <Badge variant="outline" className="bg-blue-900/40 text-blue-300 border-blue-500/30">
                          {event.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </Badge>
                      </div>
                      <p className="mt-2 text-gray-300">{event.description}</p>
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Cosmic Significance:</h4>
                      <p className="text-gray-300 mb-4">{event.significance}</p>
                      
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Recommendations:</h4>
                      <ul className="space-y-2">
                        {event.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="bg-purple-900/30 rounded-full p-1 mt-0.5">
                              <Star className="h-3 w-3 text-purple-400" />
                            </span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className="border-t border-gray-800 pt-4">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span>Events are calculated based on your current location and universal cosmic patterns.</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}