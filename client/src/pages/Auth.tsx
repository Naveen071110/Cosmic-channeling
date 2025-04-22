import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import StarBackground from "@/components/ui/StarBackground";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  
  // Redirect to home if already logged in
  if (user) {
    setLocation("/");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form column */}
      <div className="w-full md:w-1/2 px-4 py-12 flex flex-col justify-center items-center relative">
        <StarBackground />
        <Card className="w-full max-w-md bg-black/50 backdrop-blur-md border-purple-600/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Cosmic Channeling</CardTitle>
            <CardDescription className="text-center">
              Enter your sacred space to explore the cosmos
            </CardDescription>
          </CardHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Hero column */}
      <div className="w-full md:w-1/2 bg-purple-900 p-12 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/cosmos.jpg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Begin Your Cosmic Journey</h1>
          <p className="text-xl mb-8">
            Unlock the secrets of the universe, explore your spiritual essence, and discover cosmic wisdom.
          </p>
          <div className="space-y-4">
            <FeatureItem title="Cosmic Exploration" description="Explore celestial bodies and their spiritual significance" />
            <FeatureItem title="Dream Interpretation" description="Understand the cosmic messages in your dreams" />
            <FeatureItem title="Meditation Tools" description="Connect with universal energy through guided practices" />
            <FeatureItem title="Spiritual Insights" description="Receive daily cosmic wisdom tailored to your journey" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await loginMutation.mutateAsync({ username, password });
      setLocation("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-username">Username</Label>
          <Input 
            id="login-username" 
            placeholder="cosmicexplorer" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input 
            id="login-password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Authenticating..." : "Login"}
        </Button>
      </CardFooter>
    </form>
  );
}

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill out all fields",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== passwordConfirm) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await registerMutation.mutateAsync({ 
        username, 
        email, 
        password,
        isSubscribed: false
      });
      toast({
        title: "Success",
        description: "Your cosmic account has been created!",
      });
      setLocation("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="register-username">Username</Label>
          <Input 
            id="register-username" 
            placeholder="cosmicexplorer" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input 
            id="register-email" 
            type="email" 
            placeholder="cosmic@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <Input 
            id="register-password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="register-password-confirm">Confirm Password</Label>
          <Input 
            id="register-password-confirm" 
            type="password" 
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating Account..." : "Register"}
        </Button>
      </CardFooter>
    </form>
  );
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start">
      <div className="mr-4 mt-1 text-purple-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-purple-200">{description}</p>
      </div>
    </div>
  );
}