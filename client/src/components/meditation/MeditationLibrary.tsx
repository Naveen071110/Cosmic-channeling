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

// Cosmic image data types
interface CosmicImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  largeImageUrl: string;
  category: 'galaxies' | 'nebulae' | 'planets' | 'stars' | 'space';
  tags: string[];
  photographer: string;
  views?: number;
}

export default function CosmicGallery() {
  const [images, setImages] = useState<CosmicImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CosmicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Load static cosmic images for meditation backgrounds
  const loadCosmicImages = () => {
    const staticImages: CosmicImage[] = [
      {
        id: "1",
        title: "Spiral Galaxy",
        description: "A beautiful spiral galaxy captured in deep space",
        imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
        largeImageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200",
        category: "galaxies",
        tags: ["galaxy", "spiral", "space", "stars"],
        photographer: "NASA",
        views: 15000
      },
      {
        id: "2", 
        title: "Colorful Nebula",
        description: "A vibrant nebula showcasing cosmic colors",
        imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400",
        largeImageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200",
        category: "nebulae",
        tags: ["nebula", "colors", "cosmic", "space"],
        photographer: "Hubble",
        views: 22000
      },
      {
        id: "3",
        title: "Earth from Space",
        description: "Our beautiful blue planet as seen from orbit",
        imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400", 
        largeImageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1200",
        category: "planets",
        tags: ["earth", "planet", "blue", "atmosphere"],
        photographer: "ISS",
        views: 18500
      },
      {
        id: "4",
        title: "Starry Night Sky",
        description: "Countless stars illuminating the cosmic darkness",
        imageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=400",
        largeImageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1200",
        category: "stars",
        tags: ["stars", "night", "sky", "astronomy"],
        photographer: "ESO",
        views: 12000
      }
    ];
    
    setImages(staticImages);
    setFilteredImages(staticImages);
    setLoading(false);
  };

  useEffect(() => {
    loadCosmicImages();
  }, []);

  // Filter images when filters change
  useEffect(() => {
    let result = [...images];
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Special tabs
    if (activeTab === "popular") {
      result = result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (activeTab === "newest") {
      result = result.reverse();
    } else if (activeTab === "galaxies") {
      result = result.filter(item => item.category === "galaxies");
    } else if (activeTab === "nebulae") {
      result = result.filter(item => item.category === "nebulae");
    }
    
    setFilteredImages(result);
  }, [selectedCategory, activeTab, images]);

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
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