import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: 'harisghaffar@admin.com',
  password: 'harisghaffar',
  name: 'Haris Ghaffar'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || ADMIN_CREDENTIALS.name,
        });
      } else {
        const savedSession = sessionStorage.getItem('bookstore_admin_session');
        if (savedSession) {
          try {
            setCurrentUser(JSON.parse(savedSession));
          } catch (e) {
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Check specific required admin credentials first
    if (trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        uid: 'haris-admin-id-786',
        email: ADMIN_CREDENTIALS.email,
        displayName: ADMIN_CREDENTIALS.name,
        role: 'Seller / Administrator'
      };
      sessionStorage.setItem('bookstore_admin_session', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      return adminUser;
    }

    // Attempt Firebase Auth if configured
    if (isFirebaseConfigured) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = {
          uid: userCred.user.uid,
          email: userCred.user.email,
          displayName: userCred.user.displayName || 'Admin User',
          role: 'Seller / Administrator'
        };
        sessionStorage.setItem('bookstore_admin_session', JSON.stringify(fbUser));
        setCurrentUser(fbUser);
        return fbUser;
      } catch (err) {
        throw new Error(err.message || 'Invalid admin credentials');
      }
    }

    throw new Error('Invalid email or password. Please use correct seller credentials.');
  };

  const logout = async () => {
    sessionStorage.removeItem('bookstore_admin_session');
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e.message);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isFirebaseConfigured,
        loginAdmin,
        logout,
        ADMIN_CREDENTIALS
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
