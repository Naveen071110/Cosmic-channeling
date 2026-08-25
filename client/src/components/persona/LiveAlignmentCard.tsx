import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Radio,
  BookOpen,
  Telescope,
  Moon,
  Clock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { CosmicPersona } from '@/lib/persona/types';
import { calculateDailyAlignment } from '@/lib/persona/engine';
import { useLocation } from 'wouter';

interface LiveAlignmentCardProps {
  persona: CosmicPersona;
}

export default function LiveAlignmentCard({ persona }: LiveAlignmentCardProps) {
  const [, setLocation] = useLocation();

  const alignment = useMemo(() => {
    return calculateDailyAlignment(persona);
  }, [persona]);

  const handleLaunchMeditation = () => {
    setLocation('/meditate');
  };

  const handleOpenJournal = () => {
    setLocation('/journal');
  };

  return (
    <Card className="bg-gradient-to-br from-[#0F172A] via-[#1A102F] to-[#0F172A] border-purple-500/40 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
      <CardHeader className="p-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <CardTitle className="text-lg font-space font-bold text-white">
                Live Cosmic Alignment Today
              </CardTitle>
              <p className="text-[11px] text-gray-400 font-mono">Real-Time Astronomical Resonance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-mono text-xs px-3 py-1 shadow-md shadow-purple-950/80">
              {alignment.alignmentScore}% Resonance
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-5 text-sm">
        {/* Today's Directive */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Today's Cosmic Directive</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
            {alignment.directive}
          </p>
        </div>

        {/* Daily Affirmation */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Daily Alignment Affirmation</span>
          <p className="text-xs italic text-purple-200">
            "{alignment.affirmation}"
          </p>
        </div>

        {/* Astronomical Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
            <Radio className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono">Optimal Tone</span>
              <p className="font-semibold text-white">{alignment.frequencyLabel}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-mono">Peak Alignment Window</span>
              <p className="font-semibold text-white truncate">{alignment.optimalMeditationTime}</p>
            </div>
          </div>
        </div>

        {/* Tailored Journal Prompt */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-[#334155] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-teal-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Tailored Astro-Journal Prompt
            </span>
          </div>
          <p className="text-xs text-gray-300 italic">
            "{alignment.journalPrompt}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button
            onClick={handleLaunchMeditation}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-10 shadow-md shadow-purple-950/60"
          >
            <Radio className="w-3.5 h-3.5 mr-1.5" />
            Launch {persona.rulingFrequency}Hz Soundscape
          </Button>

          <Button
            variant="outline"
            onClick={handleOpenJournal}
            className="border-purple-500/40 hover:bg-purple-950/40 text-purple-300 text-xs h-10"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Write in Astro-Journal
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
