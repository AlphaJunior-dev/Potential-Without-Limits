import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Browser configuration is injected at build time by Vercel. Keeping the key
// outside Git allows a Firebase web API-key rotation without a source edit.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "withoutlimitspotential-wlp.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "withoutlimitspotential-wlp",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "withoutlimitspotential-wlp.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "994779831656",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:994779831656:web:6f084d5f95ff2e3527cadd",
  measurementId: "G-4Y7XDEZW3B",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
