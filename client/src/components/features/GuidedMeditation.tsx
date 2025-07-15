import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Star, Moon, Sun, Waves } from 'lucide-react';

interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  theme: 'cosmic' | 'nature' | 'energy' | 'mindfulness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ReactNode;
  script: string[];
}

const meditationSessions: MeditationSession[] = [
  {
    id: 'cosmic-journey',
    title: 'Cosmic Journey',
    description: 'Travel through the cosmos and connect with universal energy',
    duration: 10,
    theme: 'cosmic',
    difficulty: 'beginner',
    icon: <Star className="w-5 h-5" />,
    script: [
      "Welcome to your cosmic journey. Find a comfortable position and close your eyes.",
      "Take three deep breaths, feeling your body relax with each exhale.",
      "Imagine yourself floating gently in the vastness of space.",
      "See the Earth below you, a beautiful blue marble in the cosmic void.",
      "Feel yourself surrounded by countless stars, each one a source of ancient light.",
      "Allow the cosmic energy to flow through you, connecting you to all of existence.",
      "Rest in this space of infinite possibility and universal connection.",
      "When you're ready, slowly bring your awareness back to your body.",
      "Take a few deep breaths and gently open your eyes."
    ]
  },
  {
    id: 'moon-phases',
    title: 'Moon Phase Meditation',
    description: 'Align with lunar energy and inner cycles of transformation',
    duration: 8,
    theme: 'cosmic',
    difficulty: 'intermediate',
    icon: <Moon className="w-5 h-5" />,
    script: [
      "Close your eyes and breathe deeply, centering yourself in this moment.",
      "Visualize the moon in your mind's eye, glowing softly in the darkness.",
      "Feel its gentle pull, the same force that moves the oceans.",
      "Notice how this lunar energy flows through your own body.",
      "Like the moon, you too have cycles of growth and release.",
      "Embrace both your light and shadow aspects with compassion.",
      "Allow the moon's wisdom to guide your inner transformation.",
      "Rest in the peaceful energy of lunar consciousness.",
      "Slowly return to the present moment when you feel ready."
    ]
  },
  {
    id: 'solar-energy',
    title: 'Solar Energy Activation',
    description: 'Harness the power of solar energy for vitality and clarity',
    duration: 6,
    theme: 'energy',
    difficulty: 'beginner',
    icon: <Sun className="w-5 h-5" />,
    script: [
      "Sit tall and imagine golden sunlight streaming down from above.",
      "Feel this warm, healing light entering through the top of your head.",
      "Let it flow down through your body, energizing every cell.",
      "Your heart center glows with this radiant solar energy.",
      "Feel your personal power and clarity awakening.",
      "You are connected to the life-giving force of our star.",
      "Carry this solar light with you throughout your day.",
      "Gently bring your attention back to your breath and surroundings."
    ]
  },
  {
    id: 'cosmic-waves',
    title: 'Cosmic Sound Waves',
    description: 'Ride the vibrational frequencies of the universe',
    duration: 12,
    theme: 'nature',
    difficulty: 'advanced',
    icon: <Waves className="w-5 h-5" />,
    script: [
      "Begin by listening to the silence around you.",
      "In this silence, become aware of subtle vibrations.",
      "These are the cosmic sound waves that permeate all existence.",
      "Feel your body as a resonating chamber for these frequencies.",
      "Allow these cosmic vibrations to tune your entire being.",
      "You are both the listener and the instrument.",
      "Rest in the harmony of universal sound.",
      "Let these frequencies heal and align your energy centers.",
      "Notice how you feel more connected to the cosmic symphony.",
      "Slowly return your awareness to ordinary sound and sensation."
    ]
  }
];

const GuidedMeditation = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const themeColors = {
    cosmic: 'from-purple-500 to-blue-600',
    nature: 'from-green-500 to-teal-600',
    energy: 'from-yellow-500 to-orange-600',
    mindfulness: 'from-indigo-500 to-purple-600'
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  useEffect(() => {
    // Create ambient cosmic sound
    if (typeof window !== 'undefined') {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      audioRef.current = {
        start: () => oscillator.start(),
        stop: () => oscillator.stop(),
        context: audioContext
      } as any;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (speechRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && selectedSession) {
      intervalRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, selectedSession]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 0.9;
      utterance.volume = isMuted ? 0 : volume;
      
      speechRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const startSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setCurrentStep(0);
    setTimeElapsed(0);
    setIsPlaying(true);
    
    // Start with first instruction
    setTimeout(() => {
      speakText(session.script[0]);
    }, 1000);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying && selectedSession && selectedSession.script[currentStep]) {
      speakText(selectedSession.script[currentStep]);
    } else {
      speechSynthesis.cancel();
    }
  };

  const nextStep = () => {
    if (selectedSession && currentStep < selectedSession.script.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      speakText(selectedSession.script[nextStepIndex]);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      speakText(selectedSession.script[prevStepIndex]);
    }
  };

  const resetSession = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeElapsed(0);
    speechSynthesis.cancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (selectedSession) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${themeColors[selectedSession.theme]}`}>
                {selectedSession.icon}
              </div>
              <div>
                <CardTitle className="text-white">{selectedSession.title}</CardTitle>
                <p className="text-slate-400 text-sm">{selectedSession.description}</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedSession(null)}
              className="text-slate-400 hover:text-white"
            >
              ← Back
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress and Timer */}
          <div className="text-center space-y-2">
            <div className="text-3xl font-space text-white">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-sm text-slate-400">
              Step {currentStep + 1} of {selectedSession.script.length}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${themeColors[selectedSession.theme]} transition-all duration-300`}
                style={{ width: `${((currentStep + 1) / selectedSession.script.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Instruction */}
          <Card className="bg-slate-900 border-slate-600">
            <CardContent className="pt-6">
              <p className="text-slate-200 text-center italic">
                "{selectedSession.script[currentStep]}"
              </p>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={previousStep}
              disabled={currentStep === 0}
              className="border-slate-600 text-slate-300"
            >
              Previous
            </Button>
            
            <Button
              onClick={togglePlayPause}
              className={`bg-gradient-to-r ${themeColors[selectedSession.theme]} hover:opacity-90`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={nextStep}
              disabled={currentStep === selectedSession.script.length - 1}
              className="border-slate-600 text-slate-300"
            >
              Next
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={resetSession}
              className="border-slate-600 text-slate-300"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              step={0.1}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Guided Meditations</h2>
        <p className="text-slate-400">Journey through consciousness with cosmic guidance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meditationSessions.map((session) => (
          <Card 
            key={session.id} 
            className="bg-slate-800 border-slate-700 hover:border-purple-500 transition-all duration-300 cursor-pointer"
            onClick={() => startSession(session)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${themeColors[session.theme]}`}>
                    {session.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{session.title}</CardTitle>
                    <p className="text-slate-400 text-sm">{session.description}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={difficultyColors[session.difficulty]}>
                    {session.difficulty}
                  </Badge>
                  <span className="text-slate-400 text-sm">{session.duration} min</span>
                </div>
                <Button size="sm" className={`bg-gradient-to-r ${themeColors[session.theme]}`}>
                  Start Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GuidedMeditation;