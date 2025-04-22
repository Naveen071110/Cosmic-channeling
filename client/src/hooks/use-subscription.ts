import { useState, useEffect } from 'react';

export function useSubscription() {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user has subscription in local storage
    const checkSubscription = () => {
      const subscriptionStatus = localStorage.getItem('cosmicSubscription');
      setIsSubscribed(subscriptionStatus === 'active');
    };
    
    checkSubscription();
    
    // Listen for storage changes (in case subscription is updated in another tab)
    window.addEventListener('storage', checkSubscription);
    
    return () => {
      window.removeEventListener('storage', checkSubscription);
    };
  }, []);
  
  const setSubscribed = (status: boolean) => {
    localStorage.setItem('cosmicSubscription', status ? 'active' : 'inactive');
    setIsSubscribed(status);
  };
  
  return { isSubscribed, setSubscribed };
}