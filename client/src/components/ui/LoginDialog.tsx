import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
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
import { apiRequest, queryClient } from '@/lib/queryClient';

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
  description = "Please sign in to access this feature"
}: LoginDialogProps) {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [isProcessingOAuth, setIsProcessingOAuth] = useState<boolean>(false);
  
  // Handle the dialog closing with the ESC key or clicking outside
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-black/80 backdrop-blur-sm border-purple-500/30">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onClose={onClose} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onClose={onClose} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col">
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            disabled={isProcessingOAuth}
            className="w-full mt-2"
          >
            {isProcessingOAuth ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-current"></span>
                Authenticating with Google...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  
  // Google login handler
  function handleGoogleLogin() {
    setIsProcessingOAuth(true);
    
    // Open Google sign-in in a new browser window to avoid the disallowed_useragent issue
    const googleAuthUrl = '/api/auth/google';
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    const features = `width=${width},height=${height},left=${left},top=${top},status=yes,scrollbars=yes`;
    
    // Open the Google Auth popup
    const authWindow = window.open(googleAuthUrl, 'googleAuthPopup', features);
    
    if (!authWindow) {
      setIsProcessingOAuth(false);
      return;
    }
    
    // Handle the auth window close event
    const checkPopup = setInterval(() => {
      if (!authWindow || authWindow.closed) {
        clearInterval(checkPopup);
        setIsProcessingOAuth(false);
        
        // The popup was closed, check if authentication succeeded
        apiRequest('GET', '/api/user')
          .then(response => {
            if (response.ok) {
              // User is logged in
              queryClient.invalidateQueries({ queryKey: ["/api/user"] })
                .then(() => {
                  onClose(); // Close the dialog when auth is complete
                });
            }
          })
          .catch(err => {
            console.error('Error checking auth status:', err);
          });
      }
    }, 1000);
  }
}

function LoginForm({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { loginMutation } = useAuth();
  const { toast } = useToast();
  
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
      onClose(); // Close the dialog on successful login
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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          placeholder="cosmicexplorer" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Authenticating..." : "Login"}
      </Button>
    </form>
  );
}

function RegisterForm({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const { registerMutation } = useAuth();
  const { toast } = useToast();
  
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
      onClose(); // Close the dialog on successful registration
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
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
      <Button 
        type="submit" 
        className="w-full" 
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating Account..." : "Register"}
      </Button>
    </form>
  );
}