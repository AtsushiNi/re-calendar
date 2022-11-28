

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const calendarAPI = require('@googleapis/calendar');

    const jose = require('node-jose')

    try {
        // Google OAuth2
        const token = event.headers["Authorization"]
        const sections = token.split('.')
        let payload = jose.util.base64url.decode(sections[1])
        payload = JSON.parse(payload)

        const googleAccessToken = payload["custom:access_token"]
        const calendar = calendarAPI.calendar({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        })

        // 表示中のカレンダー一覧を取得
        const res = await calendar.calendarList.list()

        let calendarList = res.data.items.filter(item => item.selected)
        calendarList = calendarList.map(item => {
          return {
            id: item.id,
            summary: item.summary,
            backgroundColor: item.backgroundColor,
            foregroundColor: item.foregroundColor,
            colorId: item.colorId,
            events: []
          }
        })

        // それぞれのカレンダーのイベント一覧を取得
        const now = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(now.getDate() + 7)

        let results = []
        calendarList.forEach(calendarItem => {
          results.push(
            calendar.events.list({
              calendarId: calendarItem.id,
              timeMin: now.toISOString(),
              timeMax: nextWeek.toISOString(),
              singleEvents: true
            })
          )
        })
        const result = await Promise.all(results)
        result.forEach((res, index) => {
          calendarList[index].events = res.data.items.map(event => {
              return {
                  summary: event.summary,
                  start: event.start,
                  end: event.end
          }})
        })

        return {
            statusCode: 200,
        //  Uncomment below to enable CORS requests
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
            body: JSON.stringify(calendarList),
        };
    } catch(error) {
        console.log(error.message)
    }
};
