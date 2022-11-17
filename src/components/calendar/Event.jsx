const Event = props => {
  const { title, time } = props

  return (
    <div role="button" className="event" id="event-4">
      <div></div>
      <div className="event-content-wrapper">
        <div className="event-content">
          <div className="event-title">
            <span>
              <span>
                {title}
              </span>
            </span>
          </div>
          <div className="event-time">
            {time}
          </div>
          <div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Event
