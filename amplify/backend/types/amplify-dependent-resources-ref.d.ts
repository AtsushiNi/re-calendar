export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "recalendarf855c784": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "HostedUIDomain": "string",
            "OAuthMetadata": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "eventList": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "calendarList": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "getCalendars": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "eventList": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "calendarList": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "getCalendars": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}