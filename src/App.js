import { useState, useEffect } from 'react'
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'

import { AuthProvider } from './context/AuthContext'

import SignIn from './components/SignIn'
import Home from './components/Home'
import Calendar from './components/Calendar'
import TestDemo from './components/TestDemo'

function App() {
  const [user, setUser] = useState(null)

  const theme = createTheme({
    palette: {
      primary: {
        main: '#26A69A'
      }
    }
  })

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
      </LocalizationProvider>
    </div>
  );
}

export default App;
