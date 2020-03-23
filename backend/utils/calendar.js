const fs = require('fs');
const { google } = require('googleapis');

function getToken(code) {
    return new Promise((resolve, reject) => {
        fs.promises.readFile('utils/credentials.json').then((data) => {
            authorizeToken(JSON.parse(data), code, resolve);
        });
    })
}

function authorizeToken(credentials, code, resolve) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    return getAccessToken(oAuth2Client, code, resolve);
}

function getAccessToken(oAuth2Client, code, resolve) {
    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        resolve(token);
    });
}

function getEvents(token) {
    return new Promise((resolve, reject) => {
        fs.promises.readFile('utils/credentials.json').then((data) => {
            authorize(JSON.parse(data), token, resolve);
        });
    })
}


function authorize(credentials, token, resolve) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    oAuth2Client.setCredentials(JSON.parse(token));
    listEvents(oAuth2Client, resolve);
}

function listEvents(auth, resolve) {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        resolve(events);
    });
}


module.exports = {
    getToken: getToken,
    getEvents: getEvents
}
