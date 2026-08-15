import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import StargazingWidget from '@/components/features/StargazingWidget';
import { 
  Sparkles, 
  Star, 
  Moon, 
  Sun, 
  RefreshCw,
  Calendar,
  LightbulbIcon,
  Compass,
  CheckCircle2,
  AlertCircle
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

const initialSignals: Signal[] = [
  {
    id: '1',
    type: 'synchronicity',
    title: 'Repeated Numbers Alignment (11:11)',
    description: 'You are noticing synchronistic number sequences throughout your daily path.',
    significance: 'The universe is highlighting alignment, open portals of consciousness, and focused manifestation.',
    date: new Date(),
    strength: 5,
  },
  {
    id: '2',
    type: 'celestial',
    title: 'Lunar Illumination & Meditation Window',
    description: 'The current lunar phase is actively amplifying intuitive faculties and dream recall.',
    significance: 'Optimal timing for deep evening meditation, stillness, and connecting with higher awareness.',
    date: new Date(),
    strength: 4,
  },
  {
    id: '3',
    type: 'energy',
    title: 'Crown & Third Eye Energy Activation',
    description: 'Subtle energy sensations at the forehead and crown indicating heightened receptor clarity.',
    significance: 'Your spiritual perception is attuning to cosmic background frequencies.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    strength: 4,
  },
  {
    id: '4',
    type: 'intuition',
    title: 'Strong Intuitive Impulse',
    description: 'A clear internal compass guiding you toward creative and spiritual ventures.',
    significance: 'Trust inner discernment; your consciousness is processing subtle signals faster than analytical thought.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    strength: 4,
  },
];

const celestialEvents: CelestialEvent[] = [
  {
    id: '1',
    name: 'Perseid & Meteor Radiants',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    description: 'Earth traverses debris streams of ancient comets, producing luminous atmospheric streaks across the night sky.',
    significance: 'Symbolizes shedding old baggage and burning through karmic residue with cosmic light.',
    recommendations: [
      'Stargaze between midnight and pre-dawn astronomical twilight',
      'Choose a dark location away from direct city glow',
      'Hold a clear intention for every shooting star observed',
    ],
  },
  {
    id: '2',
    name: 'Planetary Conjunction Window',
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    description: 'Planetary bodies align in visual proximity from Earth’s orbital vantage point.',
    significance: 'Synergistic blending of archetype energies fostering mental clarity and collective cohesion.',
    recommendations: [
      'Meditate during dawn or dusk golden hour',
      'Journal insights on personal equilibrium',
      'Focus intentions on harmonic relationships',
    ],
  },
  {
    id: '3',
    name: 'Solar Equinox & Harmonic Pivot',
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    description: 'Equal day and night across the globe marking pivotal cosmic balance.',
    significance: 'Universal reset point for evaluating personal equilibrium and setting new seasonal anchors.',
    recommendations: [
      'Perform a gratitude ritual for past achievements',
      'Declutter physical and mental spaces',
      'Establish balanced daily grounding practices',
    ],
  },
];

export default function CosmicSignals() {
  const [signals, setSignals] = useState<Signal[]>(initialSignals);
  const [events] = useState<CelestialEvent[]>(celestialEvents);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSignalTab, setActiveSignalTab] = useState<string>('all');

  // Query live solar & lunar cycles
  const { data: solarData } = useQuery({
    queryKey: ['/api/solar-cycles?lat=28.61&lng=77.2'],
    staleTime: 1000 * 60 * 60 * 6,
  });

  // Dynamically update the lunar signal when real solarData arrives
  useEffect(() => {
    if (solarData?.lunar) {
      const lunar = solarData.lunar;
      setSignals((prev) => [
        {
          id: 'lunar-live',
          type: 'celestial',
          title: `${lunar.emoji} ${lunar.phaseName} Active Alignment`,
          description: `Current moon phase is ${lunar.illuminationPercent}% illuminated (Age: ${lunar.ageDays} days).`,
          significance: lunar.theme || 'Heightened spiritual clarity and intuitive receptivity.',
          date: new Date(),
          strength: 5,
        },
        ...prev.filter((s) => s.id !== 'lunar-live' && s.id !== '2'),
      ]);
    }
  }, [solarData]);

  const getFilteredSignals = () => {
    if (activeSignalTab === 'all') return signals;
    return signals.filter((signal) => signal.type === activeSignalTab);
  };

  const refreshSignals = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const synchronicities = [
        {
          title: '333 Frequency Resonance',
          desc: 'Spiritual teachers and cosmic guides are aligning with your current trajectory.',
          sig: 'Validation that your current choices are in harmony with your higher purpose.',
        },
        {
          title: 'Unusual Serendipitous Encounter',
          desc: 'An unexpected connection or message will present a key unlock.',
          sig: 'Open your awareness to chance conversations and unusual synchronicities today.',
        },
        {
          title: 'Solar Plexus Power Alignment',
          desc: 'Warmth and renewed confidence surging through your vital energy center.',
          sig: 'Take courageous action on ideas you have been contemplating.',
        },
      ];

      const chosen = synchronicities[Math.floor(Math.random() * synchronicities.length)];
      const newSignal: Signal = {
        id: Date.now().toString(),
        type: 'synchronicity',
        title: chosen.title,
        description: chosen.desc,
        significance: chosen.sig,
        date: new Date(),
        strength: Math.floor(Math.random() * 2) + 4,
      };

      setSignals((prev) => [newSignal, ...prev]);
      setIsRefreshing(false);
    }, 800);
  };

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'synchronicity':
        return <RefreshCw className="h-4 w-4 text-pink-400" />;
      case 'celestial':
        return <Moon className="h-4 w-4 text-sky-400" />;
      case 'energy':
        return <Sparkles className="h-4 w-4 text-yellow-400" />;
      case 'intuition':
        return <LightbulbIcon className="h-4 w-4 text-purple-400" />;
      default:
        return <Star className="h-4 w-4 text-purple-400" />;
    }
  };

  const getStrengthStars = (strength: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${index < strength ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
        />
      ));
  };

  return (
    <div className="container mx-auto px-4 space-y-8">
      {/* Live Stargazing & Alignment Widget */}
      <StargazingWidget />

      <Tabs defaultValue="signals" className="w-full">
        <TabsList className="grid grid-cols-2 mb-8 bg-[#1E293B] border border-white/10 p-1">
          <TabsTrigger value="signals" className="flex items-center text-sm">
            <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
            Cosmic Signals & Synchronicities
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-sky-400" />
            Upcoming Celestial Alignments
          </TabsTrigger>
        </TabsList>

        {/* Signals Tab */}
        <TabsContent value="signals" className="space-y-4">
          <Card className="bg-[#0F172A]/90 border-[#334155] shadow-lg">
            <CardHeader className="border-b border-white/5 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-space text-white">
                    Your Real-Time Cosmic Signals
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-400">
                    Live synchronicities, energy activations, and lunar phase influences
                  </CardDescription>
                </div>
                <Button
                  onClick={refreshSignals}
                  disabled={isRefreshing}
                  size="sm"
                  className="bg-purple-700 hover:bg-purple-800 text-white"
                >
                  <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Channel New Signal
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 pt-4">
                {['all', 'synchronicity', 'celestial', 'energy', 'intuition'].map((type) => (
                  <Button
                    key={type}
                    variant={activeSignalTab === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveSignalTab(type)}
                    className={`text-xs h-7 capitalize ${
                      activeSignalTab === type
                        ? 'bg-purple-700 text-white'
                        : 'border-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFilteredSignals().map((signal) => (
                  <Card
                    key={signal.id}
                    className="bg-[#1E293B]/70 border-[#334155] hover:border-purple-500/50 transition-all p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-purple-900/30 border border-purple-500/20">
                            {getSignalTypeIcon(signal.type)}
                          </div>
                          <Badge variant="outline" className="text-[11px] capitalize text-purple-300 border-purple-500/30">
                            {signal.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-0.5">{getStrengthStars(signal.strength)}</div>
                      </div>

                      <h4 className="text-base font-semibold font-space text-white mb-2">
                        {signal.title}
                      </h4>
                      <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                        {signal.description}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-purple-950/20 border border-purple-500/10 mt-2">
                      <span className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider block mb-0.5">
                        Cosmic Significance
                      </span>
                      <p className="text-xs text-gray-300 italic">{signal.significance}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Celestial Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="bg-[#0F172A]/90 border-[#334155] hover:border-sky-500/50 transition-all p-6 flex flex-col justify-between shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-sky-950 text-sky-300 border border-sky-500/30 text-xs">
                      Upcoming Alignment
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-space text-white mb-2">{event.name}</h3>
                  <p className="text-xs text-gray-300 mb-4 leading-relaxed">{event.description}</p>

                  <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/20 mb-4">
                    <span className="text-[10px] font-semibold text-sky-300 uppercase tracking-wider block mb-1">
                      Spiritual Impact
                    </span>
                    <p className="text-xs text-gray-300 italic">{event.significance}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-gray-400 block mb-2">
                    Recommended Practices:
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {event.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}