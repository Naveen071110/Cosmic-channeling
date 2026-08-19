import { useState, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Star, ListFilter, Sparkles, Moon, Sun } from "lucide-react";

interface MeditationItem {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  duration: number; // in minutes
  theme: "relaxation" | "focus" | "creativity" | "cosmic";
  level: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  videoId: string;
  tags: string[];
}

const STATIC_MEDITATIONS: MeditationItem[] = [
  {
    id: "1",
    title: "Deep Space Astral Journey & Universal Harmony",
    channelTitle: "Cosmic Channeling",
    description: "Immerse yourself in deep theta frequencies and ambient cosmic soundscapes to expand consciousness.",
    duration: 15,
    theme: "cosmic",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=600&auto=format&fit=crop&q=80",
    videoId: "w0gBwZ77j9M",
    tags: ["Cosmic", "Astral", "Theta Wave", "Deep Peace"],
  },
  {
    id: "2",
    title: "Full Moon Cellular Healing & Intention Setting",
    channelTitle: "Lunar Wisdom",
    description: "Align your internal biological rhythms with lunar illumination to release tension and revitalize spiritual energy.",
    duration: 20,
    theme: "relaxation",
    level: "intermediate",
    thumbnail: "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=600&auto=format&fit=crop&q=80",
    videoId: "dQw4w9WgXcQ",
    tags: ["Moon", "Healing", "Restoration", "Release"],
  },
  {
    id: "3",
    title: "Solar Flare Vitality & Crown Chakra Expansion",
    channelTitle: "Solar Frequencies",
    description: "Activate your solar plexus and third eye centers through guided solar breathwork and golden light visualization.",
    duration: 10,
    theme: "focus",
    level: "beginner",
    thumbnail: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
    videoId: "M576WGiDBdQ",
    tags: ["Solar", "Focus", "Prana", "Clarity"],
  },
  {
    id: "4",
    title: "Quantum Consciousness & Star-Seed Meditation",
    channelTitle: "Universal Mind",
    description: "Journey beyond the linear matrix into the timeless realm of quantum possibilities and star constellations.",
    duration: 25,
    theme: "creativity",
    level: "advanced",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    videoId: "hHW1oYw642k",
    tags: ["Quantum", "Creativity", "Transcendence", "Constellations"],
  },
];

export default function MeditationLibrary() {
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredMeditations = useMemo(() => {
    return STATIC_MEDITATIONS.filter((item) => {
      // Theme filter
      if (selectedTheme !== "all" && item.theme !== selectedTheme) return false;
      // Duration filter
      if (selectedDuration === "short" && item.duration > 10) return false;
      if (selectedDuration === "medium" && (item.duration <= 10 || item.duration > 20)) return false;
      if (selectedDuration === "long" && item.duration <= 20) return false;
      // Level filter
      if (selectedLevel !== "all" && item.level !== selectedLevel) return false;
      // Tab filter
      if (activeTab === "popular" && item.duration < 15) return false;
      if (activeTab === "cosmic" && item.theme !== "cosmic") return false;

      return true;
    });
  }, [selectedTheme, selectedDuration, selectedLevel, activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 font-space bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Cosmic Meditation Library
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto text-sm">
          Explore curated guided journeys and frequency meditations to connect with universal consciousness.
        </p>
      </div>

      {/* Tabs and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full md:w-auto bg-[#1E293B] border border-white/10">
              <TabsTrigger value="all">All Journeys</TabsTrigger>
              <TabsTrigger value="popular">Deep Immersion</TabsTrigger>
              <TabsTrigger value="cosmic">Cosmic Only</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Select onValueChange={setSelectedTheme} value={selectedTheme}>
              <SelectTrigger className="w-[130px] bg-[#1E293B] border-white/10 text-white text-xs">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-white/10 text-white">
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
                <SelectItem value="focus">Focus</SelectItem>
                <SelectItem value="creativity">Creativity</SelectItem>
                <SelectItem value="cosmic">Cosmic</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedDuration} value={selectedDuration}>
              <SelectTrigger className="w-[130px] bg-[#1E293B] border-white/10 text-white text-xs">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-white/10 text-white">
                <SelectItem value="all">All Durations</SelectItem>
                <SelectItem value="short">Short (≤10 min)</SelectItem>
                <SelectItem value="medium">Medium (11-20 min)</SelectItem>
                <SelectItem value="long">Long (&gt;20 min)</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedLevel} value={selectedLevel}>
              <SelectTrigger className="w-[130px] bg-[#1E293B] border-white/10 text-white text-xs">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E293B] border-white/10 text-white">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Meditation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredMeditations.map((meditation) => (
          <Card
            key={meditation.id}
            className="overflow-hidden bg-[#0F172A]/90 border-[#334155] hover:border-purple-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-52 relative overflow-hidden bg-black/60">
                <img
                  src={meditation.thumbnail}
                  alt={meditation.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <Badge className="absolute top-3 right-3 bg-purple-900/90 text-purple-200 border border-purple-400/30 text-xs">
                  {meditation.theme.toUpperCase()}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-space text-white leading-snug">
                  {meditation.title}
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  {meditation.channelTitle} • Level: {meditation.level}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-xs text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                  {meditation.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {meditation.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-[10px] bg-purple-950/40 text-purple-300 border-purple-500/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </div>

            <CardFooter className="flex justify-between items-center pt-3 border-t border-white/5">
              <div className="flex items-center text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5 mr-1 text-sky-400" />
                <span>{meditation.duration} minutes</span>
              </div>
              <Button
                size="sm"
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs h-8"
                onClick={() =>
                  window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(meditation.title)}`, "_blank")
                }
              >
                <Play className="w-3.5 h-3.5 mr-1" />
                Begin Session
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredMeditations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No meditations match your filters. Try adjusting your selection.</p>
          <Button
            variant="outline"
            className="mt-4 border-white/10 text-white hover:bg-white/5"
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