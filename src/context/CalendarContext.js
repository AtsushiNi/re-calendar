import { createContext, useState, useContext, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { API } from 'aws-amplify'

import Event from '../models/Event'
import { useAuthContext } from './AuthContext'

dayjs.locale('ja')

const CalendarContext = createContext({ candidates: [] })

export function useCalendarContext() {
  return useContext(CalendarContext)
}

export function CalendarProvider({ children }) {
  const { currentUser, signOut } = useAuthContext()

  const today = dayjs()
  const defaultDays = [...Array(7)].map((_, i) => {
    const day = today.add(i, 'day')

    return {
      dayNumber: day.date(),
      dayWeek: day.format('ddd'),
      events: []
    }
  })

  const [useCalendarIDs, setUseCalendarIDs] = useState([])
  const [requiredTime, setRequiredTime] = useState(60)
  const [gapTime, setGapTime] = useState(30)
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs().add(2, 'w'))
  const [startTime, setStartTime] = useState(dayjs().hour(10).minute(0).second(0))
  const [endTime, setEndTime] = useState(dayjs().hour(22).minute(0).second(0))

  const [calendars, setCalendars] = useState([])
  const [candidates, setCandidates] = useState([])
  const [events, setEvents] = useState([])
  const [days, setDays] = useState(defaultDays)

  useEffect(() => {
    createCandidates()
  }, [startTime, endTime, requiredTime, gapTime])

  useEffect(() => createCandidates(), [calendars])

  // ログイン直後に認証が成功するとカレンダーを読み込む
  useEffect(() => {
    !!currentUser && getCalendars()
  }, [!!currentUser])

  const updateRequiredTime = value => setRequiredTime(value)
  const updateGapTime = value => setGapTime(value)
  const updateStartDate = value => setStartDate(value)
  const updateEndDate = value => setEndDate(value)
  const updateStartTime = value => setStartTime(value)
  const updateEndTime = value => setEndTime(value)

  const getCalendars = async() => {
    const token = currentUser.signInUserSession.idToken.jwtToken
    const myInit = {
      headers: {
        Authorization: token
      }
    }

    let result
    try {
      result = await API.get("getCalendars", "/calendars", myInit)
    } catch (error) {
      console.log(error)
      // signOut()
    }

    result.forEach(calendar => {
      let googleEvents = calendar.events.map(item => {
        let startAt = null
        let endAt = null
        if(item.start.date) {
          startAt = dayjs(item.start.date).startOf('day')
          endAt = dayjs(item.end.date).subtract(1, 'day').endOf('day')
        } else {
          startAt = dayjs(item.start.dateTime)
          endAt = dayjs(item.end.dateTime)
        }
        const title = item.summary

        return new Event(title, "", startAt, endAt, calendar.colorId)
      })

      // 複数日にまたがる予定は毎日分Eventを作る
      googleEvents
        .filter(event => event.startAt.date() !== event.endAt.date())
        .forEach(startDateEvent => {
          // イベント終了日
          let finishDateEvent = startDateEvent.copy()
          finishDateEvent.startAt = startDateEvent.endAt.startOf('day')
          googleEvents.push(finishDateEvent)

          // イベント開始日
          startDateEvent.startAt.endOf('day')

          // イベント中日
          let middleDateEvent = startDateEvent.copy()
          middleDateEvent.startAt = middleDateEvent.startAt.startOf('day')
          while(true) {
            middleDateEvent = middleDateEvent.copy()
            middleDateEvent.startAt = middleDateEvent.startAt.add(1, 'day')
            middleDateEvent.endAt = middleDateEvent.endAt.add(1, 'day')
            if (middleDateEvent.startAt.date() === finishDateEvent.startAt.date()) {
              break
            }
            googleEvents.push(middleDateEvent)
          }
        })

      calendar.events = googleEvents
    })

    setCalendars(result)
    setUseCalendarIDs(result.map(item => item.id))
  }

  const createCandidates = () => {
    const diff = endDate.diff(startDate, 'day') + 1

    let candidateEvents = [];
    [...Array(diff)].map((_, i) => {
      const startAt = startDate.add(i, 'd').hour(startTime.hour()).minute(startTime.minute()).second(0)
      const endAt = startDate.add(i, 'd').hour(endTime.hour()).minute(endTime.minute()).second(0).subtract(1, 's')

      let dayCandidates = [new Event("候補", "", startAt, endAt)]
      calendars
        .filter(item => useCalendarIDs.indexOf(item.id) > -1)
        .forEach(googleCalendar => {
          googleCalendar.events.forEach(googleEvent => {
            dayCandidates.forEach(candidateEvent => {
              // googleEventとcandidateEventが被っていたら、candidateEventを削る
              if(googleEvent.startAt.subtract(gapTime, 'minute').isBefore(candidateEvent.startAt) && googleEvent.endAt.add(gapTime, 'minute').isBetween(candidateEvent.startAt, candidateEvent.endAt)) {
                candidateEvent.startAt = googleEvent.endAt.add(gapTime, 'minute')
              } else if(googleEvent.startAt.subtract(gapTime, 'minute').isBetween(candidateEvent.startAt, candidateEvent.endAt) && googleEvent.endAt.add(gapTime, 'minute').isAfter(candidateEvent.endAt)) {
                candidateEvent.endAt = googleEvent.startAt.subtract(gapTime, 'minute')
              } else if(googleEvent.startAt.subtract(gapTime, 'minute').isBefore(candidateEvent.startAt) && googleEvent.endAt.add(gapTime, 'minute').isAfter(candidateEvent.endAt)) {
                dayCandidates = dayCandidates.filter(event => event !== candidateEvent)
              } else if(googleEvent.startAt.subtract(gapTime, 'minute').isAfter(candidateEvent.startAt) && googleEvent.endAt.add(gapTime, 'minute').isBefore(candidateEvent.endAt)) {
                dayCandidates.push(new Event("候補", "", googleEvent.endAt.add(gapTime, 'minute') , candidateEvent.endAt.clone()))
                candidateEvent.endAt = googleEvent.startAt.subtract(gapTime, 'minute')
              }
            })
          })
        })

      // 所要時間より短い候補は消す
      dayCandidates = dayCandidates.filter(event => event.endAt.add(1, 'second').diff(event.startAt, 'minute') >= requiredTime)

      //TODO
      //カレンダーの横スクロール
      //カレンダーのイベント重ねる・色変える
      //複数カレンダーの実装
      //一日の予定は高さを調整する
      candidateEvents.push(...dayCandidates)
    })

    setCandidates(candidateEvents)

    setDays(
      days.map(day => {
        const dayGoogleEvents = calendars.filter(item => useCalendarIDs.indexOf(item.id) > -1).map(item => item.events.filter(event => event.startAt.date() === day.dayNumber)).flat()
        const dayCandidates = candidateEvents.filter(event => event.startAt.date() === day.dayNumber)
        dayCandidates.push(...dayGoogleEvents)
        return {
          ...day, events: dayCandidates
        }
      })
    )
  }

  return (
    <CalendarContext.Provider value={{
      calendars,
      useCalendarIDs,
      candidates,
      events,
      days,
      requiredTime,
      gapTime,
      startDate,
      endDate,
      startTime,
      endTime,
      updateRequiredTime,
      updateGapTime,
      updateStartDate,
      updateEndDate,
      updateStartTime,
      updateEndTime
    }}>
      {children}
    </CalendarContext.Provider>
  )
}

