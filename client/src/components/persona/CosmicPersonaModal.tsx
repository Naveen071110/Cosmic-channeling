import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Orbit,
  Radio,
  Telescope,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Globe,
  Star,
  RefreshCw,
} from 'lucide-react';
import { COSMIC_QUESTIONNAIRE } from '@/lib/persona/questions';
import { calculatePersona } from '@/lib/persona/engine';
import { CosmicElement, QuestionnaireAnswers, CosmicPersona } from '@/lib/persona/types';
import { useCosmicPersona } from '@/lib/persona/storage';
import { useToast } from '@/hooks/use-toast';

interface CosmicPersonaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string | number | null;
  onCompleted?: (persona: CosmicPersona) => void;
}

const ELEMENT_CHOICES: { element: CosmicElement; label: string; sub: string; icon: any; color: string }[] = [
  {
    element: 'Fire',
    label: 'Fire (Solar Flame)',
    sub: 'Aries, Leo, Sagittarius • Radiant passion & courage',
    icon: Flame,
    color: 'text-amber-400',
  },
  {
    element: 'Water',
    label: 'Water (Lunar Tides)',
    sub: 'Cancer, Scorpio, Pisces • Intuitive flow & empathy',
    icon: Droplets,
    color: 'text-sky-400',
  },
  {
    element: 'Air',
    label: 'Air (Astral Winds)',
    sub: 'Gemini, Libra, Aquarius • Cosmic curiosity & intellect',
    icon: Wind,
    color: 'text-purple-400',
  },
  {
    element: 'Earth',
    label: 'Earth (Stardust Matter)',
    sub: 'Taurus, Virgo, Capricorn • Grounded stability & resilience',
    icon: Mountain,
    color: 'text-emerald-400',
  },
  {
    element: 'Ether',
    label: 'Ether (Quantum Fabric)',
    sub: 'Multidimensional • Spacetime unity & crown consciousness',
    icon: Globe,
    color: 'text-pink-400',
  },
];

