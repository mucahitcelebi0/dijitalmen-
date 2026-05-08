import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from './authContextValue';

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase().trim();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const isAdmin = !!user && (
    !ADMIN_EMAIL || user.email?.toLowerCase() === ADMIN_EMAIL
  );

  const value = { user, isAdmin, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
