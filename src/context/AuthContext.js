import { createContext, useState, useContext, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify'
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

const AuthContext = createContext({ currentUser: undefined });

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setCurrentUser(data);
          break;
        case "signOut":
          setCurrentUser(null);
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(currentUser => setCurrentUser(currentUser))
      .catch(() => setCurrentUser(null))

    // return unsubscribe;
  }, [])

  const signIn = async () => {
    await Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google})
  }

  const signOut = async() => {
    await Auth.signOut()
  }

  return <AuthContext.Provider value={{ currentUser: currentUser, signIn: signIn, signOut: signOut }}>
    {children}
  </AuthContext.Provider>;
}
