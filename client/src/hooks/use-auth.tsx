import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import {
  auth,
  onAuthStateChanged,
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
  sendResetPassword,
  logoutFirebase,
  formatFirebaseAuthError,
  type FirebaseUser,
} from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export interface CosmicUser {
  id: number;
  uid: string;
  username: string;
  email: string | null;
  isSubscribed: boolean;
  photoURL?: string | null;
}

type AuthContextType = {
  user: CosmicUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  loginMutation: UseMutationResult<CosmicUser, Error, LoginData>;
  registerMutation: UseMutationResult<CosmicUser, Error, RegisterData>;
  googleLoginMutation: UseMutationResult<CosmicUser, Error, void>;
  resetPasswordMutation: UseMutationResult<void, Error, string>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

function mapFirebaseUser(fbUser: FirebaseUser | null): CosmicUser | null {
  if (!fbUser) return null;
  
  // Deterministic numeric ID from UID hash for compatibility
  let hash = 0;
  for (let i = 0; i < fbUser.uid.length; i++) {
    hash = (hash << 5) - hash + fbUser.uid.charCodeAt(i);
    hash |= 0;
  }
  const numericId = Math.abs(hash);

  const username =
    fbUser.displayName ||
    (fbUser.email ? fbUser.email.split("@")[0] : `cosmic_${fbUser.uid.substring(0, 6)}`);

  return {
    id: numericId,
    uid: fbUser.uid,
    username,
    email: fbUser.email,
    isSubscribed: false,
    photoURL: fbUser.photoURL,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<CosmicUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      const mapped = mapFirebaseUser(fbUser);
      setUser(mapped);
      setIsLoading(false);
      queryClient.setQueryData(["/api/user"], mapped);
    });

    return () => unsubscribe();
  }, []);

  // Google Login Mutation
  const googleLoginMutation = useMutation<CosmicUser, Error, void>({
    mutationFn: async () => {
      const fbUser = await signInWithGoogle();
      const mapped = mapFirebaseUser(fbUser)!;
      return mapped;
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      toast({
        title: "Cosmic Connection Established",
        description: `Welcome, ${newUser.username}!`,
      });
    },
    onError: (error: any) => {
      // Don't toast if user simply cancelled the popup
      if (error?.code !== "auth/popup-closed-by-user") {
        toast({
          title: "Google Sign-In Error",
          description: formatFirebaseAuthError(error),
          variant: "destructive",
        });
      }
    },
  });

  // Email/Password Login Mutation
  const loginMutation = useMutation<CosmicUser, Error, LoginData>({
    mutationFn: async (credentials: LoginData) => {
      const fbUser = await loginWithEmail(credentials.email, credentials.password);
      return mapFirebaseUser(fbUser)!;
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      toast({
        title: "Welcome Back!",
        description: `Signed in as ${newUser.username}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: formatFirebaseAuthError(error),
        variant: "destructive",
      });
    },
  });

  // Email/Password Register Mutation
  const registerMutation = useMutation<CosmicUser, Error, RegisterData>({
    mutationFn: async (data: RegisterData) => {
      const fbUser = await registerWithEmail(data.email, data.password, data.username);
      return mapFirebaseUser(fbUser)!;
    },
    onSuccess: (newUser) => {
      setUser(newUser);
      toast({
        title: "Account Created!",
        description: "Welcome to the Cosmic Channeling community.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: formatFirebaseAuthError(error),
        variant: "destructive",
      });
    },
  });

  // Password Reset Mutation
  const resetPasswordMutation = useMutation<void, Error, string>({
    mutationFn: async (email: string) => {
      await sendResetPassword(email);
    },
    onSuccess: () => {
      toast({
        title: "Reset Email Sent",
        description: "Please check your inbox for password reset instructions.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Reset Failed",
        description: formatFirebaseAuthError(error),
        variant: "destructive",
      });
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      await logoutFirebase();
    },
    onSuccess: () => {
      setUser(null);
      setFirebaseUser(null);
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged Out",
        description: "You have been safely disconnected.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Logout Error",
        description: formatFirebaseAuthError(error),
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        loginMutation,
        registerMutation,
        googleLoginMutation,
        resetPasswordMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}