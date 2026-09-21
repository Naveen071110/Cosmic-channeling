import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Award } from 'lucide-react';

export default function AstralTest() {
  const [stage, setStage] = useState<'start' | 'test' | 'results'>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{
    score: number;
    level: string;
    description: string;
    abilities: string[];
  } | null>(null);
  
  // Questions for the test
  const questions = [
    {
      id: 1,
      text: "How often do you meditate or practice mindfulness?",
      options: [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "rarely", label: "Rarely or never" }
      ]
    },
    {
      id: 2,
      text: "How often do you experience vivid dreams that you can remember in detail?",
      options: [
        { value: "always", label: "Almost every night" },
        { value: "often", label: "Often (1-3 times/week)" },
        { value: "sometimes", label: "Sometimes (1-3 times/month)" },
        { value: "rarely", label: "Rarely or never" }
      ]
    },
    {
      id: 3,
      text: "How frequently do you notice meaningful coincidences or synchronicities in your life?",
      options: [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "rarely", label: "Rarely or never" }
      ]
    },
    {
      id: 4,
      text: "How would you rate the strength of your intuition?",
      options: [
        { value: "very-strong", label: "Very strong - My intuition is almost always right" },
        { value: "strong", label: "Strong - I often sense things before they happen" },
        { value: "moderate", label: "Moderate - I sometimes get intuitive insights" },
        { value: "weak", label: "Minimal - I rarely experience intuitive guidance" }
      ]
    },
    {
      id: 5,
      text: "Have you ever had an experience that felt like a connection to something beyond the physical world?",
      options: [
        { value: "frequently", label: "Yes, frequently" },
        { value: "occasionally", label: "Yes, occasionally" },
        { value: "once", label: "Yes, once or twice" },
        { value: "never", label: "No, never" }
      ]
    }
  ];
  
  // Calculate the progress percentage
  const progressPercentage = (currentQuestion / questions.length) * 100;
  
  // Handle starting the test
  const startTest = () => {
    setStage('test');
    setCurrentQuestion(0);
    setAnswers({});
  };
  
  // Handle selecting an answer
  const selectAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value
    });
    
    // Move to next question or show results if done
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };
  
  // Calculate test results
  const calculateResults = () => {
    // Score mapping for each answer
    const scoreMap: Record<string, number> = {
      daily: 20, weekly: 15, monthly: 10, rarely: 5,
      always: 20, often: 15, sometimes: 10,
      'very-strong': 20, strong: 15, moderate: 10, weak: 5,
      frequently: 20, occasionally: 15, once: 10, never: 5
    };
    
    // Calculate total score
    let totalScore = 0;
    Object.values(answers).forEach(answer => {
      totalScore += scoreMap[answer] || 0;
    });
    
    // Normalize score to 0-100 range
    const normalizedScore = Math.min(100, (totalScore / (questions.length * 20)) * 100);
    
    // Determine level based on score
    let level = '';
    let description = '';
    let abilities: string[] = [];
    
    if (normalizedScore >= 80) {
      level = 'Cosmic Adept';
      description = 'You have an exceptionally strong connection to the cosmic consciousness. Your astral sensitivity is well-developed, allowing you to access higher dimensions of reality with ease.';
      abilities = ['Astral Projection', 'Remote Viewing', 'Energy Healing', 'Conscious Channeling'];
    } else if (normalizedScore >= 60) {
      level = 'Astral Explorer';
      description = 'You have a strong cosmic connection that is continuing to develop. You regularly sense energies and patterns beyond the physical realm.';
      abilities = ['Lucid Dreaming', 'Intuitive Guidance', 'Energy Sensing', 'Cosmic Pattern Recognition'];
    } else if (normalizedScore >= 40) {
      level = 'Cosmic Seeker';
      description = 'You have a moderate cosmic connection with significant potential for growth. Your awareness of subtle energies and patterns is awakening.';
      abilities = ['Enhanced Intuition', 'Dream Memory', 'Subtle Energy Awareness', 'Synchronicity Recognition'];
    } else {
      level = 'Spiritual Novice';
      description = 'You are at the beginning of your cosmic journey with an emerging connection to higher consciousness. Your spiritual potential is waiting to be unlocked.';
      abilities = ['Intuitive Flashes', 'Energy Sensitivity', 'Meaningful Dreams', 'Cosmic Curiosity'];
    }
    
    setResult({
      score: Math.round(normalizedScore),
      level,
      description,
      abilities
    });
    
    setStage('results');
  };
  
  // Reset the test
  const resetTest = () => {
    setStage('start');
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-md rounded-2xl shadow-none">
        <CardHeader className="pb-4 border-b border-white/[0.06]">
          <CardTitle className="text-xl font-semibold font-space text-[#F8FAFC] flex items-center">
            <Star className="mr-2 h-4 w-4 text-slate-300" />
            Astral Connection Test
          </CardTitle>
          <CardDescription className="text-xs text-[#94A3B8] font-normal">
            Discover your cosmic connection strength and astral potential
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          {stage === 'start' && (
            <div className="text-center py-6 space-y-6">
              <Sparkles className="mx-auto h-12 w-12 text-slate-300" />
              <div className="space-y-2">
                <h3 className="text-xl font-medium font-space text-[#F8FAFC]">Measure Your Cosmic Connection</h3>
                <p className="text-sm text-[#94A3B8] max-w-lg mx-auto leading-relaxed">
                  This quick assessment will help you understand your natural connection to cosmic energies
                  and identify your spiritual strengths and potential abilities.
                </p>
              </div>
              <Button 
                onClick={startTest}
                className="bg-white text-black hover:bg-slate-200 font-medium rounded-xl h-11 px-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer mt-2"
              >
                Begin Assessment
              </Button>
            </div>
          )}
          
          {stage === 'test' && (
            <div className="space-y-6">
              <div className="mb-4">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-[#94A3B8]">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="text-slate-300">{progressPercentage}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-1.5 bg-white/[0.06]" />
              </div>
              
              <div>
                <h3 className="text-base sm:text-lg font-medium font-space text-[#F8FAFC] mb-4">
                  {questions[currentQuestion].text}
                </h3>
                
                <RadioGroup className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div 
                      key={option.value} 
                      onClick={() => selectAnswer(option.value)}
                      className="flex items-center space-x-3 p-3.5 rounded-xl border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-pointer"
                    >
                      <RadioGroupItem 
                        id={option.value} 
                        value={option.value}
                        className="border-white/30 text-white"
                      />
                      <Label htmlFor={option.value} className="text-sm text-[#E2E8F0] cursor-pointer font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
          
          {stage === 'results' && result && (
            <div className="space-y-6 py-2">
              <div className="text-center">
                <Award className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="text-2xl font-semibold font-space text-[#F8FAFC] mt-4">
                  {result.level}
                </h3>
                <div className="mt-3">
                  <span className="text-5xl font-semibold font-space text-white tracking-tight">
                    {result.score}%
                  </span>
                  <p className="text-xs text-[#94A3B8] mt-1 font-mono uppercase tracking-wider">Cosmic Connection Strength</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-[#94A3B8] leading-relaxed text-center max-w-lg mx-auto">{result.description}</p>
              </div>
              
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-3 text-center">Potential Abilities</h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {result.abilities.map((ability, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-white/[0.03] text-slate-200 border-white/10 font-mono text-xs py-1 px-3"
                    >
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {stage === 'results' && (
          <CardFooter className="border-t border-white/[0.06] pt-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={resetTest}
              className="border-white/15 hover:bg-white/[0.06] text-white rounded-xl h-9 px-5 text-xs font-medium backdrop-blur-sm"
            >
              Take Test Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}