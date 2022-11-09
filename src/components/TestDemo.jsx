import {
  SyntheticEvent,
  useState,
} from 'react';

import ApiCalendar from 'react-google-calendar-api';

const config = {
  "clientId": "643442205789-17ivdmmrloaft98n2ot4m4cmu4h0mqtc.apps.googleusercontent.com",
  "apiKey": "AIzaSyD2zwYjeWCYVp72ZFTkDNWGs9nK5Ex_WU0",
  "scope": "https://www.googleapis.com/auth/calendar",
  "discoveryDocs": [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
}

const apiCalendar = new ApiCalendar(config)

const TestDemo = () => {
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  const handleItemClick = (event: SyntheticEvent<any>, name: string): void => {
    if (name === 'sign-in') {
      apiCalendar.handleAuthClick()
    } else if (name === 'sign-out') {
      apiCalendar.handleSignoutClick();
    }
  };

  return (
    <div>
      <div style={{ padding: "0.5em" }}>
        <button onClick={(e) => handleItemClick(e, "sign-in")}>sign-in</button>
      </div>
      <div style={{ padding: "0.5em" }}>
        <button
          onClick={(e) => {
            apiCalendar.listUpcomingEvents(10).then(({ result }: any) => {
              console.log(result.items);
              setEvents(result.items);
            });
          }}
        >
          List upcoming events
        </button>
        <div>
          <h4>Events</h4>
          {events.length === 0 && <p>No events to show</p>}
          {events.map((event) => (
            <p key={event.id}>{JSON.stringify(event)}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestDemo
