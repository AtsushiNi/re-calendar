import { useEffect } from 'react'
import '../css/Home.css'
import { useState } from 'react'
import { Auth } from 'aws-amplify'
import { Button, Menu, MenuItem } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Calendar from './Calendar'
import CalendarDetail from './CalendarDetail'
import { CalendarProvider } from '../context/CalendarContext'

const config = {
  "clientId": process.env.REACT_APP_GOOGLE_CLIENT_ID,
  "apiKey": process.env.REACT_APP_GOOGLE_API_KEY,
  "scope": "https://www.googleapis.com/auth/calendar",
  "disoveryDocs": [
    "https://www.googleapis.com/disovery/v1/apis/calendar/v3/rest"
  ]
}

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [events, setEvents] = useState([])
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const { currentUser, signOut } = useAuthContext()

  useEffect(() => {
    currentUser === null && navigate("/signin")
  }, [currentUser])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div>
      <header>
        <div className="header-inner">
          <a>
            <h1>Re-Calendar</h1>
          </a>
          <nav>
            <ul>
              <li>item1</li>
              <li>item2</li>
              <li>item3</li>
              <Button
                aria-controls={open ? 'menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                sx={{color: 'white'}}
              >
                Account
              </Button>
              <Menu
                open={open}
                onClose={handleClose}
                anchorEl={anchorEl}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </Menu>
            </ul>
          </nav>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        <CalendarProvider>
          <Calendar/>
          <CalendarDetail />
        </CalendarProvider>
      </div>
    </div>
  )
}

export default Home
