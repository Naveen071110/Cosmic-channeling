import { useState } from 'react';
import MeditationTimer from '@/components/features/MeditationTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAudio } from '@/hooks/use-audio';

const GuidedMeditationPlayer = ({ title, description, duration, imageUrl, audioUrl }: { 
  title: string, 
  description: string, 
  duration: number, 
  imageUrl: string,
  audioUrl: string
}) => {
  const { 
    isPlaying, 
    toggle, 
    currentTime, 
    duration: audioDuration,
    audioError
  } = useAudio(audioUrl);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;
  
  return (
    <Card className="bg-[#1E293B] border-[#334155]">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 h-48 md:h-auto relative">
            <img 
              src={imageUrl}
              alt={title} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <h3 className="text-xl font-medium mb-2">{title}</h3>
            <p className="mb-4 text-[#64748B]">{description}</p>
            
            {isPlaying && (
              <div className="mb-4">
                <Progress value={progress} className="h-1.5 mb-1" />
                <div className="flex justify-between">
                  <span className="text-xs text-[#64748B]">{formatTime(currentTime)}</span>
                  <span className="text-xs text-[#64748B]">{formatTime(audioDuration)}</span>
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <button 
                onClick={toggle}
                className="bg-[#7E22CE] hover:bg-purple-800 text-white py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              >
                <i className={`ri-${isPlaying ? 'pause' : 'play'}-circle-line`}></i> 
                {isPlaying ? 'Pause Meditation' : 'Begin Meditation'}
              </button>
              <span className="text-xs text-[#64748B] ml-4">Duration: {duration} min</span>
              
              {audioError && (
                <span className="text-xs text-[#EC4899] ml-4">Using fallback audio</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Meditate = () => {
  const [activeTab, setActiveTab] = useState('timer');
  
  const guidedMeditations = [
    {
      title: "Cosmic Consciousness Meditation",
      description: "Connect with the vastness of the universe and recognize your place within it. This meditation helps you sense the interconnectedness of all things.",
      imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      audioUrl: "/audio/cosmic-consciousness.mp3",
      duration: 15
    },
    {
      title: "Starlight Healing Meditation",
      description: "Visualize cosmic light flowing through your body, clearing blockages and revitalizing your energy centers with the pure energy of the stars.",
      imageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      audioUrl: "/audio/starlight-healing.mp3",
      duration: 20
    },
    {
      title: "Cosmic Journey Meditation",
      description: "Take a journey through the cosmos, exploring planets, stars, and galaxies while expanding your consciousness beyond earthly limitations.",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      audioUrl: "/audio/cosmic-journey.mp3",
      duration: 18
    }
  ];
  
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
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="timer">Meditation Timer</TabsTrigger>
            <TabsTrigger value="guided">Guided Meditations</TabsTrigger>
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
              {guidedMeditations.map((meditation, index) => (
                <GuidedMeditationPlayer 
                  key={index}
                  title={meditation.title}
                  description={meditation.description}
                  duration={meditation.duration}
                  imageUrl={meditation.imageUrl}
                  audioUrl={meditation.audioUrl}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Meditate;
