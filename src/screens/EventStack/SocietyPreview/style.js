import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    ...GlobalStyle.Props.focusBackgroundScrollView.contentContainerStyle,
    alignItems: 'center',
    flexDirection: 'column',
  },
  scroll: {
    ...GlobalStyle.ViewStyle.backgroundView,
    height: GlobalStyle.Measurements.safeheight,
    width: GlobalStyle.Measurements.width,
  },
  background: {
    width: GlobalStyle.Measurements.width * 0.9,
    minHeight: GlobalStyle.Measurements.height * 0.25,
    borderRadius: GlobalStyle.Measurements.unit,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    resizeMode: 'cover',
  },
});
