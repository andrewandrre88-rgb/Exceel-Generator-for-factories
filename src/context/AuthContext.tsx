import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logOut, 
  testFirestoreConnection, 
  handleFirestoreError,
  OperationType,
  User 
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<User>;
  signOut: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => { throw new Error('Auth not initialized'); },
  signOut: async () => {},
  error: null,
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initial connection test
    testFirestoreConnection();

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile to Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Sourcing Buyer',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            await setDoc(userDocRef, {
              displayName: currentUser.displayName || 'Sourcing Buyer',
              photoURL: currentUser.photoURL || '',
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          }
        } catch (err) {
          console.warn('Could not sync user profile to firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setError(null);
    try {
      const loggedUser = await signInWithGoogle();
      return loggedUser;
    } catch (err: any) {
      const message = err?.message || 'Google sign-in was canceled or encountered an issue.';
      setError(message);
      throw err;
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await logOut();
    } catch (err: any) {
      setError(err?.message || 'Failed to sign out.');
      throw err;
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn: handleSignIn,
      signOut: handleSignOut,
      error,
      clearError: () => setError(null),
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
