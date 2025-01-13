import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from '../../firebaseConfiguration/firebaseConfig';
import { storeUserInformation } from './userManagement';
import { Alert } from 'react-native';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        storeUserInformation(user); // Store user information when the user is authenticated
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);

      // Check if there is already a user logged in
      if (user) {
         Alert.alert("A user is already logged in.");
        setLoading(false);
        return; // Prevent login if a user is already logged in
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      // Store user information after successful login (don't update displayName)
      if (currentUser) {
        await storeUserInformation(currentUser); 
      }
      setLoading(false);
    } catch (error) {
      console.error("Error signing in: ", error);
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);

      // Check if there is already a user logged in
      if (user) {
        console.log("A user is already logged in.");
        setLoading(false);
        return; // Prevent signup if a user is already logged in
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const currentUser = userCredential.user;
      
      // Store user information after successful signup (don't update displayName)
      if (currentUser) {
        await storeUserInformation(currentUser); 
      }
      setLoading(false);
    } catch (error) {
      console.error("Error signing up: ", error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log("Logging out...");
      await firebaseSignOut(auth);
      setUser(null);  // Clear the user after sign-out
      setLoading(false);
    } catch (error) {
      console.error("Error signing out: ", error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