export default function CosmicPersonaModal({
  open,
  onOpenChange,
  userId,
  onCompleted,
}: CosmicPersonaModalProps) {
  const { updatePersona } = useCosmicPersona(userId);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    horizon: 0,
    sound: 0,
    hour: 0,
    reflection: 0,
    element: 'Air',
  });

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [revealedPersona, setRevealedPersona] = useState<CosmicPersona | null>(null);

  const totalSteps = COSMIC_QUESTIONNAIRE.length;
  const currentQuestion = COSMIC_QUESTIONNAIRE[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSelectChoice = (choiceIndex: number) => {
    if (currentStep === 0) setAnswers((prev) => ({ ...prev, horizon: choiceIndex }));
    else if (currentStep === 1) setAnswers((prev) => ({ ...prev, sound: choiceIndex }));
    else if (currentStep === 2) setAnswers((prev) => ({ ...prev, hour: choiceIndex }));
    else if (currentStep === 3) setAnswers((prev) => ({ ...prev, reflection: choiceIndex }));
  };

  const handleSelectElement = (elem: CosmicElement) => {
    setAnswers((prev) => ({ ...prev, element: elem }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishAssessment();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const finishAssessment = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const calculated = calculatePersona(answers);
      updatePersona(calculated);
      setRevealedPersona(calculated);
      setIsCalculating(false);
      if (onCompleted) {
        onCompleted(calculated);
      }
      toast({
        title: `Alignment Revealed: ${calculated.archetype.title}`,
        description: `Your celestial persona has been calculated and synced to your profile.`,
      });
    }, 1400);
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after transition
    setTimeout(() => {
      setRevealedPersona(null);
      setCurrentStep(0);
      setIsCalculating(false);
    }, 300);
  };

  const getSelectedChoiceId = () => {
    if (currentStep === 0) return answers.horizon;
    if (currentStep === 1) return answers.sound;
    if (currentStep === 2) return answers.hour;
    if (currentStep === 3) return answers.reflection;
    return 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[92vh] overflow-y-auto bg-[#0B0F19]/95 backdrop-blur-2xl border-purple-500/40 text-white p-6 shadow-[0_0_50px_rgba(147,51,234,0.25)]">
        {/* State 1: Calculating Ceremony */}
        {isCalculating ? (
          <div className="py-16 text-center space-y-6 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-purple-900/60 border border-purple-400/50 flex items-center justify-center mx-auto text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <Orbit className="w-10 h-10 animate-spin text-purple-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-space font-bold text-white">Synthesizing Celestial Resonances...</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                Aligning your acoustic frequency, elemental signature, and circadian rhythms with deep-space telemetry.
              </p>
            </div>
          </div>
        ) : revealedPersona ? (
          /* State 2: Reveal Ceremony */
          <div className="py-6 space-y-6 text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Celestial Identity Revealed</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-space font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 bg-clip-text text-transparent">
                You are {revealedPersona.archetype.title}
              </h2>
              <p className="text-sm font-space text-purple-300">{revealedPersona.archetype.subtitle}</p>
            </div>

            <Card className="bg-[#0F172A]/90 border-purple-500/30 p-5 text-left space-y-4 shadow-xl">
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {revealedPersona.archetype.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs">
                <div className="p-2.5 rounded-lg bg-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Element</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Star className="w-3 h-3 text-pink-400" />
                    {revealedPersona.element}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Ruling Tone</span>
                  <p className="font-bold text-white flex items-center gap-1">
                    <Radio className="w-3 h-3 text-sky-400" />
                    {revealedPersona.rulingFrequency} Hz
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-gray-400 uppercase font-mono">Patron Cosmos</span>
                  <p className="font-bold text-white truncate flex items-center gap-1">
                    <Telescope className="w-3 h-3 text-yellow-400" />
                    {revealedPersona.archetype.patronCelestialBody.split('(')[0]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {revealedPersona.archetype.traits.map((t, idx) => (
                  <Badge key={idx} className="bg-purple-950/60 text-purple-300 border-purple-500/30 text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={handleClose}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-medium text-xs h-10 px-8 shadow-lg shadow-purple-900/40"
              >
                View Full Profile &amp; Directives
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* State 3: Active Questionnaire Steps */
          <div className="space-y-6">
            <DialogHeader className="text-left space-y-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[11px] font-mono">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>Step {currentStep + 1} of {totalSteps}</span>
                </div>
                <span className="text-xs font-mono text-gray-400">{progressPercent}% complete</span>
              </div>

              <Progress value={progressPercent} className="h-1.5 bg-[#1E293B]" />

              <DialogTitle className="text-lg sm:text-xl font-space font-bold text-white pt-2">
                {currentQuestion.question}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-400 leading-relaxed">
                {currentQuestion.context}
              </DialogDescription>
            </DialogHeader>

            {/* Step 5: Element Selection */}
            {currentStep === 4 ? (
              <div className="space-y-2.5">
                {ELEMENT_CHOICES.map((elem) => {
                  const Icon = elem.icon;
                  const isSelected = answers.element === elem.element;
                  return (
                    <div
                      key={elem.element}
                      onClick={() => handleSelectElement(elem.element)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
                          : 'bg-[#0F172A]/80 border-[#334155] hover:border-purple-500/40 hover:bg-[#1E293B]/70'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0 ${elem.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{elem.label}</h4>
                        <p className="text-[11px] text-gray-400 truncate">{elem.sub}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Steps 1-4: Choice Cards */
              <div className="space-y-2.5">
                {currentQuestion.choices.map((choice) => {
                  const isSelected = getSelectedChoiceId() === choice.id;
                  return (
                    <div
                      key={choice.id}
                      onClick={() => handleSelectChoice(choice.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
                          : 'bg-[#0F172A]/80 border-[#334155] hover:border-purple-500/40 hover:bg-[#1E293B]/70'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold ${
                        isSelected ? 'border-purple-400 bg-purple-600 text-white' : 'border-gray-500 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + choice.id)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug">{choice.label}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{choice.sublabel}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="border-white/10 text-xs text-gray-300 hover:bg-white/5"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Skip for Now
                </Button>

                <Button
                  size="sm"
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 shadow-md shadow-purple-900/40"
                >
                  {currentStep < totalSteps - 1 ? (
                    <>
                      Next Step
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  ) : (
                    <>
                      Reveal My Alignment
                      <Sparkles className="w-3.5 h-3.5 ml-1 text-yellow-300" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
