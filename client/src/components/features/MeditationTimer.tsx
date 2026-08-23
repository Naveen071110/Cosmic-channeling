import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Wind,
  Bell,
  CheckCircle2,
  Moon,
} from 'lucide-react';
import { cosmicAudio, type SoundscapeType } from '@/lib/WebAudioCosmicSynth';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type BreathingPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

const DURATION_PRESETS = [
  { label: '1m', minutes: 1 },
  { label: '3m', minutes: 3 },
  { label: '5m', minutes: 5 },
  { label: '10m', minutes: 10 },
  { label: '15m', minutes: 15 },
  { label: '20m', minutes: 20 },
  { label: '30m', minutes: 30 },
];

const SOUNDSCAPES: { id: SoundscapeType; label: string; description: string; icon: string }[] = [
  { id: '432hz', label: '432 Hz Peace', description: 'Harmonic universal resonance', icon: '🌌' },
  { id: '528hz', label: '528 Hz Vitality', description: 'Solfeggio transformation tone', icon: '✨' },
  { id: 'theta', label: 'Theta Drone', description: '6 Hz binaural deep astral trance', icon: '🧠' },
  { id: 'cosmic-noise', label: 'Cosmic Noise', description: 'Deep space stellar wind', icon: '🌊' },
  { id: 'none', label: 'Silent', description: 'Pure silence with bowl chimes only', icon: '🔇' },
];

