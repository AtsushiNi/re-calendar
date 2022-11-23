import { useEffect, useState } from 'react'
import { Auth, API } from 'aws-amplify'
import { CircularProgress, Box } from '@mui/material'

import { useAuthContext } from '../context/AuthContext'

import "../css/Calendar.css"
import HeaderDay from './calendar/HeaderDay'
import DayColumn from './calendar/DayColumn'
import Event from '../models/Event'

const Calendar = () => {
  const { currentUser } = useAuthContext()
  const [loading, setLoading] = useState(true)

  const today = new Date()
  const defaultDays = [...Array(7)].map((_, i) => {
    const day = new Date()
    day.setDate(today.getDate() + i)

    return {
      dayNumber: day.getDate(),
      dayWeek: [ "日", "月", "火", "水", "木", "金", "土" ][day.getDay()],
      events: []
    }
  })
  const [days, setDays] = useState(defaultDays)

  useEffect(() => {
    // スクロール同期のCDN
    const head = document.getElementsByTagName('head')[0];

    const jqueryScript = document.createElement('script');
    jqueryScript.type = 'text/javascript';
    jqueryScript.src = 'https://code.jquery.com/jquery-3.3.1.js';
    jqueryScript.defer = true

    head.appendChild(jqueryScript);

    jqueryScript.onload = () => {
      const sideColumn = $(".side-column") // eslint-disable-line
      const scrollWindow = $(".scroll-window") // eslint-disable-line
      sideColumn.scroll(() => {
        scrollWindow.scrollTop(sideColumn.scrollTop())
      })
      scrollWindow.scroll(() => {
        sideColumn.scrollTop(scrollWindow.scrollTop())
      })
    }

    const getCalendar = async() => {
      setLoading(true)

      const token = currentUser.signInUserSession.idToken.jwtToken
      const myInit = {
        headers: {
          Authorization: token
        }
      }
      const result = await API.get("listEvent", "/events", myInit)

      let events = result.map(item => {
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

      setDays(
        days.map(day => {
          return {
            ...day, events: events.filter(event => event.startAt.getDate() === day.dayNumber)
          }
        })
      )

      setLoading(false)
    }
    !!currentUser && getCalendar()
  }, [currentUser])

  return (
    <div role="main">
      <h1 style={{display: "none"}}>xx年xx月xx日の週、xx件の予定</h1>
      <div>
        <div role="grid" className="calendar-grid">
          <div role="presentation" className="calendar-headers">
            <div className="header-spacer">
              <div></div>
              <div></div>
            </div>
            <div role="presentation" className="header-days-wrapper">
              <div></div>
              <div role="row" className="header-days-row-wrapper">
                <div role="presentation" className="header-days" key="1">
                  <div className="header-days-spacer"></div>
                  {
                    days.map((day, key) => <HeaderDay dayWeek={day.dayWeek} dayNumber={day.dayNumber} key={key}/>)
                  }
                </div>
              </div>
              <div role="row" className="header-row-spacer">
                <div></div>
                <div className="header-row-spacer-content">
                  <div></div>
                  <div className="header-spacer-cells">
                    {
                      [...Array(7)].map((_, key) => (
                        <div tabIndex="-1" className="header-spacer-cell" key={key}>
                          <div role="button" className="header-spacer-cell-content">
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div></div>
              </div>
              <div role="row">
                <div></div>
                <div>
                  <ul>
                    {
                      [...Array(7)].map((_, key) => (
                        <li className="long-event-box-li" key={key}></li>
                      ))
                    }
                  </ul>
                  <div className="long-event-boxes-div">
                    {
                      [...Array(7)].map((_, key) => (
                        <div className="long-event-box-div" key={key}></div>
                      ))
                    }
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div role="presentation" className="calendar-content-wrapper">
            <div role="presentation" className="calendar-content">
              <div className="side-column">
                <div className="side-time-list">
                  {
                    [...Array(24)].map((_, key) => (
                      <div className="side-time" key={key}>
                        <span>{key}時</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div role="presentation" className="scroll-window">
                {
                  loading
                  ? (
                    <Box sx={{ margin: 'auto' }}>
                      <CircularProgress />
                    </Box>
                  )
                  : (
                    <div role="row" className="day-columns">
                      <div className="h-borders">
                        {
                          [...Array(24)].map((_, key) => (<div className="gap-cell" key={key}></div>))
                        }
                      </div>
                      <div className="day-column-2"></div>
                      {
                        days.map((day, key) => <DayColumn events={day.events} key={key} />)
                      }
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Calendar
