import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to subscribe.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Here you would typically send a POST request to your API
      // For now, we'll simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription Successful!",
        description: "Welcome to our cosmic community. Check your inbox for confirmation.",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "There was an error subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="my-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-[#7E22CE]/20 to-[#0EA5E9]/20 rounded-xl p-8 border border-[#334155]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-space font-bold mb-3">Join Our Cosmic Community</h2>
            <p className="text-[#F1F5F9] mb-4">
              Subscribe to our newsletter for weekly cosmic insights, meditation guides, and exclusive content.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address" 
                className="flex-grow bg-[#0F172A] bg-opacity-50 border border-[#475569] focus:border-[#EC4899] rounded-md px-4 py-2 text-[#F1F5F9] placeholder-[#64748B] focus:outline-none"
              />
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#EC4899] hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-md transition-colors whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
          
          <div className="flex-shrink-0 w-24 h-24 relative">
            <div className="w-24 h-24 rounded-full bg-[#7E22CE]/20 border border-[#7E22CE]/40 flex items-center justify-center animate-float">
              <i className="ri-mail-star-line text-4xl text-[#EC4899]"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
