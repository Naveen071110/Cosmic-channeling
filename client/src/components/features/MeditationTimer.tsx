import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/hooks/use-audio';

const MeditationTimer = () => {
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('05:00');
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [meditationMusic, setMeditationMusic] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  // Use local meditation music files
  const loadMeditationMusic = () => {
    const musicFiles = [
      '/audio/cosmic-consciousness.mp3',
      '/audio/cosmic-journey.mp3',
      '/audio/starlight-healing.mp3'
    ];
    
    // Select a random track
    const randomTrack = musicFiles[Math.floor(Math.random() * musicFiles.length)];
    setMeditationMusic(randomTrack);
  };

  useEffect(() => {
    loadMeditationMusic();
  }, []);
  
  const { 
    isPlaying, 
    toggle, 
    audioSource, 
    setAudioSource 
  } = useAudio(meditationMusic || 'https://www.soundjay.com/misc/sounds/meditation-bell.wav');

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = window.setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isActive, time]);

  useEffect(() => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    setTimeDisplay(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [time]);

  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
      toggle();
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(selectedDuration * 60);
    if (isPlaying) toggle();
  };

  const selectDuration = (minutes: number) => {
    setSelectedDuration(minutes);
    setTime(minutes * 60);
  };

  return (
    <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:border-[#7E22CE]/40">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className="ri-moon-clear-line text-2xl text-[#0EA5E9] mr-3"></i>
          <h3 className="text-xl font-medium">Cosmic Meditation</h3>
        </div>
        
        <div className="relative h-60 mb-6 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#334155] flex items-center justify-center relative z-10">
            <span className="text-3xl font-space font-bold">{timeDisplay}</span>
          </div>
          
          {/* Orbital animation */}
          <div className="cosmic-orbiter">
            <div className="orbit-dot"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button 
            onClick={() => selectDuration(1)}
            className={`py-2 px-3 ${selectedDuration === 1 ? 'bg-[#7E22CE]' : 'bg-[#334155] hover:bg-[#475569]'} rounded text-sm transition-colors`}
          >
            1m
          </button>
          <button 
            onClick={() => selectDuration(3)}
            className={`py-2 px-3 ${selectedDuration === 3 ? 'bg-[#7E22CE]' : 'bg-[#334155] hover:bg-[#475569]'} rounded text-sm transition-colors`}
          >
            3m
          </button>
          <button 
            onClick={() => selectDuration(5)}
            className={`py-2 px-3 ${selectedDuration === 5 ? 'bg-[#7E22CE]' : 'bg-[#334155] hover:bg-[#475569]'} rounded text-sm transition-colors`}
          >
            5m
          </button>
          <button 
            onClick={() => selectDuration(10)}
            className={`py-2 px-3 ${selectedDuration === 10 ? 'bg-[#7E22CE]' : 'bg-[#334155] hover:bg-[#475569]'} rounded text-sm transition-colors`}
          >
            10m
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={toggle}
              className="p-2 text-lg text-[#0EA5E9] hover:text-[#EC4899] transition-colors" 
              aria-label="Sound options"
            >
              <i className={`ri-volume-${isPlaying ? 'up' : 'mute'}-line`}></i>
            </button>
            <span className="text-xs text-[#64748B]">Cosmic Ambient</span>
          </div>
          
          <Button 
            onClick={isActive ? handleReset : handleStart}
            className={`${isActive ? 'bg-[#EF4444] hover:bg-red-600' : 'bg-[#7E22CE] hover:bg-purple-800'} text-white py-2 px-4 rounded-md transition-colors`}
          >
            {isActive ? 'Reset' : 'Begin'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeditationTimer;
