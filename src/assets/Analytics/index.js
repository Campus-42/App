import {Platform} from 'react-native';
import VersionInfo from 'react-native-version-info';
import {AsyncStorage} from '../AsyncStorage/functions';
import {Server} from '../Server';
import {auth, crashlytics, db, firebaseAnalytics} from '../Firebase/Firebase';

export const c42_api_key = 'JBJB732jksnkl68HJH';
export var url = 'http://192.168.0.16:8923';

const eventUrl = () => `${url}/analytics/event/?api_key=${c42_api_key}`;
const errorUrl = () => `${url}/analytics/error/?api_key=${c42_api_key}`;

const sessionId = Date.now().toString(); // This is explicitly set so that it can be properly reused without changing session id

// Get the device info to send to analytics
const deviceInfo = {
  platform: Platform.OS,
  platform_version: Platform.Version,
  app_version: VersionInfo.appVersion,
  build_version: VersionInfo.buildVersion,
  time_offset: new Date().getTimezoneOffset(),
  session: false,
};

// Update the device info with the necessary info
export async function updateAnalyticsInfo() {
  await AsyncStorage.getCampusKey()
    .then((key) => (deviceInfo.campus_key = key))
    .catch(() => {
      deviceInfo.campus_key = undefined;
    });

  db.collection('general')
    .doc('server')
    .get()
    .then((doc) => {
      url = doc.data().server_url;
      Server.reloadUrl(doc.data().server_url);
    })
    .catch(console.warn);

  // Chec for valid uid and then update
  const uid = auth.currentUser !== null ? auth.currentUser.uid : undefined;
  deviceInfo.uid = uid;

  // Get the device token and merge with session id to create truly unique session id
  const token = auth.currentUser !== null ? auth.currentUser.uid : 'no-uid';
  deviceInfo.session = `${token}/${sessionId}`;
}

// Declare get and post function to use
async function post(url, data) {
  if (crashlytics.isCrashlyticsCollectionEnabled)
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...data, timestamp: Date.now(), ...deviceInfo}),
    })
      .then((response) => response.json())
      .then((res) => console.log('Post successful: ' + data.type, res))
      .catch((err) =>
        console.warn('Could not send post request to analytics', err),
      );
}

// Export the functions to the app
export const analytics = {
  error: function (
    err = undefined,
    file = undefined,
    component = undefined,
    {...params},
  ) {
    console.log(`Error at ${component} at ${file}\n`, err);
    crashlytics.recordError(new Error(err.toString()), `${file}/${component}`);
    post(errorUrl(), {
      type: 'error',
      data: {...params, err, file, component},
    });
  },
  breadcrumb: function (
    text = undefined,
    file = undefined,
    component = undefined,
    {...params},
  ) {
    /**
     * Leave breadcrumbs so that we can trace the user's use of the app to solve bugs
     */
    console.log('Breadcrumb', text);
    crashlytics.log(text);
    post(eventUrl(), {
      type: 'breadcrumb',
      session: deviceInfo.session,
      data: {...params, file, text, component},
    });
  },
  screen: function (route = {}) {
    firebaseAnalytics.logScreenView({
      screen_class: route.name,
      screen_name: route.name,
    });
    post(eventUrl(), {
      type: 'screen',
      data: route,
    });
  },
  signin: function (currentUser) {
    firebaseAnalytics.logLogin({method: 'password'});

    post(eventUrl(), {
      type: 'signin',
      data: {uid: currentUser.uid},
    });
  },
  signout: function (currentUser) {
    post(eventUrl(), {
      type: 'signout',
      data: {uid: currentUser.uid},
    });
  },
  appstate: function (state) {
    if (state === 'active') firebaseAnalytics.logAppOpen();

    post(eventUrl(), {
      type: `appstate.${state}`,
      data: {uid: deviceInfo.uid},
    });
  },
  leftBubble: function (bubble) {
    firebaseAnalytics.logEvent('joinedBubble', {bubble});
    post(eventUrl(), {
      type: 'leftBubble',
      data: {bubble},
    });
  },
  joinedBubble: function (bubble) {
    firebaseAnalytics.logEvent('joinedBubble', {bubble});
    post(eventUrl(), {
      type: 'joinedBubble',
      data: {bubble},
    });
  },
  leftSociety: function (society, campusKey) {
    firebaseAnalytics.logEvent('leftSociety', {society, campusKey});
    post(eventUrl(), {
      type: 'leftSociety',
      data: {society, campusKey},
    });
  },
  joinedSociety: function (society, campusKey) {
    firebaseAnalytics.logEvent('joinedSociety', {society, campusKey});
    post(eventUrl(), {
      type: 'joinedSociety',
      data: {society, campusKey},
    });
  },
  leftEvent: function (event, campusKey) {
    firebaseAnalytics.logEvent('leftEvent', {event, campusKey});
    post(eventUrl(), {
      type: 'leftEvent',
      data: {event, campusKey},
    });
  },
  joinedEvent: function (event, campusKey) {
    firebaseAnalytics.logEvent('joinedEvent', {event, campusKey});
    post(eventUrl(), {
      type: 'joinedEvent',
      data: {event, campusKey},
    });
  },
  referralDetected: function (url) {
    firebaseAnalytics.logEvent('referralDetected', {url});
    post(eventUrl(), {
      type: 'referralDetected',
      data: {url},
    });
  },

  _reload: function () {
    /**
    Reload the device information for this session
    This includes server url and specific device specs
  */
    updateAnalyticsInfo();
  },
};
