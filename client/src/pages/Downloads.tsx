import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Music, 
  Image as ImageIcon, 
  FileText, 
  Printer, 
  Sparkles, 
  Check, 
  ExternalLink,
  Eye,
  Headphones,
  Moon,
  Compass
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface DownloadItem {
  id: string;
  category: 'audio' | 'images' | 'pdfs' | 'printables';
  title: string;
  description: string;
  fileSize: string;
  fileFormat: string;
  downloadUrl: string;
  previewUrl?: string;
  tags: string[];
  popular?: boolean;
}

const DOWNLOAD_ITEMS: DownloadItem[] = [
  // Audio
  {
    id: 'audio-1',
    category: 'audio',
    title: 'Deep Space Theta Wave Meditation (432Hz)',
    description: 'Immersive soundscape calibrated to 432Hz harmonic resonance for profound astral meditation and REM relaxation.',
    fileSize: '42.5 MB',
    fileFormat: 'MP3 (320kbps)',
    downloadUrl: '/audio/cosmic-consciousness.mp3',
    tags: ['432Hz', 'Astral', 'Deep Theta', 'Meditation'],
    popular: true,
  },
  {
    id: 'audio-2',
    category: 'audio',
    title: 'Solar Flare Vitality Frequency (528Hz)',
    description: 'Miracle tone frequency designed to stimulate DNA transformation, clarity of purpose, and solar plexus activation.',
    fileSize: '36.8 MB',
    fileFormat: 'MP3 (320kbps)',
    downloadUrl: '/audio/cosmic-journey.mp3',
    tags: ['528Hz', 'Solar Prana', 'Transformation'],
  },
  {
    id: 'audio-3',
    category: 'audio',
    title: 'Starlight Healing & Cosmic Cellular Rest',
    description: 'Gentle ambient celestial frequencies woven with singing bowls to soothe anxiety and restore internal harmony.',
    fileSize: '51.2 MB',
    fileFormat: 'MP3 (320kbps)',
    downloadUrl: '/audio/starlight-healing.mp3',
    tags: ['Singing Bowls', 'Cellular Rest', 'Peace'],
    popular: true,
  },

  // Wallpapers
  {
    id: 'img-1',
    category: 'images',
    title: 'Andromeda Galactic Core (8K Ultra HD)',
    description: 'Breathtaking 8K resolution composite capture of the Andromeda Galaxy spiraling with billions of stars.',
    fileSize: '18.4 MB',
    fileFormat: 'JPG (7680x4320)',
    downloadUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=3840&q=95',
    previewUrl: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=800&q=80',
    tags: ['8K Desktop', 'Galaxies', 'Andromeda'],
    popular: true,
  },
  {
    id: 'img-2',
    category: 'images',
    title: 'Deep Orion Star Nursery (Mobile 4K OLED)',
    description: 'Vertical OLED-optimized starry nebula wallpaper with pitch-black space contrast and vivid magenta highlights.',
    fileSize: '9.2 MB',
    fileFormat: 'JPG (2160x3840)',
    downloadUrl: 'https://images.unsplash.com/photo-1570032257806-7272438f38da?auto=format&fit=crop&w=2160&q=95',
    previewUrl: 'https://images.unsplash.com/photo-1570032257806-7272438f38da?auto=format&fit=crop&w=800&q=80',
    tags: ['Mobile Wallpaper', 'OLED Dark', 'Nebula'],
  },
  {
    id: 'img-3',
    category: 'images',
    title: 'Cosmic Earth Orbit & Atmospheric Auroras',
    description: 'High-definition orbit view of Planet Earth crowned by dancing green aurora borealis.',
    fileSize: '14.1 MB',
    fileFormat: 'JPG (3840x2160)',
    downloadUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=3840&q=95',
    previewUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=800&q=80',
    tags: ['Earth Orbit', 'Aurora', '4K Desktop'],
  },

  // PDFs & Guides
  {
    id: 'pdf-1',
    category: 'pdfs',
    title: 'Cosmic Meditation & Consciousness Field Manual',
    description: 'A 24-page complete practitioner handbook on breathwork, celestial alignment, and theta frequency navigation.',
    fileSize: '4.8 MB',
    fileFormat: 'PDF Document',
    downloadUrl: '#',
    tags: ['Field Guide', 'Meditation', 'Handbook'],
    popular: true,
  },
  {
    id: 'pdf-2',
    category: 'pdfs',
    title: 'Night Sky Stargazing & Planetary Tracking Guide',
    description: 'Beginner to intermediate star-hopper roadmap for identifying major constellations, planets, and eclipses.',
    fileSize: '3.2 MB',
    fileFormat: 'PDF Document',
    downloadUrl: '#',
    tags: ['Astronomy', 'Stargazing', 'Planets'],
  },

  // Printables
  {
    id: 'print-1',
    category: 'printables',
    title: 'Cosmic Affirmation Cards (Print-Ready 30-Card Deck)',
    description: 'High-resolution printable 30-card deck featuring morning solar affirmations and evening lunar contemplations.',
    fileSize: '12.6 MB',
    fileFormat: 'Print PDF (300 DPI)',
    downloadUrl: '#',
    tags: ['Card Deck', 'Daily Affirmations', '300 DPI'],
    popular: true,
  },
  {
    id: 'print-2',
    category: 'printables',
    title: 'Annual Lunar Phase & Celestial Calendar Poster',
    description: 'Minimalist wall art poster displaying every moon phase, eclipse, and planetary transit for the year.',
    fileSize: '8.5 MB',
    fileFormat: 'Vector PDF / Poster',
    downloadUrl: '#',
    tags: ['Moon Calendar', 'Wall Poster', 'Printable'],
  },
];

