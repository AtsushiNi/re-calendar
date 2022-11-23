import { createContext, useState, useContext, useEffect } from 'react'
import dayjs from 'dayjs'
import Event from '../models/Event'

const CalendarContext = createContext({ candidates: [] })

export function useCalendarContext() {
  return useContext(CalendarContext)
}

export function CalendarProvider({ children }) {
  const [startDate, setStartDate] = useState(dayjs())
  const [endDate, setEndDate] = useState(dayjs().add(2, 'w'))
  const [startTime, setStartTime] = useState(dayjs().hour(10).minute(0).second(0))
  const [endTime, setEndTime] = useState(dayjs().hour(22).minute(0).second(0))

  const [candidates, setCandidates] = useState([])

  useEffect(() => {
    createCandidates()
  }, [startDate, endDate, startTime, endTime])

  const updateStartDate = (value) => setStartDate(value)

  const createCandidates = () => {
    const diff = endDate.diff(startDate, 'day') + 1

    let events = [];
    [...Array(diff)].map((_, i) => {
      const startAt = startDate.add(i, 'd').hour(startTime.hour()).minute(startTime.minute()).second(0)
      const endAt = startDate.add(i, 'd').hour(endTime.hour()).minute(endTime.minute()).second(0).subtract(1, 's')
      events.push(
        new Event("候補", "", startAt.toDate(), endAt.toDate())
      )
    })

    setCandidates(events)
  }

  return <CalendarContext.Provider value={{ candidates: candidates, updateStartDate: updateStartDate }}>
    {children}
  </CalendarContext.Provider>
}
