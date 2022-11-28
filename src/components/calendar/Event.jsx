const Event = props => {
  const { event } = props

  const calculateY = startAt => {
    let top = 37/60*(startAt.hour()*60 + startAt.minute()) - 20 - 259
    return Math.max(top, -20)
  }

  const height = (startAt, endAt) => {
    const startY = Math.max(37/60*(startAt.hour()*60 + startAt.minute()), 259)
    const endY = 37/60*(endAt.hour()*60 + endAt.minute())
    return endY - startY
  }

  return (
    <div
      role="button"
      className="event"
      style={{
        backgroundColor: event.color,
        borderColor: event.color,
        top: calculateY(event.startAt) + "px",
        height: height(event.startAt, event.endAt) - 2 + "px",
        width: event.width + "%",
        left: event.left + "%"
      }}
    >
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
