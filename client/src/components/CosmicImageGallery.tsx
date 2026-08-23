import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Eye,
  Download,
  Share2,
  Sparkles,
  Maximize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Wind,
  Telescope,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CosmicImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  largeImageUrl: string;
  category: 'galaxies' | 'nebulae' | 'planets' | 'stars' | 'jwst' | 'deepspace';
  tags: string[];
  telescopeOrMission: string;
  views: number;
  fact: string;
}

const COSMIC_IMAGES: CosmicImage[] = [
  {
    id: 'jwst-carina',
    title: 'Carina Nebula Cosmic Cliffs',
    description: 'James Webb Space Telescope near-infrared view of the dramatic star-forming region NGC 3324, revealing previously invisible newborn stars.',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&auto=format&fit=crop&q=90',
    category: 'jwst',
    tags: ['JWST', 'Carina', 'Star Birth', 'Infrared'],
    telescopeOrMission: 'James Webb Space Telescope',
    views: 48200,
    fact: 'The tallest peaks in this image are roughly 7 light-years high, sculpted by extreme ultraviolet radiation from massive stars.'
  },
  {
    id: 'jwst-pillars',
    title: 'Pillars of Creation in High Definition',
    description: 'Towering tendrils of cosmic dust and gas in the Eagle Nebula, where baby stars form inside dense molecular clouds.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=90',
    category: 'jwst',
    tags: ['Eagle Nebula', 'Pillars', 'JWST', 'Stars'],
    telescopeOrMission: 'James Webb / Hubble',
    views: 65100,
    fact: 'The pillar on the left is roughly four to five light-years tall from base to top.'
  },
  {
    id: 'andromeda-core',
    title: 'Andromeda Galactic Core (M31)',
    description: 'Our neighboring spiral galaxy, spanning over 220,000 light-years and containing over 1 trillion stars.',
    imageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1600&auto=format&fit=crop&q=90',
    category: 'galaxies',
    tags: ['Andromeda', 'M31', 'Spiral Galaxy', 'Local Group'],
    telescopeOrMission: 'Hubble Space Telescope',
    views: 39400,
    fact: 'Light from Andromeda takes 2.5 million years to reach Earth, meaning we see it as it was before humans walked the Earth.'
  },
  {
    id: 'jwst-deep-field',
    title: 'Deep Field SMACS 0723',
    description: 'The deepest infrared image of the early universe, capturing gravitational lensing around a massive galaxy cluster.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=90',
    category: 'deepspace',
    tags: ['Deep Field', 'Gravitational Lens', 'Cosmic Dawn', 'JWST'],
    telescopeOrMission: 'James Webb Space Telescope',
    views: 52900,
    fact: 'This image covers a patch of sky approximately the size of a grain of sand held at arm length by someone on the ground.'
  },
  {
    id: 'orion-nebula',
    title: 'Orion Star Nursery (M42)',
    description: 'A stellar nursery located 1,344 light-years away, visible even to the naked eye under dark skies.',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=90',
    category: 'nebulae',
    tags: ['Orion', 'M42', 'Nebula', 'Protoplanetary'],
    telescopeOrMission: 'Hubble Space Telescope',
    views: 41200,
    fact: 'Orion is one of the most photographed objects in the night sky and holds hundreds of embryonic planetary systems.'
  },
  {
    id: 'tarantula-nebula',
    title: 'Tarantula Nebula 30 Doradus',
    description: 'The largest and brightest star-forming region in the Local Group, home to the most massive stars ever discovered.',
    imageUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=1600&auto=format&fit=crop&q=90',
    category: 'jwst',
    tags: ['Tarantula', '30 Doradus', 'Supergiant Stars', 'JWST'],
    telescopeOrMission: 'James Webb Space Telescope',
    views: 31800,
    fact: 'If the Tarantula Nebula were as close to Earth as the Orion Nebula, it would cast visible shadows on the ground at night.'
  },
  {
    id: 'southern-ring',
    title: 'Southern Ring Planetary Nebula (NGC 3132)',
    description: 'Expanding gas shells ejected by a dying binary star system, illuminating the final chapters of a star lifetime.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=90',
    category: 'nebulae',
    tags: ['Southern Ring', 'Planetary Nebula', 'Dying Star', 'JWST'],
    telescopeOrMission: 'James Webb Space Telescope',
    views: 29000,
    fact: 'The cloak of dust around the central dying star was detected for the first time by Webb mid-infrared instrument.'
  },
  {
    id: 'earth-aurora',
    title: 'Aurora Australis over Earth Orbit',
    description: 'Emerald atmospheric glow dancing across Earth southern hemisphere, captured from the International Space Station.',
    imageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=1600&auto=format&fit=crop&q=90',
    category: 'planets',
    tags: ['Earth', 'Aurora', 'ISS', 'Magnetic Field'],
    telescopeOrMission: 'ISS Expedition Crew',
    views: 47600,
    fact: 'Auroras are generated when charged solar wind particles collide with nitrogen and oxygen atoms in Earth upper atmosphere.'
  },
  {
    id: 'jupiter-aurora',
    title: 'Jupiter in Infrared with Giant Auroras',
    description: 'Composite infrared image showing Jupiter colossal storms, Great Red Spot, and ultraviolet polar auroras.',
    imageUrl: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?w=1600&auto=format&fit=crop&q=90',
    category: 'planets',
    tags: ['Jupiter', 'Giant Red Spot', 'Planetary Auroras', 'JWST'],
    telescopeOrMission: 'James Webb Space Telescope',
    views: 38200,
    fact: 'Jupiter magnetic field is 20,000 times stronger than Earth, driving permanent auroral rings at both poles.'
  },
  {
    id: 'sombrero-galaxy',
    title: 'Sombrero Galaxy (M104)',
    description: 'An unbarred spiral galaxy with a brilliant white bulbous core encircled by thick, dark absorbing dust lanes.',
    imageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1600&auto=format&fit=crop&q=90',
    category: 'galaxies',
    tags: ['Sombrero', 'M104', 'Supermassive Black Hole', 'Dust Ring'],
    telescopeOrMission: 'Hubble Space Telescope',
    views: 34100,
    fact: 'At the heart of the Sombrero Galaxy lies a supermassive black hole with a mass of 1 billion suns.'
  },
  {
    id: 'helix-nebula',
    title: 'Helix Nebula Eye of God',
    description: 'A glowing cosmic eye located in the constellation Aquarius, formed by a sun-like star shedding its outer layers.',
    imageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1600&auto=format&fit=crop&q=90',
    category: 'nebulae',
    tags: ['Helix Nebula', 'NGC 7293', 'Eye of God', 'Aquarius'],
    telescopeOrMission: 'Spitzer / Hubble',
    views: 45700,
    fact: 'The Helix Nebula is 650 light-years from Earth and spans roughly 2.5 light-years in diameter.'
  },
  {
    id: 'saturn-hexagon',
    title: 'Saturn Ring System & Polar Vortex',
    description: 'Cassini close-up view of Saturn rings, showing thousands of individual ringlets composed of water ice.',
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=600&auto=format&fit=crop&q=80',
    largeImageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=1600&auto=format&fit=crop&q=90',
    category: 'planets',
    tags: ['Saturn', 'Cassini', 'Ice Rings', 'Gas Giant'],
    telescopeOrMission: 'Cassini-Huygens Mission',
    views: 36800,
    fact: 'Although Saturn rings are over 280,000 km wide, they are remarkably thin—averaging only 10 to 30 meters thick.'
  },
];

