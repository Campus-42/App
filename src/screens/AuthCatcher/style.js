import {StyleSheet} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {GlobalStyle} from '../../assets/GlobalStyle';

export const LOGO_SIZE = GlobalStyle.Measurements.width * 0.4;
export const LOGO_BOTTOM_MARGIN = 30;

export const styles = StyleSheet.create({
  container: {
    height: GlobalStyle.Measurements.height,
    width: GlobalStyle.Measurements.width,
  },
  authScroll: {
    flex: 1,
    height: GlobalStyle.Measurements.height - 20,
    width: GlobalStyle.Measurements.width,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    alignSelf: 'center',
    marginTop: (GlobalStyle.Measurements.height - LOGO_SIZE) / 3,
    marginBottom: LOGO_BOTTOM_MARGIN,
    backgroundColor: '#00000000',
  },
  internetView: {
    borderRadius: 5,
    backgroundColor: '#ff2626',
    padding: 5,

    alignSelf: 'center',
  },
  internetText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    fontWeight: '700',
    color: '#fff',
  },
});

export const ANIMATION_LOGO_MARGINS = {
  up: 0,
  down: (GlobalStyle.Measurements.height - styles.logo.height) / 4,
};
