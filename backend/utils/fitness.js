const fs = require('fs');
const { google } = require('googleapis');

function getToken(code) {
  return new Promise((resolve, reject) => {
    fs.promises.readFile('utils/credentials.json').then(data => {
      authorizeToken(JSON.parse(data), code, resolve);
    });
  });
}

function authorizeToken(credentials, code, resolve) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  return getAccessToken(oAuth2Client, code, resolve);
}

function getAccessToken(oAuth2Client, code, resolve) {
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    resolve(token);
  });
}

function getFitness(token) {
  return new Promise((resolve, reject) => {
    fs.promises.readFile('utils/credentials.json').then(data => {
      authorize(JSON.parse(data), token, resolve);
    });
  });
}

function authorize(credentials, token, resolve) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(JSON.parse(token));
  listFitness(oAuth2Client, resolve);
}

function listFitness(auth, resolve) {

    const startDate = new Date();
    startDate.setHours(0);
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    startDate.setMilliseconds(0);
    startDate.setDate(startDate.getDate() - 1);


  const fitness = google.fitness({ version: 'v1', auth });

  fitness.users.dataset.aggregate(
    {
      userId: 'me',
      resource: {
        aggregateBy: [
          {
            dataSourceId:
              'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
          }
        ],
        bucketByTime: {
          durationMillis: 86400000
        },
        startTimeMillis: startDate.getTime(),
        endTimeMillis: startDate.getTime()+(2*86400000)
      }
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const steps = res.data.bucket;
      resolve(steps);
    }
  );
}

module.exports = {
  getToken: getToken,
  getFitness: getFitness
};
