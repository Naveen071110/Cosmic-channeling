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
      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Star className="mr-2 h-5 w-5 text-purple-400" />
            Astral Connection Test
          </CardTitle>
          <CardDescription>
            Discover your cosmic connection strength and astral potential
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {stage === 'start' && (
            <div className="text-center py-6 space-y-6">
              <Sparkles className="mx-auto h-16 w-16 text-purple-400" />
              <div>
                <h3 className="text-xl font-medium text-white mb-2">Measure Your Cosmic Connection</h3>
                <p className="text-gray-300 max-w-lg mx-auto">
                  This quick assessment will help you understand your natural connection to cosmic energies
                  and identify your spiritual strengths and potential abilities.
                </p>
              </div>
              <Button 
                onClick={startTest}
                className="bg-purple-700 hover:bg-purple-800 mt-4"
              >
                Begin Assessment
              </Button>
            </div>
          )}
          
          {stage === 'test' && (
            <div className="space-y-6">
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Question {currentQuestion + 1} of {questions.length}</span>
                  <span className="text-purple-400">{progressPercentage}% Complete</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-gray-800" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4">
                  {questions[currentQuestion].text}
                </h3>
                
                <RadioGroup className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        id={option.value} 
                        value={option.value}
                        onClick={() => selectAnswer(option.value)}
                        className="border-purple-500"
                      />
                      <Label htmlFor={option.value} className="text-gray-200">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}
          
          {stage === 'results' && result && (
            <div className="space-y-6">
              <div className="text-center">
                <Award className="mx-auto h-16 w-16 text-purple-400" />
                <h3 className="text-2xl font-medium text-white mt-4">
                  {result.level}
                </h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-purple-400">
                    {result.score}%
                  </span>
                  <p className="text-gray-400 mt-1">Cosmic Connection Strength</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-300">{result.description}</p>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-white mb-2">Potential Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {result.abilities.map((ability, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-purple-900/20 text-purple-300 border-purple-500/30"
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
          <CardFooter className="border-t border-gray-800 pt-4 flex justify-center">
            <Button
              variant="default"
              size="sm"
              onClick={resetTest}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Take Test Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}