export default function MeditationTimer() {
  const [selectedDuration, setSelectedDuration] = useState<number>(5); // minutes
  const [totalSeconds, setTotalSeconds] = useState<number>(300);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [selectedSoundscape, setSelectedSoundscape] = useState<SoundscapeType>('432hz');
  const [volume, setVolume] = useState<number>(0.6);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [intervalBellOption, setIntervalBellOption] = useState<'off' | '1m' | '5m'>('off');
  const [boxBreathingActive, setBoxBreathingActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [breathCount, setBreathCount] = useState<number>(4);

  const timerIntervalRef = useRef<number | null>(null);
  const breathingIntervalRef = useRef<number | null>(null);

  // Set initial duration
  const handleSelectPreset = (minutes: number) => {
    if (timerState === 'running' || timerState === 'paused') {
      cosmicAudio.stopSoundscape();
    }
    setSelectedDuration(minutes);
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setTimerState('idle');
  };

  // Soundscape selection change
  const handleSoundscapeChange = (type: SoundscapeType) => {
    setSelectedSoundscape(type);
    if (timerState === 'running') {
      cosmicAudio.startSoundscape(type);
    }
  };

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted) setIsMuted(false);
    cosmicAudio.setVolume(newVol);
  };

  // Mute toggle
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      cosmicAudio.setVolume(volume);
    } else {
      setIsMuted(true);
      cosmicAudio.setVolume(0);
    }
  };

  // Start / Resume Timer
  const handleStart = () => {
    if (timerState === 'idle' || timerState === 'completed') {
      // Play start bell
      cosmicAudio.playBowlChime(528);
      cosmicAudio.startSoundscape(selectedSoundscape);
    } else if (timerState === 'paused') {
      cosmicAudio.startSoundscape(selectedSoundscape);
    }
    setTimerState('running');
  };

  // Pause Timer
  const handlePause = () => {
    setTimerState('paused');
    cosmicAudio.stopSoundscape();
  };

  // Reset Timer
  const handleReset = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    cosmicAudio.stopSoundscape();
    setTimerState('idle');
    setSecondsRemaining(totalSeconds);
  };

  // Countdown loop
  useEffect(() => {
    if (timerState === 'running') {
      timerIntervalRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Session Completed!
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            cosmicAudio.stopSoundscape();
            cosmicAudio.playBowlChime(432); // Deep closing chime
            setTimeout(() => cosmicAudio.playBowlChime(528), 1500); // Harmonic twin chime
            setTimerState('completed');
            return 0;
          }

          // Interval Bell Check
          const elapsed = totalSeconds - (prev - 1);
          if (intervalBellOption === '1m' && elapsed % 60 === 0) {
            cosmicAudio.playBowlChime(528);
          } else if (intervalBellOption === '5m' && elapsed % 300 === 0) {
            cosmicAudio.playBowlChime(528);
          }

          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerState, totalSeconds, intervalBellOption]);

  // Box Breathing cycle (4s Inhale -> 4s Hold -> 4s Exhale -> 4s Hold)
  useEffect(() => {
    if (boxBreathingActive && (timerState === 'running' || timerState === 'idle')) {
      let count = 4;
      let phase: BreathingPhase = 'inhale';

      breathingIntervalRef.current = window.setInterval(() => {
        count -= 1;
        if (count <= 0) {
          count = 4;
          if (phase === 'inhale') phase = 'hold-in';
          else if (phase === 'hold-in') phase = 'exhale';
          else if (phase === 'exhale') phase = 'hold-out';
          else phase = 'inhale';
        }
        setBreathCount(count);
        setBreathingPhase(phase);
      }, 1000);
    } else {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    }

    return () => {
      if (breathingIntervalRef.current) clearInterval(breathingIntervalRef.current);
    };
  }, [boxBreathingActive, timerState]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      cosmicAudio.stopSoundscape();
    };
  }, []);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Progress percentage (0 to 100)
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="bg-[#0F172A]/90 rounded-2xl border border-purple-500/30 p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-space font-bold text-white">Cosmic Meditation Sanctuary</h3>
            <p className="text-[11px] text-gray-400">Harmonic frequency timer with Tibetan singing bowl chimes</p>
          </div>
        </div>

        <button
          onClick={() => setBoxBreathingActive(!boxBreathingActive)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all border ${
            boxBreathingActive
              ? 'bg-sky-950/80 border-sky-400 text-sky-300 shadow-sm shadow-sky-500/20'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
          }`}
          title="Toggle 4-4-4-4 Box Breathing visual guide"
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Breath Pacer {boxBreathingActive ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Main Timer Display */}
      {timerState === 'completed' ? (
        <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-900/40">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-2xl font-space font-bold text-white mb-1">Meditation Complete</h4>
            <p className="text-xs text-gray-300">
              You channeled <span className="text-purple-300 font-bold">{selectedDuration} minutes</span> of cosmic presence.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => cosmicAudio.playBowlChime(528)}
              className="text-xs border-white/10 text-gray-300 hover:bg-white/5"
            >
              <Bell className="w-3.5 h-3.5 mr-1.5 text-purple-400" />
              Sound Bowl
            </Button>
            <Button
              size="sm"
              onClick={handleReset}
              className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white text-xs px-5"
            >
              Start New Journey
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center py-4">
          {/* Circular SVG Timer with Animated Gradient */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
              {/* Background Track */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="text-[#1E293B]"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Gradient */}
              <defs>
                <linearGradient id="cosmicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="50%" stopColor="#7E22CE" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>
              <circle
                cx="110"
                cy="110"
                r={radius}
                stroke="url(#cosmicGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            {/* Center Content: Time & Breath Pacer */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {boxBreathingActive ? (
                <div className="space-y-1">
                  <span className="text-3xl font-space font-bold text-white tracking-wider">
                    {formatTime(secondsRemaining)}
                  </span>
                  <div className="pt-1">
                    <span
                      className={`text-xs font-mono uppercase font-bold tracking-widest ${
                        breathingPhase === 'inhale'
                          ? 'text-sky-400'
                          : breathingPhase === 'hold-in'
                          ? 'text-purple-300'
                          : breathingPhase === 'exhale'
                          ? 'text-pink-400'
                          : 'text-amber-300'
                      }`}
                    >
                      {breathingPhase === 'inhale' && 'Inhale'}
                      {breathingPhase === 'hold-in' && 'Hold'}
                      {breathingPhase === 'exhale' && 'Exhale'}
                      {breathingPhase === 'hold-out' && 'Hold'}
                    </span>
                    <span className="text-xs text-gray-400 ml-1.5">({breathCount}s)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-4xl font-space font-bold text-white tracking-wider drop-shadow-md">
                    {formatTime(secondsRemaining)}
                  </span>
                  <p className="text-[11px] text-purple-300/80 uppercase font-mono tracking-wider">
                    {timerState === 'running' ? 'In Cosmic Flow' : timerState === 'paused' ? 'Session Paused' : 'Ready'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Duration Preset Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-6 w-full">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSelectPreset(preset.minutes)}
                disabled={timerState === 'running'}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedDuration === preset.minutes
                    ? 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white shadow-md shadow-purple-900/40 font-bold'
                    : 'bg-[#1E293B] text-gray-400 hover:text-white hover:bg-[#334155] border border-white/5'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            {timerState === 'running' ? (
              <Button
                onClick={handlePause}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-10 px-6 font-medium shadow-md shadow-amber-900/30"
              >
                <Pause className="w-4 h-4 mr-1.5" />
                Pause
              </Button>
            ) : (
              <Button
                onClick={handleStart}
                className="bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-10 px-7 font-medium shadow-lg shadow-purple-900/40"
              >
                <Play className="w-4 h-4 mr-1.5 fill-current" />
                {timerState === 'paused' ? 'Resume' : 'Begin Journey'}
              </Button>
            )}

            {(timerState === 'running' || timerState === 'paused' || secondsRemaining < totalSeconds) && (
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-white/10 text-gray-300 hover:bg-white/5 text-xs h-10 px-4"
                title="Reset Session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => cosmicAudio.playBowlChime(528)}
              className="border-white/10 text-purple-300 hover:bg-purple-950/30 text-xs h-10 px-3.5"
              title="Test Tibetan Singing Bowl Chime"
            >
              <Bell className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Soundscape & Audio Controls */}
      <div className="mt-8 pt-5 border-t border-white/5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Procedural Soundscape
            </span>
            <span className="text-[11px] text-gray-500 font-mono">100% Web Audio Synthesizer</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SOUNDSCAPES.map((sound) => (
              <button
                key={sound.id}
                onClick={() => handleSoundscapeChange(sound.id)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  selectedSoundscape === sound.id
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-sm shadow-purple-500/20'
                    : 'bg-[#1E293B]/70 border-white/5 text-gray-400 hover:text-gray-200 hover:bg-[#1E293B]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">{sound.label}</span>
                  <span className="text-sm">{sound.icon}</span>
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1">{sound.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Volume & Interval Bell Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {/* Volume Slider */}
          <div className="flex items-center gap-2.5 w-full sm:w-1/2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle mute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-purple-400" />
              )}
            </button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={(val) => handleVolumeChange(val[0])}
              min={0}
              max={1}
              step={0.05}
              className="flex-1 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-gray-400 w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>

          {/* Interval Bell Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-gray-400 font-mono">Interval Bell:</span>
            {(['off', '1m', '5m'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setIntervalBellOption(opt)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                  intervalBellOption === opt
                    ? 'bg-purple-800 text-white font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {opt === 'off' ? 'None' : `Every ${opt}`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
