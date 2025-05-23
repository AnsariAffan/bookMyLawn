import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlZZB2NIWjrtjJU2kNEgAT8n4LJWdTDAQ",
  authDomain: "bookmylawn-ec3ea.firebaseapp.com",
  projectId: "bookmylawn-ec3ea",
  storageBucket: "bookmylawn-ec3ea.appspot.com",
  messagingSenderId: "34293413656",
  appId: "1:34293413656:web:1039c24e07e71296b7106d",
  measurementId: "G-TCZ5KE0KVT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with React Native AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Firestore
const db = getFirestore(app);

// Initialize Realtime Database
const realtimeDb = getDatabase(app);

// Initialize Analytics (if needed, only on web)
const analytics = getAnalytics(app);

export { db, auth, realtimeDb, analytics };
