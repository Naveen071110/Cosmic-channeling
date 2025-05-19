import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Star, 
  Sparkles, 
  BrainCircuit, 
  Rocket, 
  Download, 
  Share2,
  Award,
  Bird,
  MoveHorizontal,
  Expand
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for Astral Connection Test
type AstralProfile = {
  connectionScore: number;
  primaryChannel: string;
  strengths: string[];
  potentialAbilities: string[];
  recommendations: string[];
  description: string;
};

// Astral connection test form schema
const formSchema = z.object({
  birthDate: z.string().min(1, 'Birth date is required'),
  meditation: z.string().min(1, 'Please select a meditation frequency'),
  dreams: z.string().min(1, 'Please select a dream frequency'),
  synchronicity: z.string().min(1, 'Please select a synchronicity frequency'),
  intuition: z.string().min(1, 'Please select an intuition strength'),
  experience: z.string().optional(),
});

export default function AstralConnectionTest() {
  const [testState, setTestState] = useState<'form' | 'processing' | 'results'>('form');
  const [progress, setProgress] = useState(0);
  const [astralProfile, setAstralProfile] = useState<AstralProfile | null>(null);
  const { toast } = useToast();
  
  // Setup form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: '',
      meditation: '',
      dreams: '',
      synchronicity: '',
      intuition: '',
      experience: '',
    },
  });
  
  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Start processing animation
    setTestState('processing');
    setProgress(0);
    
    // Simulate processing with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          generateResults(values);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  // Function to generate results based on form input
  const generateResults = (values: z.infer<typeof formSchema>) => {
    // Calculate base connection score from form values
    let score = 0;
    
    // Meditation frequency scoring
    switch (values.meditation) {
      case 'daily': score += 25; break;
      case 'weekly': score += 15; break;
      case 'monthly': score += 10; break;
      case 'rarely': score += 5; break;
    }
    
    // Dreams frequency scoring
    switch (values.dreams) {
      case 'always': score += 25; break;
      case 'often': score += 15; break;
      case 'sometimes': score += 10; break;
      case 'rarely': score += 5; break;
    }
    
    // Synchronicity frequency scoring
    switch (values.synchronicity) {
      case 'daily': score += 25; break;
      case 'weekly': score += 15; break;
      case 'monthly': score += 10; break;
      case 'rarely': score += 5; break;
    }
    
    // Intuition strength scoring
    switch (values.intuition) {
      case 'very-strong': score += 25; break;
      case 'strong': score += 15; break;
      case 'moderate': score += 10; break;
      case 'weak': score += 5; break;
    }
    
    // Add bonus points for experience description
    if (values.experience && values.experience.length > 50) {
      score += 10;
    }
    
    // Ensure score is between 0-100
    score = Math.min(100, Math.max(0, score));
    
    // Determine primary channel based on highest individual score
    const meditationScore = {
      daily: 25, weekly: 15, monthly: 10, rarely: 5, '': 0
    }[values.meditation];
    
    const dreamsScore = {
      always: 25, often: 15, sometimes: 10, rarely: 5, '': 0
    }[values.dreams];
    
    const synchronicityScore = {
      daily: 25, weekly: 15, monthly: 10, rarely: 5, '': 0
    }[values.synchronicity];
    
    const intuitionScore = {
      'very-strong': 25, strong: 15, moderate: 10, weak: 5, '': 0
    }[values.intuition];
    
    // Find the highest score and its corresponding channel
    const scoreMap = [
      { channel: 'Meditation', score: meditationScore || 0 },
      { channel: 'Dreams', score: dreamsScore || 0 },
      { channel: 'Synchronicity', score: synchronicityScore || 0 },
      { channel: 'Intuition', score: intuitionScore || 0 }
    ];
    
    scoreMap.sort((a, b) => (b.score || 0) - (a.score || 0));
    const primaryChannel = scoreMap[0].channel;
    
    // Generate profile description based on score
    let description = '';
    let strengths: string[] = [];
    let potentialAbilities: string[] = [];
    let recommendations: string[] = [];
    
    // Determine strengths based on individual scores
    scoreMap.forEach(item => {
      if ((item.score || 0) >= 15) {
        strengths.push(item.channel);
      }
    });
    
    // Add random strengths if we don't have enough
    if (strengths.length < 2) {
      const possibleStrengths = ['Energy Sensitivity', 'Cosmic Awareness', 'Spiritual Insight'];
      strengths = [...strengths, ...possibleStrengths.slice(0, 2 - strengths.length)];
    }
    
    // Determine potential abilities based on score
    if (score >= 80) {
      potentialAbilities = [
        'Astral Projection',
        'Remote Viewing',
        'Energy Healing',
        'Conscious Channeling',
        'Interstellar Communication'
      ];
      description = 'You have an exceptionally strong connection to the cosmic consciousness. Your astral sensitivity is well-developed, allowing you to access higher dimensions of reality with relative ease. You likely experience regular profound spiritual insights and may serve as a cosmic channel for others.';
      recommendations = [
        'Develop a daily meditation practice focused on astral travel',
        'Keep a dedicated dream and synchronicity journal',
        'Explore advanced energy work techniques',
        'Consider mentoring others on their cosmic journey',
        'Trust your intuitive insights fully'
      ];
    } else if (score >= 60) {
      potentialAbilities = [
        'Lucid Dreaming',
        'Intuitive Guidance',
        'Energy Sensing',
        'Cosmic Pattern Recognition'
      ];
      description = 'You have a strong cosmic connection that is continuing to develop. You regularly sense energies and patterns beyond the physical realm and have the ability to consciously engage with higher dimensional frequencies. Your spiritual awareness is expanding rapidly.';
      recommendations = [
        'Establish a regular meditation practice',
        'Pay special attention to your dreams and record them',
        'Practice energy visualization exercises',
        'Spend time in nature to strengthen your cosmic connection',
        'Join a community of like-minded cosmic explorers'
      ];
    } else if (score >= 40) {
      potentialAbilities = [
        'Enhanced Intuition',
        'Dream Memory',
        'Subtle Energy Awareness',
        'Synchronicity Recognition'
      ];
      description = 'You have a moderate cosmic connection with significant potential for growth. Your awareness of subtle energies and patterns is awakening, and you occasionally experience meaningful synchronicities and intuitive insights. Your spiritual journey is unfolding steadily.';
      recommendations = [
        'Begin with simple meditation techniques',
        'Start a synchronicity journal',
        'Explore guided astral meditation sessions',
        'Read about cosmic consciousness and spiritual growth',
        'Practice mindfulness throughout your day'
      ];
    } else {
      potentialAbilities = [
        'Intuitive Flashes',
        'Energy Sensitivity',
        'Meaningful Dreams',
        'Cosmic Curiosity'
      ];
      description = 'You are at the beginning of your cosmic journey with an emerging connection to higher consciousness. While your astral sensitivity is still developing, you possess natural curiosity and openness that will serve you well as you explore your spiritual potential.';
      recommendations = [
        'Start with guided meditations for beginners',
        'Pay attention to coincidences in your daily life',
        'Practice gratitude to raise your energetic vibration',
        'Spend time in quiet reflection each day',
        'Be patient and open to subtle spiritual experiences'
      ];
    }
    
    // Create the profile
    const profile: AstralProfile = {
      connectionScore: score,
      primaryChannel,
      strengths,
      potentialAbilities,
      recommendations,
      description
    };
    
    // Update state with generated profile
    setAstralProfile(profile);
    setTestState('results');
  };
  
  // Function to save results as PDF (simulated)
  const saveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your astral connection profile has been saved to your device.",
      variant: "default",
    });
  };
  
  // Function to share results (simulated)
  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Astral Connection Profile',
        text: `I just discovered my astral connection score is ${astralProfile?.connectionScore}! My primary channel is ${astralProfile?.primaryChannel}.`,
        url: window.location.href,
      })
      .catch(error => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      toast({
        title: "Share Link Copied",
        description: "Link to the astral connection test has been copied to your clipboard.",
        variant: "default",
      });
    }
  };
  
  // Function to reset the test
  const resetTest = () => {
    form.reset();
    setTestState('form');
    setAstralProfile(null);
  };
  
  // Get connection level based on score
  const getConnectionLevel = (score: number) => {
    if (score >= 80) return { name: 'Cosmic Adept', color: 'text-purple-400' };
    if (score >= 60) return { name: 'Astral Explorer', color: 'text-blue-400' };
    if (score >= 40) return { name: 'Cosmic Seeker', color: 'text-green-400' };
    return { name: 'Spiritual Novice', color: 'text-yellow-400' };
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="bg-black/40 backdrop-blur-sm border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center">
            <Star className="mr-2 h-5 w-5 text-purple-400" />
            Astral Connection Test
          </CardTitle>
          <CardDescription>
            Discover your cosmic connection strength and astral potential
          </CardDescription>
        </CardHeader>
        <CardContent>
          {testState === 'form' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Birth Date</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-gray-700">
                            <SelectValue placeholder="Select your astrological sign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="aries">Aries (Mar 21 - Apr 19)</SelectItem>
                          <SelectItem value="taurus">Taurus (Apr 20 - May 20)</SelectItem>
                          <SelectItem value="gemini">Gemini (May 21 - Jun 20)</SelectItem>
                          <SelectItem value="cancer">Cancer (Jun 21 - Jul 22)</SelectItem>
                          <SelectItem value="leo">Leo (Jul 23 - Aug 22)</SelectItem>
                          <SelectItem value="virgo">Virgo (Aug 23 - Sep 22)</SelectItem>
                          <SelectItem value="libra">Libra (Sep 23 - Oct 22)</SelectItem>
                          <SelectItem value="scorpio">Scorpio (Oct 23 - Nov 21)</SelectItem>
                          <SelectItem value="sagittarius">Sagittarius (Nov 22 - Dec 21)</SelectItem>
                          <SelectItem value="capricorn">Capricorn (Dec 22 - Jan 19)</SelectItem>
                          <SelectItem value="aquarius">Aquarius (Jan 20 - Feb 18)</SelectItem>
                          <SelectItem value="pisces">Pisces (Feb 19 - Mar 20)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Your astrological sign influences your cosmic connection patterns.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="meditation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Meditation Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-gray-700">
                            <SelectValue placeholder="How often do you meditate?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="rarely">Rarely or Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Regular meditation strengthens your cosmic channel.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dreams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Vivid or Prophetic Dreams</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-gray-700">
                            <SelectValue placeholder="How often do you experience vivid dreams?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="always">Almost Every Night</SelectItem>
                          <SelectItem value="often">Often (1-3 Times/Week)</SelectItem>
                          <SelectItem value="sometimes">Sometimes (1-3 Times/Month)</SelectItem>
                          <SelectItem value="rarely">Rarely or Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Dreams are a gateway to astral dimensions and cosmic insight.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="synchronicity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Meaningful Coincidences</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-black/20 border-gray-700">
                            <SelectValue placeholder="How often do you experience synchronicities?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="rarely">Rarely or Never</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Synchronicities indicate active cosmic communication in your life.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="intuition"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-white">Intuitive Strength</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="very-strong" className="border-purple-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-300">
                              Very Strong - My intuition is almost always right
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="strong" className="border-purple-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-300">
                              Strong - I often sense things before they happen
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="moderate" className="border-purple-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-300">
                              Moderate - I sometimes get intuitive insights
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="weak" className="border-purple-500" />
                            </FormControl>
                            <FormLabel className="font-normal text-gray-300">
                              Minimal - I rarely experience intuitive guidance
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Your intuition is a direct line to higher cosmic wisdom.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Spiritual Experiences</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe any notable spiritual, psychic, or cosmic experiences you've had..."
                          className="min-h-[100px] bg-black/20 border-gray-700 focus:border-purple-500 text-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Share your cosmic encounters or spiritual awakenings.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze My Cosmic Connection
                </Button>
              </form>
            </Form>
          )}
          
          {testState === 'processing' && (
            <div className="py-8 space-y-6">
              <div className="text-center">
                <Sparkles className="mx-auto h-12 w-12 text-purple-400 animate-pulse" />
                <h3 className="text-lg font-medium text-white mt-4">Analyzing Your Cosmic Connection</h3>
                <p className="text-gray-400 mt-2">
                  Please wait while we assess your astral sensitivity and cosmic potential...
                </p>
              </div>
              
              <Progress value={progress} className="h-2 bg-gray-800" />
              
              <div className="text-center text-sm text-gray-500">
                <p>{progress < 30 ? 'Scanning your energy signature...' : 
                  progress < 60 ? 'Measuring your astral resonance...' : 
                  progress < 90 ? 'Mapping your cosmic potential...' : 
                  'Finalizing your astral profile...'}</p>
              </div>
            </div>
          )}
          
          {testState === 'results' && astralProfile && (
            <div className="space-y-6">
              <div className="text-center">
                <Award className="mx-auto h-16 w-16 text-purple-400" />
                <h3 className="text-2xl font-medium text-white mt-4">
                  {getConnectionLevel(astralProfile.connectionScore).name}
                </h3>
                <div className="mt-2">
                  <span className={`text-4xl font-bold ${getConnectionLevel(astralProfile.connectionScore).color}`}>
                    {astralProfile.connectionScore}%
                  </span>
                  <p className="text-gray-400 mt-1">Cosmic Connection Strength</p>
                </div>
              </div>
              
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <h4 className="text-md font-medium text-white mb-2 flex items-center">
                  <Rocket className="mr-2 h-4 w-4 text-purple-400" />
                  Primary Cosmic Channel
                </h4>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-purple-900/40">
                    {astralProfile.primaryChannel === 'Meditation' && <BrainCircuit className="h-5 w-5 text-purple-300" />}
                    {astralProfile.primaryChannel === 'Dreams' && <Bird className="h-5 w-5 text-blue-300" />}
                    {astralProfile.primaryChannel === 'Synchronicity' && <MoveHorizontal className="h-5 w-5 text-green-300" />}
                    {astralProfile.primaryChannel === 'Intuition' && <Expand className="h-5 w-5 text-yellow-300" />}
                  </div>
                  <div>
                    <span className="text-lg font-medium text-white">{astralProfile.primaryChannel}</span>
                    <p className="text-sm text-gray-400">Your strongest connection to cosmic consciousness</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-white mb-2">Your Cosmic Profile</h4>
                <p className="text-gray-300">{astralProfile.description}</p>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-white mb-2">Cosmic Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {astralProfile.strengths.map((strength, index) => (
                    <Badge 
                      key={index}
                      className="bg-blue-900/30 text-blue-300 border-blue-500/30"
                    >
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-white mb-2">Potential Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {astralProfile.potentialAbilities.map((ability, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-purple-900/20 text-purple-300 border-purple-500/30"
                    >
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-md font-medium text-white mb-3">Recommended Practices</h4>
                <ul className="space-y-2">
                  {astralProfile.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="bg-blue-900/30 rounded-full p-1 mt-0.5">
                        <Star className="h-3 w-3 text-blue-400" />
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
        {testState === 'results' && (
          <CardFooter className="border-t border-gray-800 pt-4 flex justify-between flex-wrap gap-2">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveResults}
                className="border-purple-500/30 hover:bg-purple-900/30"
              >
                <Download className="mr-2 h-4 w-4" />
                Save Results
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={shareResults}
                className="border-purple-500/30 hover:bg-purple-900/30"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={resetTest}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Take Test Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}