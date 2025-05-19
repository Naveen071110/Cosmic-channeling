import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Clock, Star, ListFilter } from "lucide-react";

// Meditation data types
interface Meditation {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  theme: 'relaxation' | 'focus' | 'creativity' | 'cosmic';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  visualizationUrl?: string;
  rating: number;
  plays: number;
}

// Sample meditation data
const sampleMeditations: Meditation[] = [
  {
    id: "1",
    title: "Cosmic Breath Journey",
    description: "Connect with the rhythm of the universe through guided breathing techniques.",
    audioUrl: "/audio/cosmic-breath.mp3",
    duration: 10,
    theme: "cosmic",
    level: "beginner",
    tags: ["breathing", "relaxation", "cosmic"],
    visualizationUrl: "/visuals/cosmic-breath.mp4",
    rating: 4.8,
    plays: 1245
  },
  {
    id: "2",
    title: "Solar Plexus Activation",
    description: "Energize your core and connect with solar energy through this guided session.",
    audioUrl: "/audio/solar-activation.mp3",
    duration: 15,
    theme: "focus",
    level: "intermediate",
    tags: ["energy", "focus", "solar"],
    rating: 4.6,
    plays: 980
  },
  {
    id: "3",
    title: "Lunar Tranquility",
    description: "Embrace the calm energy of the moon and release tensions of the day.",
    audioUrl: "/audio/lunar-tranquility.mp3",
    duration: 20,
    theme: "relaxation",
    level: "beginner",
    tags: ["relaxation", "lunar", "sleep"],
    visualizationUrl: "/visuals/lunar-tranquility.mp4",
    rating: 4.9,
    plays: 2150
  },
  {
    id: "4",
    title: "Nebula Creativity Flow",
    description: "Unlock creative potential by connecting with the expansive energy of nebulae.",
    audioUrl: "/audio/nebula-creativity.mp3",
    duration: 18,
    theme: "creativity",
    level: "advanced",
    tags: ["creativity", "inspiration", "nebula"],
    rating: 4.7,
    plays: 1560
  },
  {
    id: "5",
    title: "Planetary Alignment",
    description: "Align your chakras with the power of planetary energies in our solar system.",
    audioUrl: "/audio/planetary-alignment.mp3",
    duration: 25,
    theme: "cosmic",
    level: "intermediate",
    tags: ["alignment", "planets", "chakras"],
    visualizationUrl: "/visuals/planets-align.mp4",
    rating: 4.5,
    plays: 820
  },
  {
    id: "6",
    title: "Starlight Rejuvenation",
    description: "Rejuvenate your energy with the healing light of distant stars.",
    audioUrl: "/audio/starlight-healing.mp3",
    duration: 12,
    theme: "relaxation",
    level: "beginner",
    tags: ["healing", "stars", "relaxation"],
    rating: 4.6,
    plays: 1050
  }
];

export default function MeditationLibrary() {
  const [meditations, setMeditations] = useState<Meditation[]>(sampleMeditations);
  const [filteredMeditations, setFilteredMeditations] = useState<Meditation[]>(sampleMeditations);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Filter meditations when filters change
  useEffect(() => {
    let result = [...meditations];
    
    // Filter by theme
    if (selectedTheme !== "all") {
      result = result.filter(item => item.theme === selectedTheme);
    }
    
    // Filter by duration
    if (selectedDuration !== "all") {
      if (selectedDuration === "short") {
        result = result.filter(item => item.duration <= 10);
      } else if (selectedDuration === "medium") {
        result = result.filter(item => item.duration > 10 && item.duration <= 20);
      } else if (selectedDuration === "long") {
        result = result.filter(item => item.duration > 20);
      }
    }
    
    // Filter by level
    if (selectedLevel !== "all") {
      result = result.filter(item => item.level === selectedLevel);
    }
    
    // Special tabs
    if (activeTab === "popular") {
      result = result.sort((a, b) => b.plays - a.plays);
    } else if (activeTab === "newest") {
      // In a real app, we would sort by date
      result = result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    } else if (activeTab === "cosmic") {
      result = result.filter(item => item.theme === "cosmic");
    }
    
    setFilteredMeditations(result);
  }, [selectedTheme, selectedDuration, selectedLevel, activeTab, meditations]);

  // Handle theme selection
  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
  };

  // Handle duration selection
  const handleDurationChange = (value: string) => {
    setSelectedDuration(value);
  };

  // Handle level selection
  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  // Format duration display
  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Cosmic Meditation Library
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore our collection of guided meditations to connect with cosmic energies and enhance your spiritual journey.
        </p>
      </div>
      
      {/* Tabs and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="newest">Newest</TabsTrigger>
              <TabsTrigger value="cosmic">Cosmic</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="flex items-center">
              <Select onValueChange={handleThemeChange} defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Themes</SelectItem>
                  <SelectItem value="relaxation">Relaxation</SelectItem>
                  <SelectItem value="focus">Focus</SelectItem>
                  <SelectItem value="creativity">Creativity</SelectItem>
                  <SelectItem value="cosmic">Cosmic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <Select onValueChange={handleDurationChange} defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Durations</SelectItem>
                  <SelectItem value="short">Short (&lt;=10 min)</SelectItem>
                  <SelectItem value="medium">Medium (11-20 min)</SelectItem>
                  <SelectItem value="long">Long (&gt;20 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <Select onValueChange={handleLevelChange} defaultValue="all">
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Meditation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeditations.map((meditation) => (
          <Card key={meditation.id} className="overflow-hidden bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-white">{meditation.title}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {meditation.theme.charAt(0).toUpperCase() + meditation.theme.slice(1)} • {meditation.level.charAt(0).toUpperCase() + meditation.level.slice(1)}
                  </CardDescription>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm">{meditation.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">{meditation.description}</p>
              <div className="flex space-x-2">
                {meditation.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-purple-900/50 text-purple-200 rounded-full px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">{formatDuration(meditation.duration)}</span>
              </div>
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-4 h-4 mr-1" />
                Play
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredMeditations.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-400">No meditations match your filters. Try adjusting your selection.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSelectedTheme("all");
              setSelectedDuration("all");
              setSelectedLevel("all");
              setActiveTab("all");
            }}
          >
            <ListFilter className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}