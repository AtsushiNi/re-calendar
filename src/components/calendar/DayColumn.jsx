import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import Event from './Event'

dayjs.extend(isSameOrBefore)

const DayColumn = props => {
  const { events } = props

  events.sort((a, b) => {
    if(a.startAt.isBefore(b.startAt)) return -1
    if(a.startAt.isAfter(b.startAt)) return 1
    if(a.endAt.isBefore(b.endAt)) return -1
    if(a.endAt.isAfter(b.endAt)) return 1
    return 0
  })

  // eventの重なり表示を計算
  // しっかり重なってる
  events.forEach(event => {
    const nowEvents = events.filter(item => item.startAt.isSameOrBefore(event.startAt) && item.endAt.isAfter(event.startAt) && item.startAt.isAfter(event.startAt.subtract(1, 'hour')))
    nowEvents.forEach((item, index) => {
      const width = 100 / (index + 1)
      if (item.width > width) { item.width = width }
      const left = 100 - width
      if (item.left < left) { item.left = left }
    })
  })

  // 表示は重ならないけど時間は被ってる
  events.forEach(event => {
    const nowEvents = events.filter(item => item.startAt.isSameOrBefore(event.startAt) && item.endAt.isAfter(event.startAt) && !item.startAt.isAfter(event.startAt.subtract(1, 'hour')))
    nowEvents.forEach((item, index) => {
      const width = 100 - index * 5
      if (item.width > width) { item.width = width }
      const left = 5 * index
      if (item.left < left) { item.left = left }
    })
  })

  return (
    <div role="gridcell" className="day-column">
      <h2></h2>
      <div></div>
      <div role="presentation" className="events">
        {
          events.map((event, key) => <Event event={event} key={key} />)
        }
      </div>
    </div>
  )
}

export default DayColumn
