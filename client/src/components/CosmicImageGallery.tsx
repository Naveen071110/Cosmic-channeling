import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Eye, Download, Star, ListFilter } from "lucide-react";

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

export default function CosmicImageGallery() {
  const [images, setImages] = useState<CosmicImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<CosmicImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch cosmic images from Pixabay
  const fetchCosmicImages = async () => {
    try {
      const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
      if (!apiKey) {
        console.log('Pixabay API key not available, using sample images for now');
        // Create sample cosmic images while waiting for API
        const sampleImages: CosmicImage[] = [
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
          },
          {
            id: "5",
            title: "Deep Space Wonder",
            description: "The infinite expanse of cosmic space",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
            largeImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200",
            category: "space",
            tags: ["space", "cosmic", "universe", "infinity"],
            photographer: "NASA",
            views: 25000
          },
          {
            id: "6",
            title: "Mars Surface",
            description: "The red planet's fascinating landscape",
            imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400",
            largeImageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200",
            category: "planets",
            tags: ["mars", "planet", "red", "landscape"],
            photographer: "Mars Rover",
            views: 19000
          }
        ];
        setImages(sampleImages);
        setFilteredImages(sampleImages);
        setLoading(false);
        return;
      }
      
      console.log('Fetching cosmic images from Pixabay...');
      const searches = [
        'galaxy space',
        'nebula cosmic', 
        'planet universe',
        'stars astronomy',
        'milky way'
      ];
      
      const allImages: CosmicImage[] = [];
      
      for (const query of searches) {
        const response = await fetch(
          `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&category=science&min_width=800&per_page=10`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.hits && data.hits.length > 0) {
            const cosmicImages = data.hits.map((item: any) => {
              let category: 'galaxies' | 'nebulae' | 'planets' | 'stars' | 'space' = 'space';
              if (query.includes('galaxy')) category = 'galaxies';
              else if (query.includes('nebula')) category = 'nebulae';
              else if (query.includes('planet')) category = 'planets';
              else if (query.includes('stars')) category = 'stars';
              
              return {
                id: item.id.toString(),
                title: item.tags.split(',')[0]?.trim() || 'Cosmic Wonder',
                description: `Beautiful ${category.slice(0, -1)} captured in stunning detail`,
                imageUrl: item.webformatURL,
                largeImageUrl: item.largeImageURL,
                category,
                tags: item.tags.split(',').map((tag: string) => tag.trim()),
                photographer: item.user,
                views: item.views
              };
            });
            
            allImages.push(...cosmicImages);
          }
        }
      }
      
      setImages(allImages);
      setFilteredImages(allImages);
    } catch (error) {
      console.error('Error fetching cosmic images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosmicImages();
  }, []);

  useEffect(() => {
    let result = [...images];
    
    if (selectedCategory !== "all") {
      result = result.filter(item => item.category === selectedCategory);
    }
    
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

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Cosmic Visions Gallery
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore breathtaking images of the cosmos - from distant galaxies to vibrant nebulae, capturing the beauty and wonder of our universe.
        </p>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="galaxies">Galaxies</TabsTrigger>
              <TabsTrigger value="nebulae">Nebulae</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Select onValueChange={handleCategoryChange} defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="galaxies">Galaxies</SelectItem>
                <SelectItem value="nebulae">Nebulae</SelectItem>
                <SelectItem value="planets">Planets</SelectItem>
                <SelectItem value="stars">Stars</SelectItem>
                <SelectItem value="space">Deep Space</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
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
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all group">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={image.imageUrl} 
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => window.open(image.largeImageUrl, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Full
                  </Button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white line-clamp-2">{image.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {image.photographer} • {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </CardDescription>
                  </div>
                  {image.views && (
                    <div className="flex items-center text-yellow-400">
                      <Eye className="w-4 h-4 mr-1" />
                      <span className="text-sm">{image.views.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4 line-clamp-2">{image.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {image.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-purple-900/50 text-purple-200 rounded-full px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {filteredImages.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-gray-400">No cosmic images match your filters. Try adjusting your selection.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSelectedCategory("all");
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