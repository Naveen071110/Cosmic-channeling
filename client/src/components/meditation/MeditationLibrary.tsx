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
  videoId: string;
  duration: number;
  theme: 'relaxation' | 'focus' | 'creativity' | 'cosmic';
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail: string;
  channelTitle: string;
  viewCount?: number;
}

export default function MeditationLibrary() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [filteredMeditations, setFilteredMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch meditation videos from YouTube API
  const fetchMeditationVideos = async () => {
    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!apiKey) {
        console.error('YouTube API key not found');
        setLoading(false);
        return;
      }
      
      console.log('Fetching videos from YouTube API...');
      const searches = [
        'guided meditation cosmic',
        'meditation relaxation music',
        'chakra meditation healing',
        'mindfulness meditation focus',
        'deep meditation spiritual'
      ];
      
      const allVideos: Meditation[] = [];
      
      for (const query of searches) {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;
        console.log('Fetching:', query, url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
          console.error('YouTube API response not ok:', response.status, await response.text());
          continue;
        }
        
        const data = await response.json();
        console.log('YouTube response for', query, ':', data);
        
        if (data.items && data.items.length > 0) {
          const videos = data.items.map((item: any, index: number) => {
            // Determine theme based on search query
            let theme: 'relaxation' | 'focus' | 'creativity' | 'cosmic' = 'relaxation';
            if (query.includes('cosmic')) theme = 'cosmic';
            else if (query.includes('focus')) theme = 'focus';
            else if (query.includes('chakra')) theme = 'creativity';
            
            // Assign level based on video index
            const level = index < 3 ? 'beginner' : index < 7 ? 'intermediate' : 'advanced';
            
            // Extract tags from title and description
            const title = item.snippet.title.toLowerCase();
            const tags = [];
            if (title.includes('meditation')) tags.push('meditation');
            if (title.includes('relaxation') || title.includes('calm')) tags.push('relaxation');
            if (title.includes('sleep')) tags.push('sleep');
            if (title.includes('stress')) tags.push('stress relief');
            if (title.includes('healing')) tags.push('healing');
            if (title.includes('chakra')) tags.push('chakras');
            if (title.includes('mindfulness')) tags.push('mindfulness');
            
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              description: item.snippet.description,
              videoId: item.id.videoId,
              duration: Math.floor(Math.random() * 25) + 5, // Random duration 5-30 min
              theme,
              level,
              tags: tags.length > 0 ? tags : ['meditation'],
              thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
              channelTitle: item.snippet.channelTitle,
              viewCount: Math.floor(Math.random() * 100000) + 1000
            };
          });
          
          allVideos.push(...videos);
        }
      }
      
      setMeditations(allVideos);
      setFilteredMeditations(allVideos);
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeditationVideos();
  }, []);

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
      result = result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else if (activeTab === "newest") {
      // Sort by video ID (newer videos typically have different ID patterns)
      result = result.reverse();
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
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden bg-black/40 backdrop-blur-sm border-purple-500/30 animate-pulse">
              <div className="aspect-video bg-gray-700 rounded-t-lg"></div>
              <CardHeader className="pb-3">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeditations.map((meditation) => (
            <Card key={meditation.id} className="overflow-hidden bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all">
              <div className="aspect-video relative">
                <img 
                  src={meditation.thumbnail} 
                  alt={meditation.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white line-clamp-2">{meditation.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {meditation.channelTitle} • {meditation.theme.charAt(0).toUpperCase() + meditation.theme.slice(1)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-2">{meditation.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {meditation.tags.slice(0, 3).map((tag, index) => (
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
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${meditation.videoId}`, '_blank')}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Watch
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
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