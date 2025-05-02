import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import StarBackground from "@/components/ui/StarBackground";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { toast } = useToast();
  const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

  useEffect(() => {
    // Check for query parameters indicating OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('auth') && urlParams.get('auth') === 'success') {
      // Refresh the user data from the server
      apiRequest('GET', '/api/user')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Failed to get user data');
        })
        .then(userData => {
          toast({
            title: "Login Successful",
            description: "You've logged in with Google!",
          });
        })
        .catch(error => {
          console.error('Error refreshing user data after OAuth:', error);
          toast({
            title: "Authentication Error",
            description: "Something went wrong with the authentication process",
            variant: "destructive"
          });
        });
      
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);
  
  // Redirect to home if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleGoogleLogin = () => {
    // Open Google sign-in in a new browser window to avoid the disallowed_useragent issue
    const googleAuthUrl = '/api/auth/google';
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const features = `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`;
    
    const authWindow = window.open(googleAuthUrl, 'googleAuthPopup', features);
    
    // Handle the auth window close event
    const checkPopup = setInterval(() => {
      if (!authWindow || authWindow.closed) {
        clearInterval(checkPopup);
        // The popup was closed, check if authentication succeeded
        apiRequest('GET', '/api/user')
          .then(response => {
            if (response.ok) {
              // User is logged in, refresh the page
              window.location.href = '/';
            }
          })
          .catch(err => console.error('Error checking auth status:', err));
      }
    }, 1000);
  };
  
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
              <LoginForm handleGoogleLogin={handleGoogleLogin} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm handleGoogleLogin={handleGoogleLogin} />
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

function LoginForm({ handleGoogleLogin }: { handleGoogleLogin: () => void }) {
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
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive"
      });
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
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Authenticating..." : "Login"}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-400" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">Or continue with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </Button>
      </CardFooter>
    </form>
  );
}

function RegisterForm({ handleGoogleLogin }: { handleGoogleLogin: () => void }) {
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
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive"
      });
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
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating Account..." : "Register"}
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-400" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-2 text-gray-400">Or register with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Register with Google
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