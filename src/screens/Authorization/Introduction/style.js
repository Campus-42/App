import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const size = GlobalStyle.Measurements.unit * 4.5;

export const styles = StyleSheet.create({
  swiper: {
    height: GlobalStyle.Measurements.height,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: GlobalStyle.Measurements.height * 0.05,
  },
  appicon: {
    width: size,
    height: size,
    borderRadius: (10 / 57) * size,
  },
  appiconContainer: {
    // padding: GlobalStyle.Measurements.marginHalf,
    // borderRadius: GlobalStyle.Measurements.unit,
    // backgroundColor: GlobalStyle.Palettes.background.palette6,
    // marginBottom: GlobalStyle.Measurements.margin,

    marginBottom: GlobalStyle.Measurements.margin,
    padding: 5,

    shadowColor: GlobalStyle.Palettes.text.palette6,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: size * 0.04,
  },
  appiconText: {
    ...GlobalStyle.TextStyle.bodyLarge,
    marginHorizontal: GlobalStyle.Measurements.margin,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    height: GlobalStyle.Measurements.height * 0.7,
    justifyContent: 'center',
  },
});
