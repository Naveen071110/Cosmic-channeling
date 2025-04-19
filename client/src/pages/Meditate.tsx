import { useState } from 'react';
import MeditationTimer from '@/components/features/MeditationTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAudio } from '@/hooks/use-audio';

const Meditate = () => {
  const [activeTab, setActiveTab] = useState('timer');
  
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#EC4899] to-[#0EA5E9] bg-clip-text text-transparent">
              Cosmic Meditation
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-2xl mx-auto">
            Find your inner peace among the stars. Our meditation tools help you connect with the cosmic consciousness and explore the universe within.
          </p>
        </div>
        
        <Tabs defaultValue="timer" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="timer">Meditation Timer</TabsTrigger>
            <TabsTrigger value="guided">Guided Meditations</TabsTrigger>
            <TabsTrigger value="soundscapes">Cosmic Soundscapes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="focus:outline-none">
            <div className="grid md:grid-cols-2 gap-8">
              <MeditationTimer />
              
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardHeader>
                  <CardTitle className="text-[#F1F5F9]">Meditation Benefits</CardTitle>
                  <CardDescription>How cosmic meditation enhances consciousness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-[#0EA5E9]/20 p-1 mt-0.5">
                      <i className="ri-mental-health-line text-[#0EA5E9]"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#F1F5F9]">Expanded Awareness</h3>
                      <p className="text-sm text-[#64748B]">Transcend ordinary perception and access higher states of consciousness.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-[#EC4899]/20 p-1 mt-0.5">
                      <i className="ri-heart-pulse-line text-[#EC4899]"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#F1F5F9]">Stress Reduction</h3>
                      <p className="text-sm text-[#64748B]">Cosmic meditation calms the nervous system and reduces stress hormones.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="rounded-full bg-[#7E22CE]/20 p-1 mt-0.5">
                      <i className="ri-brain-line text-[#7E22CE]"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#F1F5F9]">Intuitive Development</h3>
                      <p className="text-sm text-[#64748B]">Enhance your intuition and psychic abilities through regular practice.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="guided" className="focus:outline-none">
            <div className="grid gap-6">
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img 
                        src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                        alt="Cosmic Consciousness Meditation" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-medium mb-2">Cosmic Consciousness Meditation</h3>
                      <p className="mb-4 text-[#64748B]">Connect with the vastness of the universe and recognize your place within it. This meditation helps you sense the interconnectedness of all things.</p>
                      <div className="flex items-center">
                        <button className="bg-[#7E22CE] hover:bg-purple-800 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                          <i className="ri-play-circle-line"></i> Begin Meditation
                        </button>
                        <span className="text-xs text-[#64748B] ml-4">Duration: 15 min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img 
                        src="https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                        alt="Starlight Healing" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-xl font-medium mb-2">Starlight Healing Meditation</h3>
                      <p className="mb-4 text-[#64748B]">Visualize cosmic light flowing through your body, clearing blockages and revitalizing your energy centers with the pure energy of the stars.</p>
                      <div className="flex items-center">
                        <button className="bg-[#7E22CE] hover:bg-purple-800 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                          <i className="ri-play-circle-line"></i> Begin Meditation
                        </button>
                        <span className="text-xs text-[#64748B] ml-4">Duration: 20 min</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="soundscapes" className="focus:outline-none">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Galactic Ambient</h3>
                    <div className="h-12 w-12 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <button className="text-[#0EA5E9] hover:text-[#EC4899] transition-colors">
                        <i className="ri-play-circle-fill text-2xl"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="h-1.5 w-full bg-[#334155] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#64748B]">0:00</span>
                      <span className="text-xs text-[#64748B]">5:30</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B]">
                    Immerse yourself in the gentle symphony of the cosmos with this ambient soundscape designed to induce deep relaxation.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Quantum Field</h3>
                    <div className="h-12 w-12 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <button className="text-[#0EA5E9] hover:text-[#EC4899] transition-colors">
                        <i className="ri-play-circle-fill text-2xl"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="h-1.5 w-full bg-[#334155] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#64748B]">0:00</span>
                      <span className="text-xs text-[#64748B]">7:15</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B]">
                    Subatomic particles in sonic form. This binaural soundscape helps synchronize brain hemispheres and access deep meditative states.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Stellar Lullaby</h3>
                    <div className="h-12 w-12 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <button className="text-[#0EA5E9] hover:text-[#EC4899] transition-colors">
                        <i className="ri-play-circle-fill text-2xl"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="h-1.5 w-full bg-[#334155] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#64748B]">0:00</span>
                      <span className="text-xs text-[#64748B]">10:00</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B]">
                    The gentle pulse of stars and distant nebulae transformed into a soothing soundscape perfect for deep relaxation and sleep.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1E293B] border-[#334155]">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Cosmic Voyage</h3>
                    <div className="h-12 w-12 rounded-full bg-[#0F172A] flex items-center justify-center">
                      <button className="text-[#0EA5E9] hover:text-[#EC4899] transition-colors">
                        <i className="ri-play-circle-fill text-2xl"></i>
                      </button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="h-1.5 w-full bg-[#334155] rounded-full overflow-hidden">
                      <div className="h-full bg-[#0EA5E9] rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-[#64748B]">0:00</span>
                      <span className="text-xs text-[#64748B]">8:45</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#64748B]">
                    An immersive journey through the cosmos, with dynamic soundscapes that evolve and transform throughout the meditation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Meditate;
