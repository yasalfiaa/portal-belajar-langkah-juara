// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration for Bimbel Langkah Juara
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBlQtPhDzHGtgryf4FycyXAxuPlmSFKhZ8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bimbel-langkah-juara-b3b1f.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bimbel-langkah-juara-b3b1f",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bimbel-langkah-juara-b3b1f.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "810821470449",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:810821470449:web:e86d8cfb535ff3626cc150",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-N1J8L06YNP",
};

// Initialize Firebase (Singleton pattern to prevent re-initialization during Next.js hot reload / SSR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore & Auth
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Initialize Analytics only in client-side environment where supported
let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics not supported or blocked (e.g., ad blockers)
    });
}

export { app, db, auth, googleProvider, analytics, firebaseConfig };
export default app;
