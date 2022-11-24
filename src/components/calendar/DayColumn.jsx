import Event from './Event'

const DayColumn = props => {
  const { events } = props

  events.sort((a, b) => {
    if(a.startAt.isBefore(b.startAt)) return -1
    if(a.startAt.isAfter(b.startAt)) return 1
    if(a.endAt.isBefore(b.endAt)) return -1
    if(a.endAt.isAfter(b.endAt)) return 1
    return 0
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
