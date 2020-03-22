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
        // console.log(events);

        // const today = document.querySelector('.today');
        // const tommorow = document.querySelector('.tommorow');
        // const week = document.querySelector('.week');
        // if (getEventsInPeriod(events, 0, 0))
        //     today.innerHTML = `Today:` + getEventsInPeriod(events, 0, 0, false);
        // if (getEventsInPeriod(events, 1, 0))
        //     tommorow.innerHTML = `Tommorow:` + getEventsInPeriod(events, 1, 0, false);
        // if (getEventsInPeriod(events, 2, 4))
        //     week.innerHTML = `Weekly:` + getEventsInPeriod(events, 2, 4, true);
    });
}


module.exports = {
    getToken: getToken,
    getEvents: getEvents
}

// function getEventsInPeriod(events, skip, period, dayname) {

//     DayName = new Array(7)
//     DayName[0] = "Niedziela"
//     DayName[1] = "Poniedziałek"
//     DayName[2] = "Wtorek"
//     DayName[3] = "Środa"
//     DayName[4] = "Czwartek"
//     DayName[5] = "Piątek"
//     DayName[6] = "Sobota"

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() + skip);
//     if (skip !== 0) {
//         startDate.setHours(0);
//         startDate.setMinutes(0);
//         startDate.setSeconds(0);
//         startDate.setMilliseconds(0);
//     }
//     const finishDate = new Date();
//     finishDate.setDate(startDate.getDate() + period);
//     finishDate.setHours(0);
//     finishDate.setMinutes(0);
//     finishDate.setSeconds(0);
//     finishDate.setMilliseconds(0);
//     finishDate.setDate(finishDate.getDate() + 1);
//     finishDate.setTime(finishDate.getTime() - 1);

//     let result = ``;
//     events.map((event) => {
//         const date = event.start.dateTime || event.start.date;
//         const eventDate = new Date(date);
//         if (eventDate.getTime() > startDate.getTime() && eventDate.getTime() < finishDate.getTime()) {
//             if (dayname) {
//                 const day = (DayName[eventDate.getDay()]);
//                 result = result + `<li>${day} - ${formatDigits(eventDate.getUTCHours() + 1)}:${formatDigits(eventDate.getUTCMinutes())} - ${event.summary}</li>`
//             } else {
//                 result = result + `<li>${formatDigits(eventDate.getUTCHours() + 1)}:${formatDigits(eventDate.getUTCMinutes())} - ${event.summary}</li>`
//             }
//         }
//     })
//     return result;
// }

// function formatDigits(digits) {
//     if (digits < 10) {
//         return '0' + digits;
//     }
//     return digits;
// }

