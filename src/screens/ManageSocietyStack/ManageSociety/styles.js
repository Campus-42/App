import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    ...GlobalStyle.ViewStyle.backgroundView,
    height: GlobalStyle.Measurements.height,
    width: GlobalStyle.Measurements.width,
  },
  createSocietyButton: {
    ...GlobalStyle.ButtonStyle.Large,
    marginVertical: GlobalStyle.Measurements.margin * 2,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
});
