import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();

// Google sign-in function
export const signInWithGoogle = async () => {
  try {
    // Use popup for desktop and redirect for mobile
    if (window.innerWidth > 768) {
      return await signInWithPopup(auth, googleProvider);
    } else {
      return await signInWithRedirect(auth, googleProvider);
    }
  } catch (error) {
    console.error("Error during Google sign in:", error);
    throw error;
  }
};

// Handle redirect result
export const handleAuthRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error) {
    console.error("Error during redirect result:", error);
    throw error;
  }
};