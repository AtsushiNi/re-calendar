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

  const defaultDays = [...Array(endDate.diff(startDate, 'day') + 1)].map((_, i) => {
    const day = startDate.add(i, 'day')
    return {
      dayNumber: day.date(),
      dayWeek: day.format('ddd'),
      events: []
    }
  })
  const [days, setDays] = useState(defaultDays)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createCandidates()
  }, [useCalendarIDs, startTime, endTime, requiredTime, gapTime])

  useEffect(() => createCandidates(), [calendars])

  // ログイン直後に認証が成功するとカレンダーを読み込む
  useEffect(() => {
    !!currentUser && getCalendars()
  }, [!!currentUser, startDate, endDate])

  const updateUseCalendarIDs = value => setUseCalendarIDs(value)
  const updateRequiredTime = value => setRequiredTime(value)
  const updateGapTime = value => setGapTime(value)
  const updateStartDate = value => setStartDate(value)
  const updateEndDate = value => setEndDate(value)
  const updateStartTime = value => setStartTime(value)
  const updateEndTime = value => setEndTime(value)

  const getCalendars = async() => {
    setLoading(true)

    const token = currentUser.signInUserSession.idToken.jwtToken
    const myInit = {
      headers: {
        Authorization: token
      },
      queryStringParameters: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
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

    setLoading(false)
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
      //detailの各種コントロール
      //文字列の出力
      //候補をクリックで編集
      candidateEvents.push(...dayCandidates)
    })

    setCandidates(candidateEvents)

    let newDays = [...Array(endDate.diff(startDate, 'day') + 1)].map((_, i) => {
      const day = startDate.add(i, 'day')
      return {
        dayNumber: day.date(),
        dayWeek: day.format('ddd'),
        events: []
      }
    })

    setDays(
      newDays.map(day => {
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
      updateUseCalendarIDs,
      updateRequiredTime,
      updateGapTime,
      updateStartDate,
      updateEndDate,
      updateStartTime,
      updateEndTime,
      loading
    }}>
      {children}
    </CalendarContext.Provider>
  )
}

