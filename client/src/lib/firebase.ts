import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-SXSPiTaWZNa0JGXaVO8WCl8CCT8hqsw",
  authDomain: "cosmic-channeling.firebaseapp.com",
  projectId: "cosmic-channeling",
  storageBucket: "cosmic-channeling.firebasestorage.app",
  messagingSenderId: "291863078941",
  appId: "1:291863078941:web:08ffa6bea0de0e5ee57ef4",
  measurementId: "G-1MYQ3NM73W"
};

// Initialize Firebase (safely avoid double initialization)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In with Popup
export const signInWithGoogle = async () => {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Firebase Google Sign-In Error:", error);
    throw error;
  }
};

// Email & Password Login
export const loginWithEmail = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

// Email & Password Registration
export const registerWithEmail = async (email: string, pass: string, displayName?: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return result.user;
};

// Password Reset Email
export const sendResetPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

// Logout
export const logoutFirebase = async () => {
  return await signOut(auth);
};

// Get current Firebase ID Token for API requests
export const getCurrentIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

// User-friendly error message formatter
export const formatFirebaseAuthError = (error: any): string => {
  const code = error?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "An account already exists with this email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/popup-closed-by-user":
      return "Sign in popup was closed before completing.";
    case "auth/cancelled-popup-request":
      return "Only one popup request allowed at a time.";
    case "auth/popup-blocked":
      return "Sign in popup was blocked by your browser. Please allow popups.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return error?.message || "An unexpected authentication error occurred.";
  }
};

export { onAuthStateChanged, type FirebaseUser };