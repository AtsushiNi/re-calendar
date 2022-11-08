import { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const AuthContext = createContext();

export const provider = new GoogleAuthProvider()

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState('');

  const value = {
    user,
  };

  useEffect(() => {
    const unsubscribed = getAuth().onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
