import { useMutation } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useSubscription() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isSubscribed = user?.isSubscribed || false;

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

  const setSubscribed = (status: boolean) => {
    updateSubscriptionMutation.mutate(status);
  };

  return {
    isSubscribed,
    setSubscribed,
    isUpdating: updateSubscriptionMutation.isPending,
  };
}
