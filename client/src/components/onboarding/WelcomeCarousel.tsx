import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, SkipForward } from "lucide-react";

interface WelcomeStep {
  title: string;
  content: string;
  image: string;
}

interface WelcomeCarouselProps {
  onComplete: () => void;
}

export default function WelcomeCarousel({ onComplete }: WelcomeCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Check if user has already seen the intro
  useEffect(() => {
    const introSeen = localStorage.getItem("welcomeCarouselComplete");
    if (introSeen === "true") {
      setHasSeenIntro(true);
    }
  }, []);

  // If user has seen intro, complete immediately
  useEffect(() => {
    if (hasSeenIntro) {
      onComplete();
    }
  }, [hasSeenIntro, onComplete]);

  const steps: WelcomeStep[] = [
    {
      title: "Welcome to Cosmic Channeling",
      content: "Your journey through mindfulness and astronomy begins here. Explore the cosmos while nurturing your inner peace.",
      image: "/images/welcome/intro.svg"
    },
    {
      title: "Meditate with Cosmic Sounds",
      content: "Experience guided meditations with sounds inspired by celestial phenomena. Connect with the universe in profound ways.",
      image: "/images/welcome/meditation.svg"
    },
    {
      title: "Journal Your Cosmic Journey",
      content: "Document your spiritual growth with our guided journaling tools. Track patterns in your progress and insights.",
      image: "/images/welcome/journal.svg"
    },
    {
      title: "Explore Celestial Objects",
      content: "Discover the wonders of space and their spiritual significance through our interactive universe explorer.",
      image: "/images/welcome/explore.svg"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    // Save that user has completed the onboarding
    localStorage.setItem("welcomeCarouselComplete", "true");
    onComplete();
  };

  // If user has already seen intro, don't render anything
  if (hasSeenIntro) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/50 overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSkip}
            className="text-gray-300 hover:text-white"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Tour
          </Button>
        </div>
        
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl md:text-3xl text-white">
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center pb-6">
          <div className="w-full max-w-xs h-48 mb-6 flex items-center justify-center">
            {/* Replace with actual images when available */}
            <div className="w-full h-full rounded-lg bg-purple-700/30 flex items-center justify-center">
              <span className="text-4xl">🌌</span>
            </div>
          </div>
          
          <CardDescription className="text-center text-lg text-gray-200 max-w-lg">
            {steps[currentStep].content}
          </CardDescription>
        </CardContent>
        
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="flex items-center space-x-1 mx-auto">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? "bg-purple-400 w-8" 
                    : "bg-purple-800 w-2"
                }`} 
              />
            ))}
          </div>
        </CardFooter>
        
        <div className="flex justify-between px-6 pb-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}