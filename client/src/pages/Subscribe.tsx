import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useSubscription } from '../hooks/use-subscription';
import { useAuth } from '../hooks/use-auth';

export default function Subscribe() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isSubscribed, setSubscribed, isUpdating } = useSubscription();

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to Cosmic Channeling Premium.",
        variant: "destructive",
      });
      setLocation("/auth");
    }
  }, [user, isLoading, setLocation, toast]);

  const handleToggleSubscription = () => {
    setSubscribed(!isSubscribed);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
              {isSubscribed ? "Manage Your Premium" : "Start Your Premium Journey"}
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-md mx-auto">
            Unlock all cosmic tools and premium features with your subscription.
          </p>
        </div>

        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9]">Cosmic Channeling Premium</CardTitle>
            <CardDescription>Unlock all features, cancel anytime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-[#0F172A]/50 rounded-lg p-4 border border-[#334155]">
                <h3 className="text-[#F1F5F9] font-medium mb-2 text-lg">Premium Features</h3>
                <ul className="space-y-2 text-[#94A3B8]">
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Cosmic Pattern Generator for spiritual insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Dream Interpreter to decode your cosmic messages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Exclusive meditations and cosmic sounds</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    <span>Priority access to new features</span>
                  </li>
                </ul>
              </div>

              <div className="text-center py-4">
                {isSubscribed ? (
                  <>
                    <p className="text-green-400 mb-4">You are currently a premium member.</p>
                    <Button
                      onClick={handleToggleSubscription}
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Processing..." : "Cancel Subscription"}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-[#F1F5F9] mb-6">
                      Ready to expand your cosmic consciousness? Subscribe now to access premium features.
                    </p>
                    <Button
                      onClick={handleToggleSubscription}
                      className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Processing..." : "Subscribe Now"}
                    </Button>
                  </>
                )}
              </div>

              <p className="text-xs text-center mt-2 text-[#94A3B8]">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
