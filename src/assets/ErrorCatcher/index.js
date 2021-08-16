import {Alert} from 'react-native';
import RNRestart from 'react-native-restart';
import {analytics} from '../Analytics';

export const errorHandler = (err, isFatal, showPopup) => {
  if (err != undefined) analytics.error({err, isFatal});
  if (isFatal) showPopup({level: 'critical', active: true, type: 'popup'});
};
