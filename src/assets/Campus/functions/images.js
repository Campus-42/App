import {Linking} from 'react-native';
import {Alert} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import {analytics} from '../../Analytics';

export const imageFuncs = {
  selectImage: async function (onResponse = () => {}) {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    return ImagePicker.showImagePicker(options, async (res) => {
      console.log('Image picker', res);
      if (res.didCancel) onResponse({error: false, cancelled: true});
      else if (res.error) {
        Alert.alert(
          'Camera Unavailable',
          "We couldn't access your camera, please check your settings for the app",
          [
            {text: 'Settings', onPress: () => Linking.openSettings()},
            {text: 'Ok'},
          ],
        );
        onResponse({error: res.error});
      } else onResponse({uri: res.uri});
    });
  },
  selectFromLibrary: async function (options) {
    const libOptions = {
      ...options,
    };

    return new Promise((resolve, reject) => {
      ImagePicker.launchImageLibrary(libOptions, (res) => {
        if (res.didCancel) resolve({didCancel: true});
        else if (res.error) {
          reject({error: res.error});
          Alert.alert(
            'Image Library',
            "We couldn't access your image library, please check your settings for the app",
            [
              {text: 'Settings', onPress: () => Linking.openSettings()},
              {text: 'Ok'},
            ],
          );
          analytics.error(res.error, 'imageFuncs', 'selectFromLibrary');
        } else resolve(res);
      });
    });
  },
};
