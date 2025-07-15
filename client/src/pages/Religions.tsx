import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Star, Globe, Users } from 'lucide-react';
import { Link } from 'wouter';
import type { Tradition } from '@shared/schema';

const Religions = () => {
  const { data: traditions = [], isLoading, error } = useQuery<Tradition[]>({
    queryKey: ['/api/traditions'],
  });

  const { data: featuredTraditions = [] } = useQuery<Tradition[]>({
    queryKey: ['/api/traditions/featured'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Failed to load traditions. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
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

        {/* Featured Traditions */}
        {featuredTraditions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="mr-2 text-yellow-400" />
              Featured Traditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTraditions.map((tradition) => (
                <TraditionCard key={tradition.id} tradition={tradition} featured />
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
          {traditions.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                  <p className="text-slate-300">
                    No traditions available yet. The cosmic library is being prepared with wisdom from around the world.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {traditions.map((tradition) => (
                <TraditionCard key={tradition.id} tradition={tradition} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

interface TraditionCardProps {
  tradition: Tradition;
  featured?: boolean;
}

const TraditionCard = ({ tradition, featured = false }: TraditionCardProps) => {
  return (
    <Card className={`bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 h-full ${
      featured ? 'ring-2 ring-yellow-400' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white text-lg mb-2">{tradition.name}</CardTitle>
            {tradition.origin && (
              <p className="text-slate-400 text-sm mb-2">
                <Globe className="inline w-4 h-4 mr-1" />
                {tradition.origin}
              </p>
            )}
            {tradition.foundedPeriod && (
              <p className="text-slate-400 text-xs">Founded: {tradition.foundedPeriod}</p>
            )}
          </div>
          {featured && <Star className="text-yellow-400 w-5 h-5" />}
        </div>
      </CardHeader>
      <CardContent>
        {tradition.description && (
          <p className="text-slate-300 text-sm mb-4 line-clamp-3">
            {tradition.description}
          </p>
        )}
        
        {tradition.keyFigures && tradition.keyFigures.length > 0 && (
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
            className={`text-xs ${tradition.colorTheme ? 'border-current' : ''}`}
            style={tradition.colorTheme ? { color: tradition.colorTheme, borderColor: tradition.colorTheme } : {}}
          >
            {tradition.status}
          </Badge>
          <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
            <BookOpen className="w-4 h-4 mr-1" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Religions;