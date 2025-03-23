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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        storeUserInformation(currentUser); // This might trigger a re-render indirectly
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // Simplified cleanup
  }, []);

  const signIn = async (email, password) => {
    if (user) {
      Alert.alert("A user is already logged in.");
      return;
    }

    try {
      setLoading(true);
      const { user: currentUser } = await signInWithEmailAndPassword(auth, email, password);
      if (currentUser) {
        await storeUserInformation(currentUser);
      }
    } catch (error) {
      console.error("Error signing in: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    if (user) {
      Alert.alert("A user is already logged in.");
      return;
    }

    try {
      setLoading(true);
      const { user: currentUser } = await createUserWithEmailAndPassword(auth, email, password);
      if (currentUser) {
        await storeUserInformation(currentUser);
      }
    } catch (error) {
      console.error("Error signing up: ", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
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
