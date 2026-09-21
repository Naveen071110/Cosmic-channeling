import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

interface QuizResult {
  title: string;
  description: string;
  archetype: string;
}

const SpiritualSpaceQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Sample quiz questions - in a real app these would come from an API
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "When gazing at the night sky, what draws your attention most?",
      options: [
        "The patterns of constellations and their stories",
        "The vastness and infinite possibilities",
        "The scientific wonders and celestial mechanics",
        "The potential for other intelligent life"
      ]
    },
    {
      id: 2,
      question: "How do you prefer to explore cosmic ideas?",
      options: [
        "Through meditation and inner journeys",
        "By reading scientific articles and studies",
        "Watching documentaries about space",
        "Discussing philosophical questions with others"
      ]
    },
    {
      id: 3,
      question: "If you could have one cosmic ability, what would it be?",
      options: [
        "To travel instantly to any point in the universe",
        "To communicate with cosmic consciousness",
        "To understand all physical laws of the universe",
        "To see the past and future of celestial objects"
      ]
    },
    {
      id: 4,
      question: "What aspect of existence most fascinates you?",
      options: [
        "The possibility of multiple dimensions",
        "The interconnectedness of all things",
        "The physical laws that govern reality",
        "The possibility of life beyond Earth"
      ]
    },
    {
      id: 5,
      question: "What do you seek most from your cosmic journey?",
      options: [
        "Spiritual enlightenment",
        "Scientific understanding",
        "Wonder and inspiration",
        "Connection with something greater"
      ]
    }
  ];

  const handleNext = () => {
    if (!currentAnswer) {
      toast({
        title: "Please select an answer",
        description: "Choose one of the options before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    // Save current answer
    setAnswers({
      ...answers,
      [quizQuestions[currentQuestionIndex].id]: currentAnswer
    });
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Reset current answer if the next question hasn't been answered yet
      setCurrentAnswer(answers[quizQuestions[currentQuestionIndex + 1]?.id] || '');
    } else {
      submitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setCurrentAnswer(answers[quizQuestions[currentQuestionIndex - 1].id] || '');
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await apiRequest('POST', '/api/quiz/submit', { answers });
      // const data = await response.json();
      // setQuizResult(data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Temporary logic to determine result based on answers
      // This would normally be handled by the backend
      const resultTypes: Record<string, QuizResult> = {
        Seeker: {
          title: "Stellar Seeker",
          description: "You are drawn to the mysteries of the cosmos and seek spiritual growth through cosmic connection. Your intuitive nature helps you perceive patterns others miss.",
          archetype: "Seeker"
        },
        Explorer: {
          title: "Quantum Explorer",
          description: "You blend scientific curiosity with spiritual openness. You're fascinated by the quantum nature of reality and how consciousness interacts with the physical world.",
          archetype: "Explorer"
        },
        Sage: {
          title: "Cosmic Sage",
          description: "Your wisdom comes from understanding the interconnectedness of all things. You see the universe as a living entity and yourself as an integral part of it.",
          archetype: "Sage"
        }
      };
      
      // Simple selection logic for demo purposes
      const archetypes = Object.keys(resultTypes);
      const randomArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
      setQuizResult(resultTypes[randomArchetype]);
      
    } catch (error) {
      console.error('Error getting quiz results:', error);
      
      // Fallback results if API fails
      const archetypes = [
        {
          title: "Stellar Seeker",
          description: "You are drawn to the mysteries of the cosmos and seek spiritual growth through cosmic connection. Your intuitive nature helps you perceive patterns others miss.",
          archetype: "Seeker"
        },
        {
          title: "Quantum Explorer",
          description: "You blend scientific curiosity with spiritual openness. You're fascinated by the quantum nature of reality and how consciousness interacts with the physical world.",
          archetype: "Explorer"
        },
        {
          title: "Cosmic Sage",
          description: "Your wisdom comes from understanding the interconnectedness of all things. You see the universe as a living entity and yourself as an integral part of it.",
          archetype: "Sage"
        }
      ];
      
      // Randomly assign an archetype for the fallback
      const randomIndex = Math.floor(Math.random() * archetypes.length);
      setQuizResult(archetypes[randomIndex]);
    } finally {
      setSubmitting(false);
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentAnswer('');
    setQuizComplete(false);
    setQuizResult(null);
  };

  const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <section className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-space tracking-tight text-[#F8FAFC]">
          Discover Your Cosmic Identity
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          Take our 5-question personality quiz to reveal your cosmic archetype
        </p>
      </div>
      
      <div className="bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.08] backdrop-blur-md p-6 sm:p-8 shadow-none">
        {!quizComplete ? (
          <div className="space-y-6">
            <div className="bg-white/[0.02] p-5 rounded-xl border border-white/[0.06]">
              <h3 className="font-medium font-space text-[#F8FAFC] text-base sm:text-lg mb-4">
                {quizQuestions[currentQuestionIndex].question}
              </h3>
              
              <RadioGroup 
                value={currentAnswer}
                onValueChange={setCurrentAnswer}
                className="space-y-2.5"
              >
                {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                  <div 
                    key={index} 
                    onClick={() => setCurrentAnswer(option)}
                    className="p-3.5 rounded-xl border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.02] transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        className="border-white/30 text-white" 
                      />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer text-sm text-[#E2E8F0] font-normal leading-relaxed">
                        {option}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-2 text-center">
              <span className="text-xs font-mono text-[#94A3B8]">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <div className="w-full bg-white/[0.06] h-1.5 rounded-full">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between pt-2">
              <Button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className={`border-white/15 bg-white/[0.02] text-slate-300 hover:text-white rounded-xl h-10 px-5 text-xs font-medium transition-colors ${
                  currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/[0.06]'
                }`}
              >
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={submitting}
                className="bg-white text-black hover:bg-slate-200 font-medium rounded-xl h-10 px-6 text-xs shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                {submitting ? 'Analyzing...' : currentQuestionIndex < quizQuestions.length - 1 ? 'Next' : 'Reveal Identity'}
              </Button>
            </div>
          </div>
        ) : (
          quizResult && (
            <div className="text-center py-6 space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#94A3B8]">Your Cosmic Archetype</span>
                <h3 className="text-2xl sm:text-3xl font-semibold font-space text-[#F8FAFC]">
                  {quizResult.title}
                </h3>
              </div>
              
              <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] max-w-xl mx-auto">
                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                  {quizResult.description}
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-white/15 hover:bg-white/[0.06] text-white rounded-xl h-10 px-6 text-xs font-medium backdrop-blur-sm"
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default SpiritualSpaceQuiz;
