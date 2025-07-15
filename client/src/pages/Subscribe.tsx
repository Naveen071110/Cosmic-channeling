import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { useSubscription, PayPalOrderResponse } from '../hooks/use-subscription';
import { useAuth } from '../hooks/use-auth';
import PayPalButton from '../components/PayPalButton';
import { Loader2 } from 'lucide-react';

export default function Subscribe() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { isSubscribed, startSubscription, completeSubscription, isUpdating } = useSubscription();
  
  // State to control whether to show PayPal button or loading state
  const [paymentStep, setPaymentStep] = useState<'info' | 'loading' | 'payment'>('info');
  const [paypalOrderData, setPaypalOrderData] = useState<PayPalOrderResponse | null>(null);
  
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
  
  // Redirect if already subscribed
  useEffect(() => {
    if (isSubscribed) {
      toast({
        title: "Already Subscribed",
        description: "You are already subscribed to Cosmic Channeling Premium.",
      });
      setLocation("/tools");
    }
  }, [isSubscribed, setLocation, toast]);
  
  // Handler for initiating subscription process with PayPal
  const handleStartSubscription = async () => {
    try {
      setPaymentStep('loading');
      const orderData = await startSubscription();
      setPaypalOrderData(orderData);
      setPaymentStep('payment');
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast({
        title: "Subscription Error",
        description: "There was a problem initiating your subscription. Please try again.",
        variant: "destructive"
      });
      setPaymentStep('info');
    }
  };
  
  // Handler for successful PayPal payment
  const handlePaymentSuccess = async (orderId: string) => {
    try {
      completeSubscription(orderId);
      toast({
        title: "Subscription Successful!",
        description: "Welcome to Cosmic Channeling Premium. Your cosmic journey awaits!",
      });
      setTimeout(() => setLocation("/tools"), 2000);
    } catch (error) {
      console.error('Error completing subscription:', error);
      toast({
        title: "Subscription Error",
        description: "Your payment was processed but we couldn't complete your subscription. Please contact support.",
        variant: "destructive"
      });
    }
  };
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 16);
  };
  
  const formatCardExpiry = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 2) {
      return `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    return value;
  };
  
  const formatCardCVC = (value: string) => {
    return value.replace(/\D/g, "").substring(0, 4);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
            <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
              Start Your Premium Journey
            </span>
          </h1>
          <p className="text-[#F1F5F9] max-w-md mx-auto">
            Unlock all cosmic tools and premium features with your subscription.
          </p>
        </div>
        
        <Card className="bg-[#1E293B] border-[#334155]">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9]">Cosmic Channeling Premium</CardTitle>
            <CardDescription>$9 per month, cancel anytime</CardDescription>
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

              {paymentStep === 'info' && (
                <div className="text-center py-4">
                  <p className="text-[#F1F5F9] mb-6">
                    Ready to expand your cosmic consciousness? Subscribe now to access premium features.
                  </p>
                  <Button 
                    onClick={handleStartSubscription}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                    disabled={isUpdating}
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {paymentStep === 'loading' && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED] mx-auto mb-4" />
                  <p className="text-[#F1F5F9]">Preparing your subscription...</p>
                </div>
              )}

              {paymentStep === 'payment' && (
                <div className="py-4">
                  <h3 className="text-[#F1F5F9] font-medium mb-4 text-center">Complete Your Payment</h3>
                  <PayPalButton 
                    amount="9.00"
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setPaymentStep('info')}
                    onError={() => setPaymentStep('info')}
                  />
                </div>
              )}
              
              <p className="text-xs text-center mt-2 text-[#94A3B8]">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-[#94A3B8] text-sm">
            100% secure payment with PayPal
          </p>
          <div className="flex justify-center mt-2 space-x-2">
            <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 8.2c0 5.8-6.3 7.8-7.3 7.8-1 0-7.3-2-7.3-7.8C2.9 4.5 5.3 2 9 2c3.8 0 6.2 2.5 6.2 6.2z" className="text-[#00457C]"/>
              <path d="M20.5 16.5c0 3.4-2.2 5.5-5.5 5.5-3 0-5.9-1.7-5.9-6.3 0-3.1 2-5.7 5.6-5.7s5.8 2.8 5.8 6.5z" className="text-[#0079C1]"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}