import { useState } from 'react';
import { quizQuestions, QuizResult } from '@/data/quizQuestions';
import { cn } from '@/lib/utils';

export default function SpiritualSpaceQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showingResults, setShowingResults] = useState(false);
  
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  
  const handleAnswer = (choiceIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = choiceIndex;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateResult = () => {
    // Calculate the most common answer type
    const answerCounts = [0, 0, 0, 0]; // For 4 types
    
    answers.forEach(answer => {
      if (answer !== undefined) {
        answerCounts[answer]++;
      }
    });
    
    let maxCount = 0;
    let resultType = 0;
    
    answerCounts.forEach((count, index) => {
      if (count > maxCount) {
        maxCount = count;
        resultType = index;
      }
    });
    
    // Results map to specific cosmic identities
    const results: QuizResult[] = [
      { 
        title: "Stellar Seeker", 
        description: "You are drawn to the wonder and mystery of the cosmos. With an insatiable curiosity about the universe's secrets, you find meaning in exploring the unknown and connecting disparate ideas into new patterns of understanding.",
        traits: ["Curious", "Intuitive", "Philosophical"]
      },
      { 
        title: "Quantum Explorer", 
        description: "You perceive the underlying quantum nature of reality. You understand that consciousness and matter are interconnected, and you navigate life with an awareness of infinite possibilities and parallel paths.",
        traits: ["Analytical", "Perceptive", "Open-minded"]
      },
      { 
        title: "Cosmic Harmonizer", 
        description: "You sense the cosmic flow that connects all beings. With natural empathy and insight, you help others find their place in the universal pattern and bring balance to chaotic situations.",
        traits: ["Empathetic", "Balancing", "Insightful"]
      },
      { 
        title: "Galactic Visionary", 
        description: "You see beyond current limitations into future potentials. You're drawn to grand cosmic designs and often feel a mission to bring new ideas and innovations from the cosmos to earth.",
        traits: ["Visionary", "Creative", "Purpose-driven"]
      }
    ];
    
    setResult(results[resultType]);
    setShowingResults(true);
  };
  
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResult(null);
    setShowingResults(false);
  };

  return (
    <section className="my-16 max-w-3xl mx-auto">
      <h2 className="text-2xl font-space font-bold text-center mb-6">Discover Your Cosmic Identity</h2>
      <p className="text-center text-space-100 mb-8">Take our 5-question personality quiz to reveal your cosmic archetype</p>
      
      <div className="bg-space-900 rounded-xl overflow-hidden border border-space-800 shadow-lg p-6">
        {!showingResults ? (
          <div className="space-y-6">
            <div className="bg-space-950 p-4 rounded-md border border-space-800">
              <h3 className="font-medium mb-3">{currentQuestion.question}</h3>
              
              <div className="space-y-2">
                {currentQuestion.choices.map((choice, index) => (
                  <label 
                    key={index}
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded hover:bg-space-800 transition-colors cursor-pointer",
                      answers[currentQuestionIndex] === index ? "bg-space-800" : ""
                    )}
                  >
                    <input 
                      type="radio" 
                      name={`q${currentQuestionIndex}`} 
                      className="accent-cosmic-purple"
                      checked={answers[currentQuestionIndex] === index}
                      onChange={() => handleAnswer(index)}
                    />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-space-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
              <div className="w-full bg-space-800 h-1.5 rounded-full mt-2">
                <div 
                  className="bg-cosmic-purple h-full rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`${currentQuestionIndex === 0 ? 'bg-space-800 opacity-50 cursor-not-allowed' : 'bg-space-800 hover:bg-space-700'} text-space-100 py-2 px-4 rounded-md`}
              >
                Previous
              </button>
              
              <button 
                onClick={handleNext}
                disabled={answers[currentQuestionIndex] === undefined}
                className={`${answers[currentQuestionIndex] === undefined ? 'bg-space-800 opacity-50 cursor-not-allowed' : 'bg-cosmic-purple hover:bg-purple-800'} text-white py-2 px-6 rounded-md transition-colors`}
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-cosmic-purple/20 border border-cosmic-purple flex items-center justify-center animate-float">
                <i className="ri-sparkling-2-line text-4xl text-cosmic-pink"></i>
              </div>
            </div>
            
            <h3 className="text-2xl font-space font-bold bg-gradient-to-r from-cosmic-pink to-cosmic-blue bg-clip-text text-transparent mb-4">
              You are a {result?.title}
            </h3>
            
            <p className="text-space-100 mb-6">
              {result?.description}
            </p>
            
            <div className="flex justify-center gap-2 mb-8">
              {result?.traits.map((trait, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-cosmic-purple/20 text-cosmic-purple px-3 py-1 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
            
            <button 
              onClick={resetQuiz}
              className="bg-cosmic-blue hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
