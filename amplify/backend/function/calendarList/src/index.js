

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    const {google} = require('googleapis');

    const AWS = require('aws-sdk')
    const jose = require('node-jose')

    try {
        const token = event.headers["Authorization"]
        const sections = token.split('.')
        let payload = jose.util.base64url.decode(sections[1])
        payload = JSON.parse(payload)

        const googleAccessToken = payload["custom:access_token"]
        const calendar = google.calendar({
            version: 'v3',
            headers: {
                Authorization: `Bearer ${googleAccessToken}`
            }
        })

        const res = await calendar.calendarList.list()

        let calendarList = res.data.items.filter(item => item.selected)
        calendarList = calendarList.map(item => {
          return {
            id: item.id,
            summary: item.summary,
            backgroundColor: item.backgroundColor
          }
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
