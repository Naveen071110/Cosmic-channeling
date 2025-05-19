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
import { Badge } from '@/components/ui/badge';
import { Quote, RefreshCw, Share2, BookmarkPlus, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for quotes
interface CosmicQuote {
  id: string;
  text: string;
  author: string;
  source?: string;
  tags: string[];
  isFavorite: boolean;
}

// Sample quotes
const sampleQuotes: CosmicQuote[] = [
  {
    id: '1',
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself.",
    author: "Carl Sagan",
    source: "Cosmos",
    tags: ['wisdom', 'inspiration', 'cosmos'],
    isFavorite: false
  },
  {
    id: '2',
    text: "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
    author: "Stephen Hawking",
    tags: ['curiosity', 'exploration', 'universe'],
    isFavorite: false
  },
  {
    id: '3',
    text: "For small creatures such as we, the vastness is bearable only through love.",
    author: "Carl Sagan",
    source: "Contact",
    tags: ['love', 'perspective', 'cosmos'],
    isFavorite: false
  },
  {
    id: '4',
    text: "The universe is not required to be in perfect harmony with human ambition.",
    author: "Carl Sagan",
    tags: ['humility', 'perspective', 'universe'],
    isFavorite: false
  },
  {
    id: '5',
    text: "We are stardust brought to life, then empowered by the universe to figure itself out—and we have only just begun.",
    author: "Neil deGrasse Tyson",
    tags: ['inspiration', 'cosmic', 'consciousness'],
    isFavorite: false
  },
  {
    id: '6',
    text: "The nitrogen in our DNA, the calcium in our teeth, the iron in our blood, the carbon in our apple pies were made in the interiors of collapsing stars. We are made of starstuff.",
    author: "Carl Sagan",
    source: "Cosmos",
    tags: ['science', 'perspective', 'cosmos'],
    isFavorite: false
  },
  {
    id: '7',
    text: "We are all connected; To each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
    author: "Neil deGrasse Tyson",
    tags: ['connection', 'unity', 'cosmos'],
    isFavorite: false
  },
  {
    id: '8',
    text: "Not only are we in the universe, the universe is in us.",
    author: "Neil deGrasse Tyson",
    tags: ['perspective', 'cosmic', 'consciousness'],
    isFavorite: false
  },
  {
    id: '9',
    text: "We are made of star stuff. We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
    tags: ['consciousness', 'cosmos', 'perspective'],
    isFavorite: false
  },
  {
    id: '10',
    text: "I look up at the night sky, and I know that, yes, we are part of this Universe, we are in this Universe, but perhaps more important than both of those facts is that the Universe is in us.",
    author: "Neil deGrasse Tyson",
    tags: ['perspective', 'consciousness', 'universe'],
    isFavorite: false
  }
];

// Helper function to get a random item from an array
const getRandomItem = <T extends unknown>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export default function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState<CosmicQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteQuotes, setFavoriteQuotes] = useState<CosmicQuote[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const { toast } = useToast();
  
  // Function to fetch a new random quote
  const fetchRandomQuote = () => {
    setIsLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      let quote = getRandomItem(sampleQuotes);
      
      // Check if the quote is in favorites and update its state
      const isFavorite = favoriteQuotes.some(fav => fav.id === quote.id);
      quote = { ...quote, isFavorite };
      
      setCurrentQuote(quote);
      setIsLoading(false);
    }, 800);
  };
  
  // Initial quote fetch on component mount
  useEffect(() => {
    fetchRandomQuote();
    
    // Try to load favorites from localStorage
    const savedFavorites = localStorage.getItem('favoriteCosmicQuotes');
    if (savedFavorites) {
      try {
        setFavoriteQuotes(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse saved favorites:', error);
      }
    }
  }, []);
  
  // Function to toggle favorite status
  const toggleFavorite = () => {
    if (!currentQuote) return;
    
    let updatedFavorites: CosmicQuote[];
    
    if (currentQuote.isFavorite) {
      // Remove from favorites
      updatedFavorites = favoriteQuotes.filter(q => q.id !== currentQuote.id);
      toast({
        title: "Removed from favorites",
        description: "Quote has been removed from your favorites",
        variant: "default",
      });
    } else {
      // Add to favorites
      updatedFavorites = [...favoriteQuotes, { ...currentQuote, isFavorite: true }];
      toast({
        title: "Added to favorites",
        description: "Quote has been saved to your favorites",
        variant: "default",
      });
    }
    
    // Update state and localStorage
    setFavoriteQuotes(updatedFavorites);
    localStorage.setItem('favoriteCosmicQuotes', JSON.stringify(updatedFavorites));
    
    // Update current quote's favorite status
    setCurrentQuote({ ...currentQuote, isFavorite: !currentQuote.isFavorite });
  };
  
  // Function to share the quote
  const shareQuote = () => {
    if (!currentQuote) return;
    
    if (navigator.share) {
      navigator.share({
        title: 'Cosmic Quote',
        text: `"${currentQuote.text}" — ${currentQuote.author}`,
        url: window.location.href,
      })
      .catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
      toast({
        title: "Quote copied to clipboard",
        description: "Share this cosmic wisdom with others",
        variant: "default",
      });
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm border-purple-500/30 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white flex items-center">
              <Quote className="mr-2 h-5 w-5 text-purple-400" />
              {showFavorites ? 'Favorite Quotes' : 'Daily Cosmic Quote'}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
              className="text-purple-300 hover:text-purple-100 hover:bg-purple-900/30"
            >
              {showFavorites ? 'Show Daily' : 'Show Favorites'}
            </Button>
          </div>
          <CardDescription>
            {showFavorites ? 'Your collection of cosmic wisdom' : 'Wisdom from the cosmos to inspire your journey'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFavorites ? (
            favoriteQuotes.length === 0 ? (
              <div className="text-center py-8">
                <Star className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-white">No Favorites Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto mt-2 mb-4">
                  Save your favorite cosmic quotes to revisit their wisdom on your journey.
                </p>
                <Button 
                  onClick={() => setShowFavorites(false)}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  Find Quotes to Save
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {favoriteQuotes.map(quote => (
                  <Card key={quote.id} className="bg-black/30 border-purple-500/20">
                    <CardContent className="p-4">
                      <blockquote className="text-gray-200 italic mb-2">
                        "{quote.text}"
                      </blockquote>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-purple-300">— {quote.author}</p>
                          {quote.source && (
                            <p className="text-gray-400 text-sm">{quote.source}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          // Remove from favorites
                          const updatedFavorites = favoriteQuotes.filter(q => q.id !== quote.id);
                          setFavoriteQuotes(updatedFavorites);
                          localStorage.setItem('favoriteCosmicQuotes', JSON.stringify(updatedFavorites));
                          toast({
                            title: "Removed from favorites",
                            description: "Quote has been removed from your collection",
                            variant: "default",
                          });
                        }} className="text-pink-500 hover:bg-pink-900/20">
                          <BookmarkPlus className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {quote.tags.map((tag, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline"
                            className="bg-purple-900/20 text-purple-300 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="min-h-[200px] flex flex-col justify-center">
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="mx-auto h-8 w-8 text-purple-400 animate-spin" />
                  <p className="text-gray-400 mt-4">Channeling cosmic wisdom...</p>
                </div>
              ) : currentQuote ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Quote className="absolute -left-2 -top-2 h-8 w-8 text-purple-500/30" />
                    <blockquote className="text-gray-100 text-xl font-light leading-relaxed pl-6">
                      {currentQuote.text}
                    </blockquote>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-purple-300 text-lg">— {currentQuote.author}</p>
                      {currentQuote.source && (
                        <p className="text-gray-400">{currentQuote.source}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {currentQuote.tags.map((tag, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline"
                          className="bg-purple-900/20 text-purple-300 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No quote available. Try refreshing.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-purple-500/20 pt-4 flex justify-between">
          {!showFavorites && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRandomQuote}
                disabled={isLoading}
                className="border-purple-500/30 hover:bg-purple-900/30"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                New Quote
              </Button>
              
              {currentQuote && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleFavorite}
                    className={`border-purple-500/30 hover:bg-purple-900/30 ${currentQuote.isFavorite ? 'bg-purple-900/30' : ''}`}
                  >
                    <BookmarkPlus className={`mr-2 h-4 w-4 ${currentQuote.isFavorite ? 'fill-purple-400' : ''}`} />
                    {currentQuote.isFavorite ? 'Saved' : 'Save'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareQuote}
                    className="border-purple-500/30 hover:bg-purple-900/30"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </>
              )}
            </div>
          )}
          {showFavorites && favoriteQuotes.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFavoriteQuotes([]);
                localStorage.removeItem('favoriteCosmicQuotes');
                toast({
                  title: "Favorites cleared",
                  description: "Your collection has been reset",
                  variant: "default",
                });
              }}
              className="border-red-500/30 hover:bg-red-900/30 text-red-400"
            >
              Clear All Favorites
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}