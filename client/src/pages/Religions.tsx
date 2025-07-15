import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Star, Globe, Users, Quote, Sparkles } from 'lucide-react';
import { getAllTraditions, getFeaturedTraditions, getRandomQuote, type SpiritualTradition } from '@/data/religionsData';

const DailyWisdomQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(getRandomQuote());
  
  const refreshQuote = () => {
    setCurrentQuote(getRandomQuote());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <blockquote className="text-lg text-slate-200 mb-4 italic">
        "{currentQuote.text}"
      </blockquote>
      <div className="flex items-center justify-center gap-4">
        <p className="text-purple-300 font-medium">— {currentQuote.author}</p>
        <Badge variant="outline" className="text-purple-300 border-purple-300">
          {currentQuote.tradition}
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshQuote}
          className="text-purple-400 hover:text-purple-300"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

interface TraditionCardProps {
  tradition: SpiritualTradition;
  featured?: boolean;
  onSelect: () => void;
}

const TraditionCard = ({ tradition, featured = false, onSelect }: TraditionCardProps) => {
  return (
    <Card 
      className={`bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 h-full cursor-pointer ${
        featured ? 'ring-2 ring-yellow-400' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{tradition.name}</CardTitle>
            <p className="text-slate-400 text-sm mb-2">
              <Globe className="inline w-4 h-4 mr-1" />
              {tradition.origin}
            </p>
            <p className="text-slate-400 text-xs">Founded: {tradition.foundedPeriod}</p>
          </div>
          {featured && <Star className="text-yellow-400 w-5 h-5" />}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 text-sm mb-4 line-clamp-3">
          {tradition.description}
        </p>
        
        {tradition.keyFigures.length > 0 && (
          <div className="mb-4">
            <h4 className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Key Figures
            </h4>
            <div className="flex flex-wrap gap-1">
              {tradition.keyFigures.slice(0, 3).map((figure, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {figure}
                </Badge>
              ))}
              {tradition.keyFigures.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tradition.keyFigures.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <Badge 
            variant="outline" 
            className="text-xs border-current"
            style={{ color: tradition.colorTheme, borderColor: tradition.colorTheme }}
          >
            {tradition.origin}
          </Badge>
          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
            <BookOpen className="w-4 h-4 mr-1" />
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface TraditionDetailViewProps {
  tradition: SpiritualTradition;
  onBack: () => void;
}

const TraditionDetailView = ({ tradition, onBack }: TraditionDetailViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-purple-400 hover:text-purple-300"
        >
          ← Back to Traditions
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: tradition.colorTheme }}
            >
              {tradition.name}
            </h1>
            <p className="text-slate-300 text-lg mb-2">{tradition.origin}</p>
            <p className="text-slate-400">Founded: {tradition.foundedPeriod}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{tradition.description}</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Modern Relevance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{tradition.modernRelevance}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="mr-2" />
                  Core Beliefs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tradition.coreBeliefs.map((belief, index) => (
                    <li key={index} className="text-slate-300 text-sm">
                      • {belief}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="mr-2" />
                  Key Figures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tradition.keyFigures.map((figure, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {figure}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="mr-2" />
                  Sacred Texts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tradition.sacredTexts.map((text, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {text}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {tradition.quotes.length > 0 && (
            <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Quote className="mr-2" />
                  Wisdom & Quotes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tradition.quotes.map((quote) => (
                    <div key={quote.id} className="p-4 bg-slate-900/50 rounded-lg">
                      <blockquote className="text-slate-200 italic mb-3">
                        "{quote.text}"
                      </blockquote>
                      <p className="text-slate-400 text-sm">— {quote.author}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const Religions = () => {
  const [selectedTradition, setSelectedTradition] = useState<SpiritualTradition | null>(null);
  const traditions = getAllTraditions();
  const featuredTraditions = getFeaturedTraditions();

  if (selectedTradition) {
    return <TraditionDetailView tradition={selectedTradition} onBack={() => setSelectedTradition(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Spiritual Traditions & Wisdom
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Explore the rich tapestry of human spiritual traditions, their teachings, and their relevance in our modern cosmic journey.
          </p>
        </div>

        {/* Daily Wisdom Quote */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <Quote className="mx-auto h-8 w-8 text-purple-400 mb-4" />
                <DailyWisdomQuote />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Featured Traditions */}
        {featuredTraditions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="mr-2 text-yellow-400" />
              Featured Traditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTraditions.map((tradition) => (
                <TraditionCard 
                  key={tradition.id} 
                  tradition={tradition} 
                  featured 
                  onSelect={() => setSelectedTradition(tradition)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Traditions */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Globe className="mr-2 text-blue-400" />
            All Spiritual Traditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traditions.map((tradition) => (
              <TraditionCard 
                key={tradition.id} 
                tradition={tradition} 
                onSelect={() => setSelectedTradition(tradition)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Religions;