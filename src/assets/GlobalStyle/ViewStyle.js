import {Dimensions, StyleSheet} from 'react-native';
import {Measurements} from './Measurements';
import {ColorStyle, Palettes} from './ColorStyle';

const standards = StyleSheet.create({
  full: {
    width: Measurements.width,
  },
});

export const ViewStyle = StyleSheet.create({
  palette1: {
    backgroundColor: Palettes.background.palette1,
  },
  palette2: {
    backgroundColor: Palettes.background.palette2,
  },
  palette3: {
    backgroundColor: Palettes.background.palette3,
  },
  palette4: {
    backgroundColor: Palettes.background.palette4,
  },
  palette5: {
    backgroundColor: Palettes.background.palette5,
  },
  palette6: {
    backgroundColor: Palettes.background.palette6,
  },
  largeContainer: {
    ...standards.full,
    alignItems: 'center',
  },
  backgroundView: {
    backgroundColor: ColorStyle.greyBackground,
    flex: 1,
  },
  whiteBackground: {
    backgroundColor: Palettes.background.palette6,
    flex: 1,

  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
