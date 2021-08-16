import {Alert} from 'react-native';
import {removeToken} from '../../../assets/Airtable/functions';
import {analytics} from '../../../assets/Analytics';
import {AsyncStorage} from '../../../assets/AsyncStorage/functions';
import {
  auth,
  analytics as firebaseAnalytics,
  db,
  messaging,
} from '../../../assets/Firebase/Firebase';
import RNRestart from 'react-native-restart';

export const ProfileFuncs = {
  signOut: async function () {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () =>
          messaging
            .getToken()
            .then((token) => {
              return removeToken(token);
            })
            .then(async () => {
              return db.disableNetwork();
            })
            .then(() => {
              return AsyncStorage.clearSignIn();
            })
            .then(() => {
              return analytics.signout(auth.currentUser);
            })
            .then(() => {
              AsyncStorage.resetNotifications();
              return auth.signOut();
            })
            .then(() => RNRestart.Restart())
            .catch((err) => {
              Alert.alert(
                'Sign out',
                'We could not sign you out, please try again',
              );
              console.warn('Could not sign out', err);
            }),
      },
      {
        text: 'Cancel',
      },
    ]);
  },
};
