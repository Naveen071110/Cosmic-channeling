import { useMutation } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: {
    href: string;
    rel: string;
    method: string;
  }[];
}

export function useSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isSubscribed = user?.isSubscribed || false;
  
  // Direct API mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async (status: boolean) => {
      if (!user) {
        throw new Error("You must be logged in to update your subscription");
      }
      
      const res = await apiRequest(
        "POST", 
        `/api/users/${user.id}/subscription`, 
        { isSubscribed: status }
      );
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update subscription");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate user cache to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Subscription Updated",
        description: isSubscribed 
          ? "Your subscription has been canceled" 
          : "Welcome to Cosmic Channeling Premium!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // PayPal subscription creation mutation
  const createPayPalSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to subscribe");
      }
      
      const res = await apiRequest(
        "POST", 
        "/api/paypal/create-subscription", 
        {}
      );
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create PayPal subscription");
      }
      
      return await res.json() as PayPalOrderResponse;
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // PayPal order capture mutation
  const capturePayPalOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await apiRequest(
        "POST",
        "/api/paypal/capture-order",
        { orderId }
      );
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to capture PayPal order");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      // After successful capture, update local subscription status
      updateSubscriptionMutation.mutate(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Payment Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Wrapper to directly set subscription status (used for testing or admin)
  const setSubscribed = (status: boolean) => {
    updateSubscriptionMutation.mutate(status);
  };
  
  // Start the PayPal subscription process
  const startSubscription = () => {
    return createPayPalSubscriptionMutation.mutateAsync();
  };
  
  // Complete the subscription process by capturing the PayPal order
  const completeSubscription = (orderId: string) => {
    capturePayPalOrderMutation.mutate(orderId);
  };
  
  return { 
    isSubscribed, 
    setSubscribed,
    startSubscription,
    completeSubscription,
    isUpdating: 
      updateSubscriptionMutation.isPending || 
      createPayPalSubscriptionMutation.isPending || 
      capturePayPalOrderMutation.isPending
  };
}