import { useEffect } from 'react'
import "../css/Calendar.css"

const Calendar = () => {

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
  })

  return (
    <div role="main">
      <h1 style={{display: "none"}}>xx年xx月xx日の週、xx件の予定</h1>
      <div>
        <div role="grid" class="calendar-grid">
          <div role="presentation" class="calendar-headers">
            <div class="header-spacer">
              <div></div>
              <div></div>
            </div>
            <div role="presentation" class="header-days-wrapper">
              <div></div>
              <div role="row" class="header-days-row-wrapper">
                <div role="presentation" class="header-days">
                  <div className="header-days-spacer"></div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">日</div>
                      <div class="day-number">13</div>
                    </h2>
                  </div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">月</div>
                      <div class="day-number">14</div>
                    </h2>
                  </div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">火</div>
                      <div class="day-number">15</div>
                    </h2>
                  </div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">水</div>
                      <div class="day-number">16</div>
                    </h2>
                  </div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">木</div>
                      <div class="day-number">17</div>
                    </h2>
                  </div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">金</div>
                      <div class="day-number">18</div>
                    </h2>
                  </div>
                  <div role="columnheader" class="header-day">
                    <div className="header-day-border"></div>
                    <h2 class="header-day-content">
                      <div class="day-week">土</div>
                      <div class="day-number">19</div>
                    </h2>
                  </div>
                </div>
              </div>
              <div role="row" className="header-row-spacer">
                <div></div>
                <div className="header-row-spacer-content">
                  <div></div>
                  <div className="header-spacer-cells">
                    {
                      [...Array(7)].map(() => (
                        <div tabindex="-1" class="header-spacer-cell">
                          <div role="button" class="header-spacer-cell-content">
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
                      [...Array(7)].map(() => (
                        <li className="long-event-box-li"></li>
                      ))
                    }
                  </ul>
                  <div className="long-event-boxes-div">
                    {
                      [...Array(7)].map(() => (
                        <div className="long-event-box-div"></div>
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
                    [...Array(24)].map(() => (
                      <div className="side-time">
                        <span>午前10時</span>
                      </div>
                    ))
                  }
                </div>
              </div>
              <div role="presentation" className="scroll-window">
                <div role="row" className="day-columns">
                  <div class="h-borders">
                    {
                      [...Array(24)].map(() => (<div class="gap-cell"></div>))
                    }
                  </div>
                  <div className="day-column-2"></div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events"></div>
                  </div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events">
                      <div role="button" class="event">
                        <div></div>
                        <div>
                          <div class="event-content">
                            <div class="event-title">
                              <span class="event-title-span">
                                <span>
                                  機械システム学セミナー
                                </span>
                              </span>
                            </div>
                            <div class="event-time">
                              午前9:30~11:30
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events">
                      <div role="button" class="event">
                        <div></div>
                        <div>
                          <div class="event-content">
                            <div class="event-title">
                              <span>
                                <span>
                                  機械システム学セミナー
                                </span>
                              </span>
                            </div>
                            <div class="event-time">
                              午前9:30~11:30
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div role="button" class="event">
                        <div></div>
                        <div>
                          <div class="event-content">
                            <div class="event-title">
                              <span>
                                <span>
                                  機械システム学セミナー
                                </span>
                              </span>
                            </div>
                            <div class="event-time">
                              午前9:30~11:30
                            </div>
                            <div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events"></div>
                  </div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events"></div>
                  </div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events"></div>
                  </div>
                  <div role="gridcell" class="day-column">
                    <h2></h2>
                    <div></div>
                    <div role="presentation" className="events"></div>
                  </div>
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
