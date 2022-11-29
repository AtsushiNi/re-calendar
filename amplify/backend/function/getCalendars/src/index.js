

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const calendarAPI = require('@googleapis/calendar');

    const jose = require('node-jose')

    const parameters = event.queryStringParameters
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
        // lambdaは日本時間が使えないので換算
        let startDate = new Date((new Date(parameters.startDate)) + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
        startDate.setHours(0,0,0,0)
        startDate = new Date(startDate - ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))

        let endDate = new Date((new Date(parameters.endDate)) + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))
        endDate.setHours(23,59,59,999)
        endDate = new Date(endDate - ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000))

        let results = []
        calendarList.forEach(calendarItem => {
          results.push(
            calendar.events.list({
              calendarId: calendarItem.id,
              timeMin: startDate.toISOString(),
              timeMax: endDate.toISOString(),
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
