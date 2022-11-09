import '../css/Home.css'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Button, Menu, MenuItem } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import ApiCalendar from 'react-google-calendar-api'

const config = {
  "clientId": process.env.REACT_APP_GOOGLE_CLIENT_ID,
  "apiKey": process.env.REACT_APP_GOOGLE_API_KEY,
  "scope": "https://www.googleapis.com/auth/calendar",
  "disoveryDocs": [
    "https://www.googleapis.com/disovery/v1/apis/calendar/v3/rest"
  ]
}

const apiCalendar = new ApiCalendar(config)

const Home = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()
  const auth = getAuth()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = () => {
    signOut(auth)
    navigate("/signin")
  }

  const handleAuth = async () => {
    await apiCalendar.handleAuthClick()
  }
  const listEvents = async () => {
    const queryOptions = {
      maxResults: 10
    }
    const result = await apiCalendar.listEvents(queryOptions)
    console.log(result)
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
      <h1>Home</h1>
      <Button onClick={handleAuth}>load calendar</Button>
      <Button
          onClick={listEvents}
      >
        list events
      </Button>
    </div>
  )
}

export default Home
