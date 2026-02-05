import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Your web app's Firebase configuration
// Uses environment variables in production, falls back to hardcoded values for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCmoC9j7-N06C1ECL7MqZnz7C0GmNl9brI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sanapath-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sanapath-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sanapath-ai.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1085751442196",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1085751442196:web:121bfdb19895d05c3fa001",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-D1VXR7QDXY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Auth functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);
export const signInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const logOut = () => signOut(auth);
export const updateUserProfile = (user, data) => updateProfile(user, data);

export { auth, onAuthStateChanged };
export default app;
