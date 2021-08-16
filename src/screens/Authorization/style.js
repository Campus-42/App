import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width * 0.8,
    marginTop: GlobalStyle.Measurements.margin * 3,
    flexDirection: 'column',
    // paddingBottom: GlobalStyle.Measurements.height * 0.8,
  },
  textInput: {
    ...GlobalStyle.TextStyle.textInputRegular,
    height: GlobalStyle.Measurements.height * 0.065,
    borderBottomWidth: 1.5,
    borderBottomColor: '#00000030',
    justifyContent: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  authButtonsContainer: {
    ...GlobalStyle.ViewStyle.rowContainer,
    marginTop: GlobalStyle.Measurements.margin,
  },
  authButtonsText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    color: GlobalStyle.Palettes.text.palette5,
  },
  largeButton: {
    ...GlobalStyle.ButtonStyle.Large,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: GlobalStyle.Measurements.margin,
  },
  largeButtonText: {
    ...GlobalStyle.TextStyle.buttonMedium,
    color: '#fff',
  },
  errorText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    color: 'red',
    alignSelf: 'center',
    minHeight: 20,
  },
  verifyContent: {
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
    marginBottom: GlobalStyle.Measurements.margin * 3,
    width: GlobalStyle.Measurements.unit * 4,
    height: GlobalStyle.Measurements.unit * 4,
  },
});
