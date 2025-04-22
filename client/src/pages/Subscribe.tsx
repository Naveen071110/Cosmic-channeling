import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useNavigate } from 'wouter';

// Form schema
const subscriptionFormSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  cardNumber: z.string().refine(val => /^\d{16}$/.test(val), { message: "Please enter a valid 16-digit card number." }),
  cardExpiry: z.string().refine(val => /^\d{2}\/\d{2}$/.test(val), { message: "Please use MM/YY format." }),
  cardCvc: z.string().refine(val => /^\d{3,4}$/.test(val), { message: "CVC must be 3 or 4 digits." }),
});

type SubscriptionFormValues = z.infer<typeof subscriptionFormSchema>;

export default function Subscribe() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useNavigate();
  
  // Default values
  const defaultValues: Partial<SubscriptionFormValues> = {
    fullName: "",
    email: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  };

  // Form
  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues,
  });
  
  // Form submission handler
  const onSubmit = (data: SubscriptionFormValues) => {
    setIsProcessing(true);
    
    // In a real implementation, this would connect to Stripe or another payment processor
    setTimeout(() => {
      toast({
        title: "Subscription successful!",
        description: "Welcome to Cosmic Channeling Premium. Your cosmic journey awaits!",
      });
      
      // Navigate to tools page after successful subscription
      setTimeout(() => navigate("/tools"), 2000);
      
      setIsProcessing(false);
    }, 2000);
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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F1F5F9]">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Jane Doe" 
                          className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#F1F5F9]">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="cosmic@example.com" 
                          className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 border-t border-[#334155]">
                  <h3 className="text-[#F1F5F9] font-medium mb-4">Payment Details</h3>
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#F1F5F9]">Card Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]" 
                            value={field.value}
                            onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="cardExpiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F1F5F9]">Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]" 
                              value={field.value}
                              onChange={(e) => field.onChange(formatCardExpiry(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cardCvc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#F1F5F9]">CVC</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              className="bg-[#0F172A] border-[#334155] text-[#F1F5F9]" 
                              value={field.value}
                              onChange={(e) => field.onChange(formatCardCVC(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Subscribe Now'}
                  </Button>
                  <p className="text-xs text-center mt-2 text-[#94A3B8]">
                    By subscribing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-[#94A3B8] text-sm">
            100% secure payment with 256-bit SSL encryption.
          </p>
          <div className="flex justify-center mt-2 space-x-2">
            <i className="ri-visa-line text-2xl text-[#F1F5F9]"></i>
            <i className="ri-mastercard-line text-2xl text-[#F1F5F9]"></i>
            <i className="ri-paypal-line text-2xl text-[#F1F5F9]"></i>
            <i className="ri-bank-card-line text-2xl text-[#F1F5F9]"></i>
          </div>
        </div>
      </div>
    </div>
  );
}