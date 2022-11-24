const Event = props => {
  const { event } = props

  const calculateY = startAt => {
    return 37/60*(startAt.hour()*60 + startAt.minute()) - 20 - 259
  }

  const height = (startAt, endAt) => {
    const startY = 37/60*(startAt.hour()*60 + startAt.minute())
    const endY = 37/60*(endAt.hour()*60 + endAt.minute())
    return endY - startY
  }

  return (
    <div role="button" className="event" id="event-4" style={{top: calculateY(event.startAt) + "px", height: height(event.startAt, event.endAt) + "px"}}>
      <div></div>
      <div className="event-content-wrapper">
        <div className="event-content">
          <div className="event-title">
            <span>
              <span>
                {event.title}
              </span>
            </span>
          </div>
          <div className="event-time">
            {event.time}
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Event
