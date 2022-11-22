import { useState, useEffect } from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import SignIn from './components/SignIn'
import Home from './components/Home'
import Calendar from './components/Calendar'
import TestDemo from './components/TestDemo'

function App() {
  const [user, setUser] = useState(null)

  return (
    <div>
      <div className="App">
        <Router>
          <AuthProvider>
            <Routes>
              <Route index path="/" element={<Home />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path="/calendar" element={<Calendar />} />
              {/* <Route path='/test' element={<TestDemo />} /> */}
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}

export default App;