const downloadCategories = [
  { id: 'all', label: 'All Resources', icon: Sparkles },
  { id: 'audio', label: 'Audio & Frequencies', icon: Headphones },
  { id: 'images', label: '4K/8K Wallpapers', icon: ImageIcon },
  { id: 'pdfs', label: 'Guides & Manuals', icon: FileText },
  { id: 'printables', label: 'Printables & Art', icon: Printer },
];

export default function Downloads() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Record<string, boolean>>({});

  const filteredItems = activeCategory === 'all'
    ? DOWNLOAD_ITEMS
    : DOWNLOAD_ITEMS.filter(item => item.category === activeCategory);

  const handleDownload = (item: DownloadItem) => {
    setDownloadedIds(prev => ({ ...prev, [item.id]: true }));
    if (item.downloadUrl && item.downloadUrl !== '#') {
      window.open(item.downloadUrl, '_blank');
    } else {
      // Create a printable text/markdown summary download for PDFs/Guides
      const content = `# Cosmic Channeling - ${item.title}\n\n${item.description}\n\nCategory: ${item.category}\nFormat: ${item.fileFormat}\nTags: ${item.tags.join(', ')}\n\nExplore more online at https://cosmic-channeling.vercel.app`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7E22CE] to-[#EC4899] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#7E22CE]/30">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-space font-bold mb-4 bg-gradient-to-r from-[#EC4899] via-purple-400 to-[#0EA5E9] bg-clip-text text-transparent">
            Cosmic Resource Vault
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Download high-resolution wallpapers, harmonic meditation audio, printable celestial guides, and affirmation decks.
          </p>
        </motion.div>
      </section>

      {/* Category Filters */}
      <section className="px-6 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2.5 justify-center mb-8">
            {downloadCategories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white shadow-md shadow-purple-900/40'
                      : 'bg-[#1E293B] text-gray-300 hover:bg-[#334155] hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="bg-[#1E293B]/90 border-[#334155] hover:border-purple-500/50 transition-all flex flex-col justify-between h-full group overflow-hidden">
                    {item.previewUrl && (
                      <div className="h-44 relative overflow-hidden bg-black/60">
                        <img
                          src={item.previewUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => setPreviewImage(item.downloadUrl)}
                          className="absolute bottom-3 right-3 bg-black/70 hover:bg-black text-white p-2 rounded-full backdrop-blur-sm transition-all"
                          title="Preview full image"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.popular && (
                          <Badge className="absolute top-3 left-3 bg-[#EC4899] text-white text-[10px]">
                            POPULAR
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-[10px] bg-purple-950/40 text-purple-300 border-purple-500/30 capitalize">
                            {item.category}
                          </Badge>
                          <span className="text-[11px] text-gray-400 font-mono">
                            {item.fileSize} • {item.fileFormat}
                          </span>
                        </div>

                        <CardTitle className="text-base font-space text-white mb-2 leading-snug">
                          {item.title}
                        </CardTitle>

                        <p className="text-xs text-gray-300 mb-4 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {item.tags.map((tag, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0F172A] text-gray-400 border border-white/5">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-sky-400 font-medium">Free Access</span>
                        <Button
                          size="sm"
                          onClick={() => handleDownload(item)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs h-8 px-4"
                        >
                          {downloadedIds[item.id] ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" />
                              Downloaded
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-4xl bg-[#0F172A] border-white/10 p-2">
          {previewImage && (
            <div className="relative rounded-lg overflow-hidden max-h-[80vh] flex items-center justify-center">
              <img
                src={previewImage}
                alt="Full Wallpaper Preview"
                className="max-h-[75vh] w-auto object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
