import { useEffect } from 'react'
import "../css/Calendar.css"
import HeaderDay from './calendar/HeaderDay'
import DayColumn from './calendar/DayColumn'

const Calendar = () => {
  const days = [
    {
      dayWeek: "日",
      dayNumber: 13,
      events: [
        {
          title: "機械システム学セミナー",
          time: "午前9:30~11:30"
        },
        {
          title: "機械システム学セミナー",
          time: "午前9:30~11:30"
        },
        {
          title: "機械システム学セミナー",
          time: "午前9:30~11:30"
        }
      ]
    },
    {
      dayWeek: "月",
      dayNumber: 14,
      events: []
    },
    {
      dayWeek: "火",
      dayNumber: 15,
      events: []
    },
    {
      dayWeek: "水",
      dayNumber: 16,
      events: []
    },
    {
      dayWeek: "木",
      dayNumber: 17,
      events: []
    },
    {
      dayWeek: "金",
      dayNumber: 18,
      events: []
    },
    {
      dayWeek: "土",
      dayNumber: 19,
      events: []
    },
  ]

  useEffect(() => {
    const head = document.getElementsByTagName('head')[0];

    const jqueryScript = document.createElement('script');
    jqueryScript.type = 'text/javascript';
    jqueryScript.src = 'https://code.jquery.com/jquery-3.3.1.js';
    jqueryScript.defer = true

    head.appendChild(jqueryScript);

    jqueryScript.onload = () => {
      const sideColumn = $(".side-column") // eslint-disable-line
      const scrollWindow = $(".scroll-window") // eslint-disable-line
      sideColumn.scroll(() => {
        scrollWindow.scrollTop(sideColumn.scrollTop())
      })
      scrollWindow.scroll(() => {
        sideColumn.scrollTop(scrollWindow.scrollTop())
      })
    }
  }, [])

  return (
    <div role="main">
      <h1 style={{display: "none"}}>xx年xx月xx日の週、xx件の予定</h1>
      <div>
        <div role="grid" className="calendar-grid">
          <div role="presentation" className="calendar-headers">
            <div className="header-spacer">
              <div></div>
              <div></div>
            </div>
            <div role="presentation" className="header-days-wrapper">
              <div></div>
              <div role="row" className="header-days-row-wrapper">
                <div role="presentation" className="header-days" key="1">
                  <div className="header-days-spacer"></div>
                  {
                    days.map((day, key) => <HeaderDay dayWeek={day.dayWeek} dayNumber={day.dayNumber} key={key}/>)
                  }
                </div>
              </div>
              <div role="row" className="header-row-spacer">
                <div></div>
                <div className="header-row-spacer-content">
                  <div></div>
                  <div className="header-spacer-cells">
                    {
                      [...Array(7)].map((_, key) => (
                        <div tabIndex="-1" className="header-spacer-cell" key={key}>
                          <div role="button" className="header-spacer-cell-content">
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div></div>
              </div>
              <div role="row">
                <div></div>
                <div>
                  <ul>
                    {
                      [...Array(7)].map((_, key) => (
                        <li className="long-event-box-li" key={key}></li>
                      ))
                    }
                  </ul>
                  <div className="long-event-boxes-div">
                    {
                      [...Array(7)].map((_, key) => (
                        <div className="long-event-box-div" key={key}></div>
                      ))
                    }
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
          <div role="presentation" className="calendar-content-wrapper">
            <div role="presentation" className="calendar-content">
              <div className="side-column">
                <div className="side-time-list">
                  {
                    [...Array(24)].map((_, key) => (
                      <div className="side-time" key={key}>
                        <span>午前10時</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div role="presentation" className="scroll-window">
                <div role="row" className="day-columns">
                  <div className="h-borders">
                    {
                      [...Array(24)].map((_, key) => (<div className="gap-cell" key={key}></div>))
                    }
                  </div>
                  <div className="day-column-2"></div>
                  {
                    days.map((day, key) => <DayColumn events={day.events} key={key} />)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Calendar
