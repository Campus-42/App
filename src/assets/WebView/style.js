import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

export const styles = StyleSheet.create({
  header: {
    height: GlobalStyle.Measurements.height * 0.07,
    width: GlobalStyle.Measurements.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: GlobalStyle.Measurements.margin,

    borderBottomColor: '#ccc',
    borderBottomWidth: 0.75,

  },
  web: {
    height: GlobalStyle.Measurements.height * 0.8,
    width: GlobalStyle.Measurements.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: GlobalStyle.Measurements.height * 0.09,
    width: GlobalStyle.Measurements.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: GlobalStyle.Measurements.margin,
    paddingHorizontal: GlobalStyle.Measurements.margin * 2,
  },
  container: {
    ...GlobalStyle.ViewStyle.backgroundView,
  },
});
