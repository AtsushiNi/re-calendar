import { useState, useEffect } from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import SignIn from './components/SignIn'
import Home from './components/Home'
import Calendar from './components/Calendar'
import TestDemo from './components/TestDemo'

import { Auth, Hub, API } from 'aws-amplify'
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth'

function App() {
  const [user, setUser] = useState(null)
  const [customState, setCustomState] = useState(null)

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
          setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser().then(currentUser => setUser(currentUser))

    return unsubscribe;
  }, [])

  return (
    <div>
      <div className="App">
        <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
        <button onClick={() => Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google })}>Open Google</button>
        <button onClick={() => Auth.signOut()}>Sign Out</button>
        <div>{user && user.getUsername()}</div>
        <Calendar user={user} />
        {/* <Router> */}
        {/*   <Routes> */}
        {/*     <Route index path="/" element={<Home />} /> */}
        {/*     <Route path='/signin' element={<SignIn />} /> */}
        {/*     <Route path="/calendar" element={<Calendar />} /> */}
        {/*     {/1* <Route path='/test' element={<TestDemo />} /> *1/} */}
        {/*   </Routes> */}
        {/* </Router> */}
      </div>
    </div>
  );
}

export default App;
