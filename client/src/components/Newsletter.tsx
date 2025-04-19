import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscription successful!",
        description: "You've joined our cosmic community. Look for our newsletter soon!",
      });
      setEmail('');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <section className="my-16 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-cosmic-purple/20 to-cosmic-blue/20 rounded-xl p-8 border border-space-800">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-space font-bold mb-3">Join Our Cosmic Community</h2>
            <p className="text-space-100 mb-4">
              Subscribe to our newsletter for weekly cosmic insights, meditation guides, and exclusive content.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-space-950 bg-opacity-50 border border-space-700 focus:border-cosmic-pink rounded-md px-4 py-2 text-space-100 placeholder-space-600 focus:outline-none"
              />
              
              <button 
                type="submit"
                disabled={submitting}
                className={`${submitting ? 'bg-cosmic-pink/70' : 'bg-cosmic-pink hover:bg-pink-600'} text-white font-medium py-2 px-6 rounded-md transition-colors whitespace-nowrap`}
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
          
          <div className="flex-shrink-0 w-24 h-24 relative">
            <div className="w-24 h-24 rounded-full bg-cosmic-purple/20 border border-cosmic-purple/40 flex items-center justify-center animate-float">
              <i className="ri-mail-star-line text-4xl text-cosmic-pink"></i>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
