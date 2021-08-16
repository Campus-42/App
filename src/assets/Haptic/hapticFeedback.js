import {Platform, Vibration} from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: true,
};

export function triggerHaptic(impact = 'impactMedium') {
  if (Platform.OS === 'ios') {
    console.log('Triggered haptic ' + impact);
    ReactNativeHapticFeedback.trigger(impact, options);
  }
}
