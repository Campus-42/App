import {Platform} from 'react-native';
import {Palettes} from './ColorStyle';
import {Measurements} from './Measurements';
import {ViewStyle} from './ViewStyle';

export const Props = {
  scrollViewWithAnimatingHeaderTitle: {
    scrollEventThrottle: 10,
    keyboardShouldPersistTaps: 'handled',
  },
  backgroundScrollView: {
    contentContainerStyle: {paddingBottom: Measurements.height * 0.1},
    style: {...ViewStyle.backgroundView, height: Measurements.height, flex: 1},
    showsVerticalScrollIndicator: false,
    keyboardShouldPersistTaps: 'handled',
  },
  focusBackgroundScrollView: {
    contentContainerStyle: {
      alignItems: 'center',
      width: Measurements.width,
      paddingBottom: Measurements.height * 0.15,
    },
    keyboardShouldPersistTaps: 'handled',
    style: {...ViewStyle.backgroundView, height: Measurements.height, flex: 1},
    showsVerticalScrollIndicator: false,
  },
  focusBackgroundView: {
    contentContainerStyle: {
      alignItems: 'center',
      width: Measurements.width,
    },
    style: {...ViewStyle.backgroundView, height: Measurements.height, flex: 1},
  },
  focusBackgroundViewWhite: {
    contentContainerStyle: {
      alignItems: 'center',
      width: Measurements.width,
    },
    style: {...ViewStyle.whiteBackground, height: Measurements.height, flex: 1},
  },
};
