import Geolocation from '@react-native-community/geolocation';
import {Alert, Linking} from 'react-native';
import {Store} from '../redux/store';

export async function getCurrentPosition() {
  return (
    Geolocation.getCurrentPosition(async (position) => {
      return position.coords;
    }),
    async (err) => {
      console.warn("Could not get user's current position", err);
      Alert.alert(
        'Position Error',
        'We could not retrieve your current position, please change the location settings',
        [
          {text: 'Settings', onPress: () => Linking.openSettings()},
          {text: 'Ok'},
        ],
      );
      return false;
    }
  );
}

export async function updateReduxWithCurrentPosition(whenDoneFunc) {
  Geolocation.getCurrentPosition(
    (position) => {
      Store.dispatch({
        type: 'UPDATE_INITIAL_POSITION',
        payload: position.coords,
      });
      whenDoneFunc(true);
    },
    (err) => {
      console.warn('Could not get user position', err);
      Alert.alert(
        'Position Error',
        'We could not retrieve your current position, please change the location settings',
        [
          {text: 'Settings', onPress: () => Linking.openSettings()},
          {text: 'Ok'},
        ],
      );
      whenDoneFunc(false);
    },
  );
}
