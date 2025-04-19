import { useState, useEffect, useRef } from 'react';

// Updated list of reliable audio files
const fallbackAudios = {
  galactic: "https://assets.mixkit.co/sfx/preview/mixkit-cinematic-fairy-tale-percussion-556.mp3",
  quantum: "https://assets.mixkit.co/sfx/preview/mixkit-magical-ball-boing-1493.mp3",
  stellar: "https://assets.mixkit.co/sfx/preview/mixkit-atmosphere-fairy-tale-titanium-hum-686.mp3",
  cosmic: "https://assets.mixkit.co/sfx/preview/mixkit-fairy-message-notification-2291.mp3",
  meditation: "https://assets.mixkit.co/sfx/preview/mixkit-serene-new-age-muzak-loop-524.mp3"
};

export function useAudio(url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioSource, setAudioSource] = useState(url);
  const [audioError, setAudioError] = useState(false);

  // Function to find a fallback audio source if the provided URL fails
  const getFallbackAudio = (originalUrl: string) => {
    // Try to match the URL or title to a fallback source
    if (originalUrl.includes("galactic") || originalUrl.includes("ambient")) {
      return fallbackAudios.galactic;
    } else if (originalUrl.includes("quantum") || originalUrl.includes("field")) {
      return fallbackAudios.quantum;
    } else if (originalUrl.includes("stellar") || originalUrl.includes("lullaby")) {
      return fallbackAudios.stellar;
    } else if (originalUrl.includes("cosmic") || originalUrl.includes("voyage")) {
      return fallbackAudios.cosmic;
    } else {
      // Default meditation sound
      return fallbackAudios.meditation;
    }
  };

  useEffect(() => {
    // Reset error state when URL changes
    setAudioError(false);

    const actualUrl = audioError ? getFallbackAudio(url) : url;
    const audio = new Audio(actualUrl);
    audioRef.current = audio;

    // Preload the audio
    audio.preload = "auto";

    // Set up event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Clean up
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [url, audioError]);

  const handleError = () => {
    console.error('Audio source error, switching to fallback');
    setAudioError(true);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // Use Promise with a small timeout to ensure audio is loaded
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            
            // If there's a CORS issue or other loading problem, try a fallback
            if (!audioError) {
              setAudioError(true);
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioError]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 100); // Fallback duration if none is available
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const toggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return {
    isPlaying,
    toggle,
    audioRef,
    currentTime,
    duration,
    handleTimeUpdate,
    handleSeek,
    audioSource,
    setAudioSource,
    audioError
  };
}
