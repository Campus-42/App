import {analytics} from '../../Analytics';
import {db} from '../../Firebase/Firebase';
import Cameraroll from '@react-native-community/cameraroll';
import {Platform} from 'react-native';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import {Alert} from 'react-native';
import {Linking} from 'react-native';

export const otherFuncs = {
  getFaqs: async function (campusKey) {
    analytics.breadcrumb('Getting FAQ for campus');

    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('data')
      .doc('faq')
      .get()
      .then((doc) => {
        return doc.data().faq;
      })
      .catch((err) => {
        throw err;
      });
  },
  getCampusGeography: async function (campusKey) {
    /**
     * Get the buildings and other geographical features for the campus
     */
    analytics.breadcrumb('Getting campus geography');
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('data')
      .doc('geography')
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((err) => {
        throw err;
      });
  },
  saveImage: async function (uri, type = 'photo') {
    /**
     * First check whether the permissions are graned
     * Else ask the user to allow them and try again later
     */
    const checkKey = Platform.OS == 'ios' ? 'IOS' : 'ANDROID';

    const checkResponse = await check(
      PERMISSIONS[checkKey].WRITE_EXTERNAL_STORAGE,
    ).then((result) => {
      if (result == RESULTS.GRANTED) return true;
      else {
        Alert.alert(
          'Library Access',
          'Please allow access to your camera library to save image',
          [
            {text: 'Cancel', style: 'destructive'},
            {text: "I'll change", onPress: Linking.openURL('app-settings:')},
          ],
        );
        return false;
      }
    });

    if (!checkResponse) return {noAccess: true};

    /**
     * If it has access then try and save to camera roll
     */
    return Cameraroll.saveToCameraRoll(uri, type)
      .then((response) => {
        return {successful: true, response};
      })
      .catch((err) => {
        throw err;
      });
  },
};
