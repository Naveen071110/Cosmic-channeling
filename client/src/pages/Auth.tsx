import { useState } from "react";
import SEO from "@/components/SEO";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import StarBackground from "@/components/ui/StarBackground";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, Sparkles, Compass, Moon, BookOpen } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, googleLoginMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");

  // Redirect to home if already logged in
  if (user) {
    setLocation("/");
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      await googleLoginMutation.mutateAsync();
      setLocation("/");
    } catch {
      // Handled in hook
    }
  };

  return (
    <>
      <SEO
        title="Sign In & Account Portal | Cosmic Channeling"
        description="Sign in or create your Cosmic Channeling account with Google or email to sync your Astro-Journal reflections and meditation progress."
        canonical="https://cosmic-channeling.vercel.app/auth"
      />
      <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-white">
      {/* Form column */}
      <div className="w-full md:w-1/2 px-4 py-12 flex flex-col justify-center items-center relative">
        <StarBackground />
        
        <Card className="w-full max-w-md bg-[#0F172A]/90 backdrop-blur-xl border-purple-500/30 shadow-2xl z-10">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-purple-900/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-space font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
              Cosmic Channeling
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Access your sacred journey through the universe
            </CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 bg-purple-950/40 border border-purple-500/20">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-900/60 data-[state=active]:text-white text-xs">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-purple-900/60 data-[state=active]:text-white text-xs">
                  Create Account
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="login">
              <LoginForm 
                handleGoogleLogin={handleGoogleLogin} 
                isProcessingOAuth={googleLoginMutation.isPending}
                onForgotPassword={() => setActiveTab("forgot")}
              />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm 
                handleGoogleLogin={handleGoogleLogin} 
                isProcessingOAuth={googleLoginMutation.isPending} 
              />
            </TabsContent>

            <TabsContent value="forgot">
              <ForgotPasswordForm onBack={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      {/* Hero column */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#020617] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden border-l border-white/5">
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-mono mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Consciousness Portal</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-space font-bold leading-tight mb-6 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
            Align with the Living Cosmos
          </h1>
          
          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
            Connect meditation frequencies, solar-lunar cycles, dream symbolism, and your private astro-journal in one harmonious space.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureItem icon={BookOpen} title="Private Astro-Journal" description="Record thoughts, dreams, and synchronicities securely synced." />
            <FeatureItem icon={Compass} title="Celestial Explorer" description="Interactive astronomical database powered by NASA APOD & Spaceflight News." />
            <FeatureItem icon={Moon} title="Solar & Lunar Signals" description="Real-time twilight calculators and cosmic rhythms." />
            <FeatureItem icon={Sparkles} title="Harmonic Meditations" description="Curated audio frequencies for deep contemplative states." />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

function LoginForm({ 
  handleGoogleLogin, 
  isProcessingOAuth,
  onForgotPassword 
}: { 
  handleGoogleLogin: () => void; 
  isProcessingOAuth: boolean;
  onForgotPassword: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter your email and password.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await loginMutation.mutateAsync({ email, password });
      setLocation("/");
    } catch {
      // Handled in hook
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-xs text-gray-300">Email Address</Label>
          <Input 
            id="login-email" 
            type="email"
            placeholder="traveler@cosmos.org" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
            required
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label htmlFor="login-password" className="text-xs text-gray-300">Password</Label>
            <button 
              type="button" 
              onClick={onForgotPassword} 
              className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <Input 
            id="login-password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
            required
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-9" 
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Connecting..." : "Sign In"}
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0F172A] px-2 text-gray-400 font-mono">Or continue with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-white/10 hover:bg-white/5 text-white text-xs h-9"
          onClick={handleGoogleLogin}
          disabled={isProcessingOAuth}
        >
          {isProcessingOAuth ? (
            <>
              <span className="mr-2 h-3.5 w-3.5 animate-spin rounded-full border-2 border-b-transparent border-current" />
              Connecting with Google...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );
}

function RegisterForm({ 
  handleGoogleLogin, 
  isProcessingOAuth 
}: { 
  handleGoogleLogin: () => void; 
  isProcessingOAuth: boolean; 
}) {
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
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (password !== passwordConfirm) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await registerMutation.mutateAsync({ username, email, password });
      setLocation("/");
    } catch {
      // Handled in hook
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-3.5 pt-4">
        <div className="space-y-1">
          <Label htmlFor="reg-name" className="text-xs text-gray-300">Cosmic Name / Explorer ID</Label>
          <Input 
            id="reg-name" 
            placeholder="StarlightSeeker" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="reg-email" className="text-xs text-gray-300">Email Address</Label>
          <Input 
            id="reg-email" 
            type="email" 
            placeholder="traveler@cosmos.org" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="reg-password" className="text-xs text-gray-300">Password</Label>
            <Input 
              id="reg-password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="reg-confirm-password" className="text-xs text-gray-300">Confirm</Label>
            <Input 
              id="reg-confirm-password" 
              type="password" 
              placeholder="••••••••" 
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
              required
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-9" 
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Creating Account..." : "Create Free Account"}
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0F172A] px-2 text-gray-400 font-mono">Or register with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full border-white/10 hover:bg-white/5 text-white text-xs h-9"
          onClick={handleGoogleLogin}
          disabled={isProcessingOAuth}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
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

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const { resetPasswordMutation } = useAuth();
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please provide your email to receive the reset link.",
        variant: "destructive"
      });
      return;
    }
    await resetPasswordMutation.mutateAsync(email);
  };

  return (
    <form onSubmit={handleReset}>
      <CardContent className="space-y-3.5 pt-4">
        <div className="space-y-1.5">
          <Label htmlFor="forgot-email" className="text-xs text-gray-300">Your Registered Email</Label>
          <Input 
            id="forgot-email" 
            type="email" 
            placeholder="traveler@cosmos.org" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-9 text-white placeholder:text-gray-500"
            required
          />
        </div>
        <p className="text-[11px] text-gray-400">
          We will send you a secure password reset link to your email inbox.
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          className="w-1/3 border-white/10 text-xs h-9 text-gray-300 hover:bg-white/5"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={resetPasswordMutation.isPending}
          className="w-2/3 bg-purple-600 hover:bg-purple-700 text-white text-xs h-9"
        >
          {resetPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
        </Button>
      </CardFooter>
    </form>
  );
}

function FeatureItem({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-900/50 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h3 className="text-xs font-semibold text-white mb-0.5">{title}</h3>
        <p className="text-[11px] text-gray-400 leading-snug">{description}</p>
      </div>
    </div>
  );
}