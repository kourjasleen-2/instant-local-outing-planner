import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAuth, type Auth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBKlI8a41XNHOOR7NxmeB-TKfrEbrlhy6c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "glimmr-3b56a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "glimmr-3b56a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "glimmr-3b56a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1046319709327",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1046319709327:web:77ea762b5e1121c86d84fa",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-BVFDKXXS1N",
};

// Lazy initialization - only initialize when services are accessed
let app: FirebaseApp | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;
let _auth: Auth | null = null;
let _analytics: Analytics | null = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

// Lazy getters for Firebase services
export const db = new Proxy({} as Firestore, {
  get(target, prop) {
    if (!_db) {
      _db = getFirestore(initializeFirebase());
    }
    return (_db as any)[prop];
  }
});

export const storage = new Proxy({} as FirebaseStorage, {
  get(target, prop) {
    if (!_storage) {
      _storage = getStorage(initializeFirebase());
    }
    return (_storage as any)[prop];
  }
});

export const auth = new Proxy({} as Auth, {
  get(target, prop) {
    if (!_auth) {
      _auth = getAuth(initializeFirebase());
    }
    return (_auth as any)[prop];
  }
});

// Initialize Analytics (only in browser environment and when accessed)
export const analytics = new Proxy({} as Analytics, {
  get(target, prop) {
    if (typeof window === 'undefined') return undefined;
    if (!_analytics) {
      _analytics = getAnalytics(initializeFirebase());
    }
    return (_analytics as any)[prop];
  }
});

export default {
  get app() {
    return initializeFirebase();
  }
};
