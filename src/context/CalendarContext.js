import { createContext, useState, useContext, useEffect } from 'react'
import dayjs from 'dayjs'
import { API } from 'aws-amplify'

import Event from '../models/Event'
import { useAuthContext } from './AuthContext'

const CalendarContext = createContext({ candidates: [] })

export function useCalendarContext() {
  return useContext(CalendarContext)
}

export function CalendarProvider({ children }) {
  const { currentUser, signOut } = useAuthContext()

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

  const [gapTime, setGapTime] = useState(30)
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs().add(2, 'w'))
  const [startTime, setStartTime] = useState(dayjs().hour(10).minute(0).second(0))
  const [endTime, setEndTime] = useState(dayjs().hour(22).minute(0).second(0))

  const [candidates, setCandidates] = useState([])
  const [events, setEvents] = useState([])
  const [days, setDays] = useState(defaultDays)

  useEffect(() => {
    createCandidates()
  }, [startTime, endTime])

  useEffect(() => createCandidates(), [events])

  useEffect(() => {
    !!currentUser && getCalendar()
  }, [!!currentUser])

  const updateStartDate = value => setStartDate(value)
  const updateEndDate = value => setEndDate(value)
  const updateStartTime = value => setStartTime(value)
  const updateEndTime = value => setEndTime(value)

  const getCalendar = async() => {
    const token = currentUser.signInUserSession.idToken.jwtToken
    const myInit = {
      headers: {
        Authorization: token
      }
    }

    let result
    try {
      result = await API.get("listEvent", "/events", myInit)
    } catch (error) {
      console.log(error)
      signOut()
    }

    let googleEvents = result.map(item => {
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
    googleEvents
      .filter(event => event.startAt.getDate() !== event.endAt.getDate())
      .forEach(startDateEvent => {
        // イベント終了日
        let finishDateEvent = startDateEvent.copy()
        finishDateEvent.startAt.setDate(startDateEvent.endAt.getDate())
        finishDateEvent.startAt.setHours(0, 0, 0)
        googleEvents.push(finishDateEvent)

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
          googleEvents.push(middleDateEvent)
        }
      })

    setEvents(googleEvents)

    setDays(
      days.map(day => {
        const dayGoogleEvents = googleEvents.filter(event => event.startAt.getDate() === day.dayNumber)
        const dayCandidates = candidates.filter(event => event.startAt.getDate() === day.dayNumber)
        dayGoogleEvents.push(...dayCandidates)
        return {
          ...day, events: dayGoogleEvents
        }
      })
    )
  }

  const createCandidates = () => {
    const diff = endDate.diff(startDate, 'day') + 1

    let candidateEvents = [];
    [...Array(diff)].map((_, i) => {
      const startAt = startDate.add(i, 'd').hour(startTime.hour()).minute(startTime.minute()).second(0)
      const endAt = startDate.add(i, 'd').hour(endTime.hour()).minute(endTime.minute()).second(0).subtract(1, 's')

      let dayCandidates = [new Event("候補", "", startAt.toDate(), endAt.toDate())]
      events.forEach(googleEvent => {
        dayCandidates.forEach(candidateEvent => {
          // googleEventとcandidateEventが被っていたら、candidateEventを削る
          if(dayjs(googleEvent.startAt).subtract(gapTime, 'minute').isBefore(dayjs(candidateEvent.startAt)) && dayjs(googleEvent.endAt).add(gapTime, 'minute').isBetween(dayjs(candidateEvent.startAt), dayjs(candidateEvent.endAt))) {
            let startTime = new Date(googleEvent.endAt.getTime())
            startTime.setMinutes(startTime.getMinutes() + gapTime)
            candidateEvent.startAt = startTime
          } else if(dayjs(googleEvent.startAt).subtract(gapTime, 'minute').isBetween(dayjs(candidateEvent.startAt), dayjs(candidateEvent.endAt)) && dayjs(googleEvent.endAt).add(gapTime, 'minute').isAfter(dayjs(candidateEvent.endAt))) {
            let endTime = new Date(googleEvent.startAt.getTime())
            endTime.setMinutes(endTime.getMinutes() - gapTime)
            candidateEvent.endAt = endTime
          } else if(dayjs(googleEvent.startAt).subtract(gapTime, 'minute').isBefore(dayjs(candidateEvent.startAt)) && dayjs(googleEvent.endAt).add(gapTime, 'minute').isAfter(dayjs(candidateEvent.endAt))) {
            dayCandidates = dayCandidates.filter(event => event !== candidateEvent)
          } else if(dayjs(googleEvent.startAt).subtract(gapTime, 'minute').isAfter(dayjs(candidateEvent.startAt)) && dayjs(googleEvent.endAt).add(gapTime, 'minute').isBefore(dayjs(candidateEvent.endAt))) {
            let startTime = new Date(googleEvent.endAt.getTime())
            startTime.setMinutes(startTime.getMinutes() + gapTime)
            dayCandidates.push(new Event("候補", "", startTime , candidateEvent.endAt))

            startTime = new Date(googleEvent.startAt.getTime())
            startTime.setMinutes(startTime.getMinutes() - gapTime)
            candidateEvent.endAt = startTime
          }
        })
      })

      //TODO
      //dayjsに書き換える
      //所要時間を実装
      //カレンダーの横スクロール
      //カレンダーのイベント重ねる・色変える
      candidateEvents.push(...dayCandidates)
    })

    setCandidates(candidateEvents)

    setDays(
      days.map(day => {
        const dayGoogleEvents = events.filter(event => event.startAt.getDate() === day.dayNumber)
        const dayCandidates = candidateEvents.filter(event => event.startAt.getDate() === day.dayNumber)
        dayCandidates.push(...dayGoogleEvents)
        return {
          ...day, events: dayCandidates
        }
      })
    )
  }

  return (
    <CalendarContext.Provider value={{
      candidates: candidates,
      events: events,
      days: days,
      startDate,
      endDate,
      startTime,
      endTime,
      updateStartDate: updateStartDate,
      updateEndDate: updateEndDate,
      updateStartTime: updateStartTime,
      updateEndTime: updateEndTime
    }}>
      {children}
    </CalendarContext.Provider>
  )
}

