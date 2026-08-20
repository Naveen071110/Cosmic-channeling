import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function LoginDialog({
  isOpen,
  onClose,
  title = "Sign in to continue",
  description = "Please sign in to access this cosmic feature"
}: LoginDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { googleLoginMutation } = useAuth();

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleLoginMutation.mutateAsync();
      onClose();
    } catch {
      // Error handled in hook toast
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0B0F19]/95 backdrop-blur-md border-purple-500/30 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-space font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-sky-300 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-purple-950/40 border border-purple-500/20">
            <TabsTrigger value="login" className="data-[state=active]:bg-purple-900/60 data-[state=active]:text-white text-xs">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-purple-900/60 data-[state=active]:text-white text-xs">
              Create Account
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onClose={onClose} onForgotPassword={() => setActiveTab('forgot')} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onClose={onClose} />
          </TabsContent>

          <TabsContent value="forgot">
            <ForgotPasswordForm onBack={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
        
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-[#0B0F19] px-2 text-gray-400 font-mono">Or continue with</span>
          </div>
        </div>

        <DialogFooter className="flex flex-col">
          <Button 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={googleLoginMutation.isPending}
            className="w-full border-white/10 hover:bg-white/5 text-white text-xs h-9"
          >
            {googleLoginMutation.isPending ? (
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({ onClose, onForgotPassword }: { onClose: () => void; onForgotPassword: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await loginMutation.mutateAsync({ email, password });
      onClose();
    } catch {
      // Error handled in hook toast
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 py-3">
      <div className="space-y-1">
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
      <div className="space-y-1">
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
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-9 mt-2" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Connecting..." : "Sign In"}
      </Button>
    </form>
  );
}

function RegisterForm({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  
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
      onClose();
    } catch {
      // Handled in hook
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-3 py-3">
      <div className="space-y-1">
        <Label htmlFor="register-username" className="text-xs text-gray-300">Cosmic Name / Explorer ID</Label>
        <Input 
          id="register-username" 
          placeholder="StarlightSeeker" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-[#020617]/70 border-[#334155] text-xs h-8 text-white placeholder:text-gray-500"
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="register-email" className="text-xs text-gray-300">Email Address</Label>
        <Input 
          id="register-email" 
          type="email" 
          placeholder="traveler@cosmos.org" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#020617]/70 border-[#334155] text-xs h-8 text-white placeholder:text-gray-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="reg-pwd" className="text-xs text-gray-300">Password</Label>
          <Input 
            id="reg-pwd" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-8 text-white placeholder:text-gray-500"
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="reg-confirm" className="text-xs text-gray-300">Confirm</Label>
          <Input 
            id="reg-confirm" 
            type="password" 
            placeholder="••••••••" 
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="bg-[#020617]/70 border-[#334155] text-xs h-8 text-white placeholder:text-gray-500"
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:opacity-90 text-white text-xs h-9 mt-2" 
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating Account..." : "Create Free Account"}
      </Button>
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
    <form onSubmit={handleReset} className="space-y-3.5 py-3">
      <div className="space-y-1">
        <Label htmlFor="reset-email" className="text-xs text-gray-300">Your Registered Email</Label>
        <Input 
          id="reset-email" 
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
      <div className="flex gap-2">
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
      </div>
    </form>
  );
}