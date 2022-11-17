import Event from './Event'

const DayColumn = props => {
  const { events } = props

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
