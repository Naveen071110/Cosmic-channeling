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
      setCurrentAnswer(''); // Reset current answer for the next question
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Restore previous answer
      setCurrentAnswer(answers[quizQuestions[currentQuestionIndex - 1].id] || '');
    }
  };

  const completeQuiz = async () => {
    // Save the final answer
    const finalAnswers = {
      ...answers,
      [quizQuestions[currentQuestionIndex].id]: currentAnswer
    };
    
    setSubmitting(true);
    
    try {
      // Try to get results from API
      const response = await apiRequest('POST', '/api/quiz-results', { answers: finalAnswers });
      const data = await response.json();
      setQuizResult(data);
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
    <section className="my-16 max-w-3xl mx-auto">
      <h2 className="text-2xl font-space font-bold text-center mb-6">Discover Your Cosmic Identity</h2>
      <p className="text-center text-[#F1F5F9] mb-8">Take our 5-question personality quiz to reveal your cosmic archetype</p>
      
      <div className="bg-[#1E293B] rounded-xl overflow-hidden border border-[#334155] shadow-lg p-6">
        {!quizComplete ? (
          <div className="space-y-6">
            <div className="bg-[#0F172A] p-4 rounded-md border border-[#334155]">
              <h3 className="font-medium mb-3">{quizQuestions[currentQuestionIndex].question}</h3>
              
              <RadioGroup 
                value={currentAnswer}
                onValueChange={setCurrentAnswer}
                className="space-y-2"
              >
                {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                  <div key={index} className="p-2 rounded hover:bg-[#334155] transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        className="accent-[#7E22CE]" 
                      />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-[#64748B]">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <div className="w-full bg-[#334155] h-1.5 rounded-full mt-2">
                <div 
                  className="bg-[#7E22CE] h-full rounded-full" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`bg-[#334155] text-[#F1F5F9] py-2 px-4 rounded-md transition-colors ${
                  currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#475569]'
                }`}
              >
                Previous
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={!currentAnswer}
                className="bg-[#7E22CE] hover:bg-purple-800 text-white py-2 px-6 rounded-md transition-colors"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            {submitting ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7E22CE] mb-4"></div>
                <p>Consulting the cosmic forces...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="w-24 h-24 rounded-full bg-[#7E22CE]/20 mx-auto flex items-center justify-center mb-4">
                    <i className="ri-sparkle-fill text-4xl text-[#EC4899]"></i>
                  </div>
                  <h3 className="text-2xl font-space font-bold text-[#F1F5F9] mb-2">
                    You are a {quizResult?.title}
                  </h3>
                  <p className="text-[#F1F5F9] mb-6">{quizResult?.description}</p>
                  
                  <div className="inline-block bg-[#7E22CE]/20 text-[#7E22CE] px-3 py-1.5 rounded-full text-sm">
                    {quizResult?.archetype} Archetype
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    onClick={resetQuiz}
                    className="bg-[#334155] hover:bg-[#475569] text-[#F1F5F9] py-2 px-4 rounded-md transition-colors"
                  >
                    Retake Quiz
                  </Button>
                  
                  <Button 
                    className="bg-[#EC4899] hover:bg-pink-600 text-white py-2 px-6 rounded-md transition-colors"
                  >
                    <i className="ri-share-line mr-2"></i> Share Results
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SpiritualSpaceQuiz;
