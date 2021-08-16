import {Dimensions} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

const {width, height} = Dimensions.get('screen');
const scale = width / height;

export const Measurements = {
  margin: (width * 0.05 + height * 0.025) / 2,
  marginHalf: (width * 0.05 + height * 0.025) / 4,
  marginQuarter: (width * 0.04 + height * 0.025) / 8,

  unit: width * 0.0275 + height * scale * 0.0275,

  width: width,
  height: height,

  safeheight:
    height -
    StaticSafeAreaInsets.safeAreaInsetsTop / 4 -
    StaticSafeAreaInsets.safeAreaInsetsBottom / 4,
};
