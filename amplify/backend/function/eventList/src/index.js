

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const calendarAPI = require('@googleapis/calendar');

    const jose = require('node-jose')

    try {
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
        const now = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(now.getDate() + 7)
        const res = await calendar.events.list({
            calendarId: 'primary',
            timeMin: now.toISOString(),
            timeMax: nextWeek.toISOString()
        })
        const events = res.data.items.map(event => {
            return {
                summary: event.summary,
                start: event.start,
                end: event.end
        }})

        return {
            statusCode: 200,
        //  Uncomment below to enable CORS requests
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(events),
        };

    } catch(error) {
        console.log(JSON.stringify(error))
        console.log(error.response)
        console.log(error.message)
    }
};
