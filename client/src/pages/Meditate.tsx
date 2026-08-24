import { useState } from 'react';
import SEO from '@/components/SEO';
import MeditationTimer from '@/components/features/MeditationTimer';
import GuidedMeditation from '@/components/features/GuidedMeditation';
import CosmicImageGallery from '@/components/CosmicImageGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Play, Telescope, Sparkles, Brain, Heart, Radio } from 'lucide-react';

export default function Meditate() {
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <>
      <SEO
        title="432Hz & 528Hz Solfeggio Soundscapes | Cosmic Channeling"
        description="Experience procedural Solfeggio soundscapes, 4-4-4-4 box breathing pacers, Tibetan singing bowls, and guided cosmic meditation journeys."
        canonical="https://cosmic-channeling.vercel.app/meditate"
      />
      <main className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
      <section className="max-w-6xl mx-auto space-y-8">
        {/* Main Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cosmic Consciousness & Meditation Sanctuary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-space">
            <span className="bg-gradient-to-r from-[#EC4899] via-purple-300 to-[#0EA5E9] bg-clip-text text-transparent">
              Cosmic Meditation
            </span>
          </h1>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Find profound stillness among the stars. Utilize Solfeggio frequencies, box breathing pacers, curated guided journeys, and deep space visions to harmonize your mind and body.
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="timer" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-xl bg-[#1E293B] border border-white/10 p-1 rounded-2xl">
              <TabsTrigger
                value="timer"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7E22CE] data-[state=active]:to-[#EC4899] data-[state=active]:text-white text-xs sm:text-sm font-space flex items-center justify-center gap-1.5"
              >
                <Clock className="w-4 h-4" />
                <span>Timer & Sounds</span>
              </TabsTrigger>
              <TabsTrigger
                value="guided"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7E22CE] data-[state=active]:to-[#EC4899] data-[state=active]:text-white text-xs sm:text-sm font-space flex items-center justify-center gap-1.5"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Guided Journeys</span>
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7E22CE] data-[state=active]:to-[#EC4899] data-[state=active]:text-white text-xs sm:text-sm font-space flex items-center justify-center gap-1.5"
              >
                <Telescope className="w-4 h-4" />
                <span>Cosmic Visions</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Timer & Frequencies Tab */}
          <TabsContent value="timer" className="focus:outline-none space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                <MeditationTimer />
              </div>

              {/* Sidebar Guide & Science of Frequencies */}
              <div className="space-y-6">
                <Card className="bg-[#0F172A]/90 border-[#334155] shadow-xl">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base font-space text-white flex items-center gap-2">
                      <Radio className="w-4 h-4 text-purple-400" />
                      Harmonic Frequencies
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      How audio vibrations tune mental coherence
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3.5 pt-4 text-xs text-gray-300">
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 space-y-1">
                      <div className="flex items-center justify-between text-purple-200 font-bold">
                        <span>432 Hz Harmonic Pitch</span>
                        <span className="font-mono text-[10px]">Universal Peace</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Mathematical tuning aligned with sacred geometry. Lowers cortisol and induces deep parasympathetic calmness.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-500/20 space-y-1">
                      <div className="flex items-center justify-between text-pink-200 font-bold">
                        <span>528 Hz Solfeggio Miracle</span>
                        <span className="font-mono text-[10px]">Vitality & DNA</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Known as the frequency of transformation and love. Stimulates cellular repair, clarity, and heart-center activation.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/20 space-y-1">
                      <div className="flex items-center justify-between text-sky-200 font-bold">
                        <span>6 Hz Theta Binaural Beat</span>
                        <span className="font-mono text-[10px]">Lucid & Astral</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">
                        Synchronizes left and right brain hemispheres into theta state for deep visualization, dreams, and spiritual insight.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F172A]/90 border-[#334155] shadow-xl">
                  <CardHeader className="pb-3 border-b border-white/5">
                    <CardTitle className="text-base font-space text-white flex items-center gap-2">
                      <Brain className="w-4 h-4 text-sky-400" />
                      Consciousness Expansion
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400">
                      Benefits of regular cosmic meditation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4 text-xs text-gray-300">
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-lg bg-[#0EA5E9]/20 p-1.5 mt-0.5 text-[#0EA5E9]">
                        <Brain className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Expanded Awareness</h4>
                        <p className="text-[11px] text-gray-400">Transcend daily mental clutter and tune into cosmic perspective.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="rounded-lg bg-[#EC4899]/20 p-1.5 mt-0.5 text-[#EC4899]">
                        <Heart className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Stress Dissolution</h4>
                        <p className="text-[11px] text-gray-400">Box breathing releases nervous tension and regulates heart coherence.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Guided Journeys Tab */}
          <TabsContent value="guided" className="focus:outline-none">
            <GuidedMeditation />
          </TabsContent>

          {/* Cosmic Visions Tab */}
          <TabsContent value="gallery" className="focus:outline-none">
            <CosmicImageGallery />
          </TabsContent>
        </Tabs>
      </section>
    </main>
    </>
  );
}
