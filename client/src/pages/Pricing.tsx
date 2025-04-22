import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckIcon, XIcon } from 'lucide-react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = [
    {
      name: 'Free',
      description: 'Basic cosmic exploration',
      price: {
        monthly: '$0',
        yearly: '$0',
      },
      features: [
        'Daily cosmic quote',
        'Basic meditation timer',
        'Limited celestial exploration',
        'Access to cosmic community',
        'Newsletter subscription'
      ],
      limitations: [
        'No cosmic pattern generator',
        'No dream interpreter',
        'Limited meditation sounds',
        'No premium content'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Premium',
      description: 'Full cosmic channeling experience',
      price: {
        monthly: '$9/month',
        yearly: '$89/year',
      },
      features: [
        'Everything in Free plan',
        'Cosmic pattern generator',
        'Dream interpreter',
        'Advanced meditation features',
        'Premium celestial content',
        'Ad-free experience',
        'Priority cosmic updates'
      ],
      limitations: [],
      buttonText: 'Subscribe Now',
      buttonVariant: 'default' as const,
      popular: true
    }
  ];
  
  const savings = billingCycle === 'yearly' ? 'Save 18%' : null;
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-space">
          <span className="bg-gradient-to-r from-[#7C3AED] to-[#EC4899] bg-clip-text text-transparent">
            Cosmic Channeling Plans
          </span>
        </h1>
        <p className="text-[#F1F5F9] max-w-2xl mx-auto mb-8">
          Choose the perfect cosmic journey that aligns with your spiritual path.
        </p>
        
        <div className="inline-flex p-1 rounded-lg bg-[#1E293B] mb-8">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'monthly' 
                ? 'bg-[#7C3AED] text-white' 
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              billingCycle === 'yearly' 
                ? 'bg-[#7C3AED] text-white' 
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Yearly {savings && <span className="ml-1 text-xs text-[#34D399]">({savings})</span>}
          </button>
        </div>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`bg-[#1E293B] border-[#334155] ${
              plan.popular ? 'ring-2 ring-[#7C3AED] relative' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#7C3AED] text-white px-4 py-1 rounded-full text-xs font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl font-space text-[#F1F5F9]">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <span className="text-4xl font-bold text-[#F1F5F9]">
                  {plan.price[billingCycle]}
                </span>
                {plan.name === 'Premium' && billingCycle === 'monthly' && (
                  <span className="text-[#94A3B8] ml-2">per month</span>
                )}
                {plan.name === 'Premium' && billingCycle === 'yearly' && (
                  <span className="text-[#94A3B8] ml-2">per year</span>
                )}
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#F1F5F9]">Features:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="h-4 w-4 text-[#34D399]" />
                      <span className="text-[#F1F5F9]">{feature}</span>
                    </li>
                  ))}
                  
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center gap-2 opacity-70">
                      <XIcon className="h-4 w-4 text-[#F87171]" />
                      <span className="text-[#94A3B8]">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                variant={plan.buttonVariant} 
                className={`w-full ${
                  plan.buttonVariant === 'default' 
                    ? 'bg-[#7C3AED] hover:bg-[#6D28D9]' 
                    : 'text-[#F1F5F9] border-[#7C3AED] hover:bg-[#7C3AED]/10'
                }`}
                asChild
              >
                <Link href={plan.name === 'Premium' ? '/subscribe' : '/'}>
                  {plan.buttonText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-4">Cosmic Guarantee</h2>
        <p className="text-[#94A3B8]">
          Try our Premium cosmic experience risk-free with a 7-day cosmic alignment guarantee. 
          If our tools don't resonate with your spiritual journey, simply request a refund within your first 7 days.
        </p>
      </div>
    </div>
  );
}