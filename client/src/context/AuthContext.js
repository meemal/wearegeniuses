import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

// Create the authentication context
const AuthContext = createContext();

// Hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register a new user
  const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's profile with their name
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
  };

  // Sign in existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Sign out
  const logout = () => {
    return signOut(auth);
  };

  // Reset password with custom configuration
  const resetPassword = (email) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false
    };
    return sendPasswordResetEmail(auth, email, actionCodeSettings);
  };

  // Update user profile
  const updateUserProfile = (user, profile) => {
    return updateProfile(user, profile);
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Set up auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Clean up observer on unmount
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 