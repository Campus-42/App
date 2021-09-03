import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  scroll: {
    ...GlobalStyle.ViewStyle.backgroundView,
    height: GlobalStyle.Measurements.height * 0.9,
    width: GlobalStyle.Measurements.width,
    paddingTop: GlobalStyle.Measurements.marginHalf,
  },
  fullErrorView: {
    height: GlobalStyle.Measurements.height * 0.7,
    width: GlobalStyle.Measurements.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
