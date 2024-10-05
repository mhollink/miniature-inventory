import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth } from "firebase/auth";
import {
  Analytics,
  getAnalytics,
  isSupported,
  logEvent,
} from "firebase/analytics";

const firebaseConfig = {
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "miniature-inventory.firebaseapp.com",
  projectId: "miniature-inventory",
  storageBucket: "miniature-inventory.appspot.com",
  messagingSenderId: "300464295573",
  measurementId: "G-JVWVWWMTL2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

auth.setPersistence(browserSessionPersistence);

// Initialize Firebase Analytics (only on supported environments)
export let analytics: Analytics | undefined;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export const logApiFailure = (error: Error | unknown, endpoint: string) => {
  if (analytics) {
    if (error instanceof Error) {
      logEvent(analytics, "exception", {
        error_message: error.message,
        error_stack: error.stack,
        endpoint,
        timestamp: new Date().toISOString(),
      });
    } else {
      logEvent(analytics, "exception", {
        error_message: "An unknown error occurred",
        endpoint,
        timestamp: new Date().toISOString(),
      });
    }
  }
};
