import '../css/Home.css'
import { useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { Button, Menu, MenuItem } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import ApiCalendar from 'react-google-calendar-api'
import Calendar from './Calendar'
import Event from '../models/Event'

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
  const [events, setEvents] = useState([])
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
      maxResults: 10,
      timeMin: "2022-11-17T09:19:08.000Z",
      timeMax: "2022-11-24T09:19:08.000Z",
    }
    const result = await apiCalendar.listEvents(queryOptions)
    let events = result.result.items.map(item => {
      let startAt = null
      let endAt = null
      if(item.start.date) {
        startAt = new Date(item.start.date)
        startAt.setHours(0, 0, 0)
        endAt = new Date(item.end.date)
        endAt.setHours(23, 59, 59)
        endAt.setDate(endAt.getDate() - 1)
      } else {
        startAt = new Date(item.start.dateTime)
        endAt = new Date(item.end.dateTime)
      }
      const title = item.summary

      return new Event(title, "", startAt, endAt)
    })

    // 複数日にまたがる予定は毎日分Eventを作る
    events
      .filter(event => event.startAt.getDate() !== event.endAt.getDate())
      .forEach(startDateEvent => {
        // イベント終了日
        let finishDateEvent = startDateEvent.copy()
        finishDateEvent.startAt.setDate(startDateEvent.endAt.getDate())
        finishDateEvent.startAt.setHours(0, 0, 0)
        events.push(finishDateEvent)

        // イベント開始日
        startDateEvent.endAt.setHours(23, 59, 59)

        // イベント中日
        let middleDateEvent = startDateEvent.copy()
        middleDateEvent.startAt.setHours(0, 0, 0)
        while(true) {
          middleDateEvent = middleDateEvent.copy()
          middleDateEvent.startAt.setDate(middleDateEvent.startAt.getDate() + 1)
          middleDateEvent.endAt.setDate(middleDateEvent.endAt.getDate() + 1)
          if (middleDateEvent.startAt.getDate() === finishDateEvent.startAt.getDate()) {
            break
          }
          events.push(middleDateEvent)
        }
      })

    setEvents(events)
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
      < Calendar events={events}/>
    </div>
  )
}

export default Home
