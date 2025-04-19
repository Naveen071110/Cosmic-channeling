import { useState, useRef, useEffect } from 'react';
import { SpaceAudio } from '@/data/spaceAudio';
import { formatTime } from '@/lib/utils';

interface AudioPlayerProps {
  audio: SpaceAudio;
  isActive: boolean;
  onPlay: () => void;
  onPause: () => void;
}

export default function AudioPlayer({ audio, isActive, onPlay, onPause }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element
    const audioElement = new Audio(audio.url);
    audioRef.current = audioElement;
    
    // Setup event listeners
    audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration);
    });
    
    audioElement.addEventListener('timeupdate', () => {
      setCurrentTime(audioElement.currentTime);
    });
    
    audioElement.addEventListener('ended', () => {
      setIsPlaying(false);
      onPause();
    });
    
    // Cleanup
    return () => {
      audioElement.pause();
      audioElement.src = '';
      audioElement.removeEventListener('loadedmetadata', () => {});
      audioElement.removeEventListener('timeupdate', () => {});
      audioElement.removeEventListener('ended', () => {});
    };
  }, [audio.url, onPause]);
  
  // If this player becomes inactive while playing, pause it
  useEffect(() => {
    if (!isActive && isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
      onPlay();
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={togglePlay} 
        className="text-cosmic-blue hover:text-cosmic-pink transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        <i className={`${isPlaying ? 'ri-pause-circle-line' : 'ri-play-circle-line'} text-xl`}></i>
      </button>
      
      <input 
        type="range" 
        className="audio-progress flex-grow" 
        min="0" 
        max={duration || 100}
        value={currentTime}
        onChange={handleProgressChange}
      />
      
      <span className="text-xs text-space-600">{formatTime(currentTime)}</span>
    </div>
  );
}
