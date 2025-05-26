import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ExternalLink, User } from 'lucide-react';

interface MediumPost {
  id: string;
  title: string;
  content: string;
  url: string;
  publishedAt: string;
  author: {
    id: string;
    username: string;
    name: string;
    url: string;
  };
  tags: string[];
  readingTime: number;
}

const Blog = () => {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMediumPosts();
  }, []);

  const fetchMediumPosts = async () => {
    try {
      // Check if Medium API token is available
      const apiToken = import.meta.env.VITE_MEDIUM_ACCESS_TOKEN;
      if (!apiToken) {
        console.log('Medium API token not available');
        setError('Medium API access token is required to fetch blog posts. Please provide your Medium API token.');
        setLoading(false);
        return;
      }

      // Fetch user's Medium posts
      const response = await fetch('/api/medium-posts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Medium posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      console.error('Error fetching Medium posts:', err);
      setError('Unable to load blog posts at the moment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
              <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
                Cosmic Blog
              </span>
            </h1>
            <p className="text-[#F1F5F9] max-w-2xl mx-auto">
              Explore insights and wisdom from our cosmic journey through articles and reflections.
            </p>
          </div>
          
          <div className="grid gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-sm border-purple-500/30 animate-pulse">
                <CardHeader>
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
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
              <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
                Cosmic Blog
              </span>
            </h1>
            <p className="text-[#F1F5F9] max-w-2xl mx-auto">
              Explore insights and wisdom from our cosmic journey through articles and reflections.
            </p>
          </div>
          
          <Card className="bg-black/40 backdrop-blur-sm border-red-500/30">
            <CardContent className="text-center py-10">
              <p className="text-red-400 mb-4">{error}</p>
              <Button 
                onClick={fetchMediumPosts}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
              Cosmic Blog
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-2xl mx-auto">
            Explore insights and wisdom from our cosmic journey through articles and reflections.
          </p>
        </div>
        
        {posts.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
            <CardContent className="text-center py-10">
              <p className="text-gray-400">No blog posts available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="bg-black/40 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all group">
                <CardHeader>
                  <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author.name || post.author.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {post.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-purple-900/50 text-purple-200 rounded-full px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    asChild
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <a 
                      href={post.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Read Full Article
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Blog;