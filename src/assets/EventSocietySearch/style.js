import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height * 0.75,
  },
  title: {
    ...GlobalStyle.TextStyle.headingLarge,
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  flatlist: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.safeheight * 0.65,
    marginTop: 2, // Required to calculate height of flatlist
    paddingTop: 10,
  },
  flatlistTitles: {
    ...GlobalStyle.TextStyle.headingMedium,
  },
  subtitle: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette4,
    alignSelf: 'center',
    marginTop: GlobalStyle.Measurements.marginQuarter,
  },
});
