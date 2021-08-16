import Airtable from 'airtable';
import {Platform, Alert} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import {auth} from '../Firebase/Firebase';

const API_KEY = 'keyIUNtxniyBauoVn';

const fcm = new Airtable({apiKey: API_KEY}).base('appOXVfqFCJGee5KS');
const emails = new Airtable({apiKey: API_KEY}).base('apphtMo2vEtgp6IQg');
const tags = new Airtable({apiKey: API_KEY}).base('appHe5CWHGqSHbejn');

export function uploadEmailDomain(emailDomain = String) {
  emails('Table 1')
    .create({
      'Email Domain': emailDomain,
      'Timestamp (ms)': Date.now(),
      Platform: Platform.OS,
    })
    .then(() =>
      console.log('Uploaded requested email domain to Airtable', emailDomain),
    )
    .catch((err) =>
      console.warn('Could not upload email domain to Airtable', err),
    );
}

export async function getTagColors() {
  return tags('Colors')
    .select({
      maxRecords: 100,
      view: 'Grid view',
    })
    .all()
    .then((records) => {
      const colors = {};
      records.forEach(
        (record) => (colors[record.fields['Tag']] = record.fields['Color']),
      );
      return colors;
    })
    .catch((err) => {
      console.warn('Error occurred when retrieving all tag colors', err);
      return false;
    });
}
export async function getAllTags() {
  var base = new Airtable({apiKey: 'keyIUNtxniyBauoVn'}).base(
    'appHe5CWHGqSHbejn',
  );

  return base('Colors')
    .select({
      maxRecords: 100,
      view: 'Grid view',
    })
    .all()
    .then((records) => {
      const colors = [];
      records.forEach((record) => colors.push(record.fields['Tag']));
      return colors;
    })
    .catch((err) => {
      console.warn('Error occurred when retrieving all tag colors', err);
      return false;
    });
}
export async function createTag(tag) {
  var base = new Airtable({apiKey: 'keyIUNtxniyBauoVn'}).base(
    'appHe5CWHGqSHbejn',
  );
  const color = colors[Math.floor(Math.random() * colors.length)];
  base('Colors')
    .create({
      Tag: tag,
      Color: color,
    })
    .then(() => {
      console.log('Successfully created new tag');
      Alert.alert('Tag Created', 'Hurray! You have created a new tag');
    })
    .catch((err) => {
      console.warn('Could not create a new tag', err);
      Alert.alert(
        'Tag Not Created',
        'Damn it, something went wrong when you created your tag, please try again later',
      );
    });
}

const colors = [
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#3366E6',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
  '#809900',
  '#E6B3B3',
  '#6680B3',
  '#66991A',
  '#FF99E6',
  '#CCFF1A',
  '#FF1A66',
  '#E6331A',
  '#33FFCC',
  '#66994D',
  '#B366CC',
  '#4D8000',
  '#B33300',
  '#CC80CC',
  '#66664D',
  '#991AFF',
  '#E666FF',
  '#4DB3FF',
  '#1AB399',
  '#E666B3',
  '#33991A',
  '#CC9999',
  '#B3B31A',
  '#00E680',
  '#4D8066',
  '#809980',
  '#E6FF80',
  '#1AFF33',
  '#999933',
  '#FF3380',
  '#CCCC00',
  '#66E64D',
  '#4D80CC',
  '#9900B3',
  '#E64D66',
  '#4DB380',
  '#FF4D4D',
  '#99E6E6',
  '#6666FF',
];
export async function removeToken(token) {
  fcm('FCM Tokens')
    .select({
      filterByFormula: `{token} = \"${token}\"`,
    })
    .all()
    .then(async (snap) => {
      const ids = snap.map((elem) => {
        return elem.id;
      });
      fcm('FCM Tokens')
        .destroy(ids)
        .then((info) => {
          return;
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      throw err;
    });
}
export async function updateDeviceTokenFCM(token) {
  const uid = (auth.currentUser || {}).uid;
  if (!(await deviceInfoModule.isEmulator()) && uid) {
    const exists = await isTokenRegistered(token);

    if (uid) {
      if (!exists || exists.length == 0)
        fcm('FCM Tokens')
          .create({
            uid: (auth.currentUser || {}).uid,
            token: token,
            platform: Platform.OS,
            timestamp: Date.now(),
          })
          .then(() => console.log('FCM Token uploaded'))
          .catch((err) => console.warn('Could not upload FCM Token', err));
      // Update first token received
      else {
        fcm('FCM Tokens')
          .update([
            {
              id: exists[0].id,
              fields: {
                uid: (auth.currentUser || {}).uid,
                token: token,
                platform: Platform.OS,
                timestamp: Date.now(),
              },
            },
          ])
          .then((res) => console.log('Updated FCM Token data', res))
          .catch((err) => console.warn('Could not update FCM Token', err));

        // If there's more than one with the same token, delete the others
        if (exists.length > 1) {
          const ids = exists.slice(1).map((elem) => {
            return elem.id;
          });
          fcm('FCM Tokens')
            .destroy(ids)
            .then((res) => console.log('Deleted FCM Tokens', res))
            .catch((err) => console.warn('Could not delete FCM Tokens', err));
        }
      }
    }
  }
}
async function isTokenRegistered(token) {
  return fcm('FCM Tokens')
    .select({
      filterByFormula: `{token} = \"${token}\"`,
    })
    .all()
    .then(async (res) => {
      if (res.length == 0) return false;
      else
        return res.filter(
          (elem) =>
            elem.fields.token == token &&
            elem.fields.uid == (auth.currentUser || {}).uid &&
            elem.fields.platform == Platform.OS,
        );
    })
    .catch((err) => {
      console.warn('Could not get tokens', err);
      return false;
    });
}
