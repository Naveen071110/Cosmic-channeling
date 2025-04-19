import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAudio } from '@/hooks/use-audio';

interface CosmicSound {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
}

const CosmicSignals = () => {
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  
  // Sample cosmic sounds - in a real app these would come from an API
  const cosmicSounds: CosmicSound[] = [
    {
      id: 'voyager',
      title: 'Voyager Golden Record',
      description: 'Sounds of Earth traveling beyond our solar system',
      audioUrl: 'https://cdn.freesound.org/previews/542/542092_7374079-lq.mp3'
    },
    {
      id: 'saturn',
      title: 'Saturn\'s Radio Emissions',
      description: 'Electromagnetic waves captured by Cassini',
      audioUrl: 'https://cdn.freesound.org/previews/529/529515_11232529-lq.mp3'
    }
  ];
  
  const { 
    isPlaying, 
    toggle,
    audioRef,
    currentTime,
    duration,
    handleTimeUpdate,
    handleSeek
  } = useAudio(currentSound ? cosmicSounds.find(s => s.id === currentSound)?.audioUrl || '' : '');

  const handlePlaySound = (soundId: string) => {
    if (currentSound === soundId) {
      toggle();
    } else {
      setCurrentSound(soundId);
      // Small timeout to allow audio to load
      setTimeout(() => toggle(), 100);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-broadcast-line text-2xl text-[#EC4899] mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Signals</h3>
        </div>
        
        <div className="space-y-4 mb-4">
          {cosmicSounds.map((sound) => (
            <div key={sound.id} className="bg-[#0F172A] rounded-md p-3 border border-[#334155]">
              <h4 className="mb-1 font-medium text-sm">{sound.title}</h4>
              <p className="text-xs text-[#64748B] mb-2">{sound.description}</p>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePlaySound(sound.id)}
                  className="text-[#0EA5E9] hover:text-[#EC4899] transition-colors"
                >
                  <i className={`ri-${currentSound === sound.id && isPlaying ? 'pause' : 'play'}-circle-line text-xl`}></i>
                </button>
                
                <Slider
                  value={[currentSound === sound.id ? currentTime : 0]}
                  min={0}
                  max={currentSound === sound.id ? (duration || 100) : 100}
                  step={1}
                  onValueChange={(value) => {
                    if (currentSound === sound.id) {
                      handleSeek(value[0]);
                    }
                  }}
                  disabled={currentSound !== sound.id}
                  className="audio-progress flex-grow"
                />
                
                <span className="text-xs text-[#64748B]">
                  {currentSound === sound.id ? formatTime(currentTime) : '0:00'}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          className="w-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] py-2 rounded-md transition-colors flex items-center justify-center"
        >
          <i className="ri-sound-module-line mr-2"></i> Browse All Signals
        </Button>
      </div>
    </div>
  );
};

export default CosmicSignals;
