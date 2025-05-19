import { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Stars, Heart, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';

interface WelcomeStep {
  title: string;
  content: string;
  image: React.ReactNode;
}

interface WelcomeCarouselProps {
  onComplete: () => void;
}

const welcomeSteps: WelcomeStep[] = [
  {
    title: "Welcome to Cosmic Channeling",
    content: "Your gateway to cosmic insights, meditation, and spiritual growth. We're excited to guide you on this journey of self-discovery and cosmic connection.",
    image: <Stars className="h-24 w-24 text-purple-500" />
  },
  {
    title: "Discover Meditation Tools",
    content: "Our meditation library contains guided sessions, ambient sounds, and visualization tools to help you connect with the cosmic consciousness.",
    image: <Moon className="h-24 w-24 text-blue-500" />
  },
  {
    title: "Explore Cosmic Knowledge",
    content: "Dive into our collection of celestial objects, cosmic patterns, and spiritual wisdom that connects ancient knowledge with modern science.",
    image: <Sun className="h-24 w-24 text-yellow-500" />
  },
  {
    title: "Journal Your Journey",
    content: "Record your insights, dreams, and spiritual experiences in your personal cosmic journal with powerful tools for reflection and pattern recognition.",
    image: <BookOpen className="h-24 w-24 text-green-500" />
  },
  {
    title: "Join Our Community",
    content: "You're not alone on this journey. Connect with like-minded cosmic explorers and share your experiences and insights.",
    image: <Heart className="h-24 w-24 text-pink-500" />
  }
];

export default function WelcomeCarousel({ onComplete }: WelcomeCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  
  const nextStep = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setHasCompletedTour(true);
      onComplete();
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const skipTour = () => {
    setHasCompletedTour(true);
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl bg-black/40 border-purple-500/30 text-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold text-white">
            {welcomeSteps[currentStep].title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Step {currentStep + 1} of {welcomeSteps.length}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center py-8 px-6">
          <div className="mb-8 flex justify-center items-center bg-gray-900/50 rounded-full p-8">
            {welcomeSteps[currentStep].image}
          </div>
          
          <p className="text-center text-gray-300 text-lg max-w-lg">
            {welcomeSteps[currentStep].content}
          </p>
          
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: welcomeSteps.length }).map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-purple-500 w-6' 
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-2 px-6 pb-6">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={skipTour}
            className="text-gray-400 hover:text-white"
          >
            Skip Tour
          </Button>
          
          <Button 
            onClick={nextStep}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentStep < welcomeSteps.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}