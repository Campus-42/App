import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  scroll: {
    height: GlobalStyle.Measurements.safeheight,
    flex: 1,
  },
  searchFlatlist: {
    height: GlobalStyle.Measurements.height * 0.8,
  },
  errorView: {
    height: GlobalStyle.Measurements.height * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createSocietyButton: {
    ...GlobalStyle.ButtonStyle.Large,
    marginTop: GlobalStyle.Measurements.margin * 2,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});