export default function CosmicImageGallery() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<CosmicImage | null>(null);
  const [visualizerOpen, setVisualizerOpen] = useState<boolean>(false);
  const [visualizerIndex, setVisualizerIndex] = useState<number>(0);
  const [isVisualizerPlaying, setIsVisualizerPlaying] = useState<boolean>(true);
  const [visualizerBreathPacer, setVisualizerBreathPacer] = useState<boolean>(true);

  // Live NASA APOD Query
  const { data: apodData } = useQuery<any>({
    queryKey: ['/api/nasa/apod'],
  });

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return COSMIC_IMAGES;
    return COSMIC_IMAGES.filter((img) => img.category === selectedCategory);
  }, [selectedCategory]);

  // Slideshow auto-advance timer for Immersive Visualizer
  useEffect(() => {
    let timer: number | null = null;
    if (visualizerOpen && isVisualizerPlaying && filteredImages.length > 0) {
      timer = window.setInterval(() => {
        setVisualizerIndex((prev) => (prev + 1) % filteredImages.length);
      }, 7000); // 7s smooth transition
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visualizerOpen, isVisualizerPlaying, filteredImages.length]);

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: 'Cosmic Vision Downloaded',
        description: `Saved "${title}" in ultra-high definition.`,
      });
    } catch {
      window.open(imageUrl, '_blank');
    }
  };

  const handleShare = (img: CosmicImage) => {
    if (navigator.share) {
      navigator.share({
        title: img.title,
        text: `Contemplate the cosmos: ${img.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${img.title}: ${img.largeImageUrl}`);
      toast({
        title: 'Link Copied',
        description: 'Image link copied to clipboard.',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Immersive Visualizer Launch Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-[#1E1B4B]/80 to-sky-950/80 p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200 text-xs font-mono">
            <Telescope className="w-3.5 h-3.5" />
            <span>JWST & Hubble Deep Sky Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-space font-bold text-white">
            Cosmic Visions & Deep Space Sanctuaries
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Gaze upon star nurseries, distant colliding galaxies, and cosmic cliffs for eyes-open mindfulness and celestial contemplation.
          </p>
        </div>

        <Button
          onClick={() => {
            setVisualizerIndex(0);
            setVisualizerOpen(true);
          }}
          className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs sm:text-sm h-11 px-6 font-medium shadow-lg shadow-purple-950/60 shrink-0"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Full-Screen Visualizer
        </Button>
      </div>

      {/* Featured Live NASA APOD Card (if available) */}
      {apodData && apodData.url && (
        <Card className="bg-[#0F172A]/90 border-purple-500/30 overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 p-6 items-center">
            <div className="aspect-video relative rounded-xl overflow-hidden bg-black/60 shadow-md">
              <img
                src={apodData.url}
                alt={apodData.title || 'NASA APOD'}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <Badge className="absolute top-3 left-3 bg-purple-950/80 text-purple-200 border border-purple-500/30 text-[10px] font-mono uppercase">
                Live NASA APOD
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono text-purple-300">Astronomy Picture of the Day</span>
              </div>
              <h3 className="text-xl font-space font-bold text-white">{apodData.title}</h3>
              <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                {apodData.explanation}
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(apodData.hdurl || apodData.url, '_blank')}
                  className="border-white/10 text-xs text-gray-200 hover:bg-white/5"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  View Full HD
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {[
          { id: 'all', label: 'All Visions' },
          { id: 'jwst', label: 'James Webb (JWST)' },
          { id: 'galaxies', label: 'Galaxies' },
          { id: 'nebulae', label: 'Nebulae' },
          { id: 'planets', label: 'Planets & Auroras' },
          { id: 'deepspace', label: 'Deep Field' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white font-bold shadow-md shadow-purple-900/30'
                : 'bg-[#1E293B] text-gray-400 hover:text-gray-200 hover:bg-[#334155] border border-white/5'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((img) => (
          <Card
            key={img.id}
            className="bg-[#0F172A]/90 border-[#334155] hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg hover:shadow-purple-900/20"
          >
            <div>
              {/* Image Preview with click to open */}
              <div
                onClick={() => setActiveImage(img)}
                className="aspect-video relative overflow-hidden bg-black/60 cursor-pointer"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="px-3 py-1.5 rounded-full bg-purple-600/90 text-white text-xs font-mono flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Expand Vision</span>
                  </div>
                </div>
                <Badge className="absolute top-2.5 right-2.5 bg-black/70 text-purple-200 border border-purple-500/30 text-[10px] uppercase font-mono">
                  {img.category}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base font-space text-white leading-snug">
                  {img.title}
                </CardTitle>
                <CardDescription className="text-xs text-purple-300 font-mono">
                  {img.telescopeOrMission}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 pb-3">
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {img.description}
                </p>

                {img.fact && (
                  <div className="bg-purple-950/40 border border-purple-500/20 rounded-lg p-2 text-[11px] text-purple-200 italic">
                    ✨ {img.fact}
                  </div>
                )}
              </CardContent>
            </div>

            <CardFooter className="pt-3 border-t border-white/5 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveImage(img)}
                className="flex-1 border-white/10 text-xs text-gray-200 hover:bg-white/5"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                View HD
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(img.largeImageUrl, img.title)}
                className="border-white/10 text-xs text-gray-300 hover:bg-white/5 px-2.5"
                title="Download 4K Vision"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare(img)}
                className="border-white/10 text-xs text-gray-300 hover:bg-white/5 px-2.5"
                title="Share Vision"
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Single Image HD Preview Dialog */}
      {activeImage && (
        <Dialog open={!!activeImage} onOpenChange={(open) => !open && setActiveImage(null)}>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-[#0B0F19]/95 backdrop-blur-xl border-purple-500/40 text-white p-4 sm:p-6 shadow-2xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-purple-900/60 text-purple-200 border-purple-400/30 text-[10px] font-mono uppercase">
                  {activeImage.category}
                </Badge>
                <span className="text-xs text-gray-400">• {activeImage.telescopeOrMission}</span>
              </div>
              <DialogTitle className="text-xl font-space font-bold text-white">
                {activeImage.title}
              </DialogTitle>
            </DialogHeader>

            <div className="relative rounded-xl overflow-hidden bg-black max-h-[500px] flex items-center justify-center my-2 shadow-xl border border-white/10">
              <img
                src={activeImage.largeImageUrl}
                alt={activeImage.title}
                className="w-full h-full object-contain max-h-[480px]"
              />
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeImage.description}
              </p>
              <div className="bg-purple-950/50 border border-purple-500/30 rounded-lg p-3 text-xs text-purple-200">
                <span className="font-bold mr-1">Cosmic Fact:</span>
                {activeImage.fact}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(activeImage.largeImageUrl, activeImage.title)}
                  className="border-white/10 text-xs text-white hover:bg-white/5"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download 4K
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const idx = filteredImages.findIndex((x) => x.id === activeImage.id);
                    setVisualizerIndex(idx >= 0 ? idx : 0);
                    setActiveImage(null);
                    setVisualizerOpen(true);
                  }}
                  className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white text-xs"
                >
                  <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
                  Meditate in Visualizer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Full-Screen Immersive Meditation Visualizer Modal */}
      {visualizerOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-6 animate-in fade-in duration-700">
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-900/80 flex items-center justify-center text-purple-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-space font-bold text-white">
                  {filteredImages[visualizerIndex].title}
                </h4>
                <p className="text-[11px] text-gray-400 font-mono">
                  {filteredImages[visualizerIndex].telescopeOrMission}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setVisualizerBreathPacer(!visualizerBreathPacer)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
                  visualizerBreathPacer
                    ? 'bg-sky-950/80 border-sky-400 text-sky-300'
                    : 'bg-white/10 border-white/10 text-gray-400'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Breath Pacer {visualizerBreathPacer ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => setIsVisualizerPlaying(!isVisualizerPlaying)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isVisualizerPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
              >
                {isVisualizerPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setVisualizerOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-red-950/60 text-white transition-colors"
                title="Exit Full-Screen"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Immersive Visual with Slow Zoom Animation */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              key={filteredImages[visualizerIndex].id}
              src={filteredImages[visualizerIndex].largeImageUrl}
              alt={filteredImages[visualizerIndex].title}
              className="w-full h-full object-cover animate-in fade-in duration-1000 scale-105 hover:scale-110 transition-transform duration-10000 ease-out"
            />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />

            {/* Optional Breath Pacer Ring in Visualizer Center */}
            {visualizerBreathPacer && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-44 h-44 rounded-full border-2 border-purple-400/40 bg-purple-950/20 backdrop-blur-sm flex flex-col items-center justify-center animate-pulse shadow-2xl shadow-purple-900/60">
                  <span className="text-xs font-mono uppercase tracking-widest text-purple-200 font-bold">
                    Breathe Deeply
                  </span>
                  <span className="text-[10px] text-sky-300 font-mono mt-1">Cosmic Flow</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Prev / Next / Fact */}
          <div className="flex items-center justify-between z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <button
              onClick={() =>
                setVisualizerIndex(
                  (prev) => (prev - 1 + filteredImages.length) % filteredImages.length
                )
              }
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <p className="text-xs text-purple-200 text-center max-w-xl italic line-clamp-1 px-4">
              ✨ {filteredImages[visualizerIndex].fact}
            </p>

            <button
              onClick={() =>
                setVisualizerIndex((prev) => (prev + 1) % filteredImages.length)
              }
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}