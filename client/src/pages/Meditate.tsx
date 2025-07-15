import { useState } from 'react';
import MeditationTimer from '@/components/features/MeditationTimer';
import GuidedMeditation from '@/components/features/GuidedMeditation';
import CosmicImageGallery from '@/components/CosmicImageGallery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
            <TabsTrigger value="guided">Guided Journeys</TabsTrigger>
            <TabsTrigger value="gallery">Cosmic Visions</TabsTrigger>
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
            <GuidedMeditation />
          </TabsContent>
          
          <TabsContent value="gallery" className="focus:outline-none">
            <CosmicImageGallery />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Meditate;
