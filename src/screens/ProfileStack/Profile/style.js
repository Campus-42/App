import {StyleSheet, Dimensions} from 'react-native';
import {ButtonStyle} from '../../../assets/GlobalStyle/ButtonStyle';
import {ColorStyle, Palettes} from '../../../assets/GlobalStyle/ColorStyle';
import {Measurements} from '../../../assets/GlobalStyle/Measurements';
import {TextStyle} from '../../../assets/GlobalStyle/TextStyle';
import {ViewStyle} from '../../../assets/GlobalStyle/ViewStyle';

export const styles = StyleSheet.create({
  container: {
    ...ViewStyle.backgroundView,
    height: Measurements.height,
    paddingVertical: Measurements.marginHalf,
  },
  userImageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Measurements.margin,
  },
  userImageCircle: {
    width: Measurements.unit * 5.5,
    height: Measurements.unit * 5.5,
    borderRadius: Measurements.unit * 3,
    backgroundColor: '#ddd',

    alignItems: 'center',
    justifyContent: 'center',
  },
  userImageText: {
    ...TextStyle.headingLarge,
    fontSize: Dimensions.get('screen').fontScale * 40,
    color: '#fff',
  },
  signOutButton: {
    ...ButtonStyle.Large,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: Measurements.margin * 3,
    backgroundColor: '#ffffff00',
  },
  signOutButtonText: {
    ...TextStyle.buttonMedium,
    color: ColorStyle.redButtonText,
  },
  profileButton: {
    ...ButtonStyle.Large,
    backgroundColor: Palettes.background.palette6,
    marginVertical: Measurements.marginHalf,
    justifyContent: 'space-between',
  },
  profileButtonContainer: {
    width: Measurements.width,
    alignItems: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  appVersion: {
    ...TextStyle.tech,
    alignSelf: 'center',
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    width: Measurements.unit * 1.75,
    height: Measurements.unit * 1.75,
    borderRadius: Measurements.unit,
    backgroundColor: '#ffffff',

    alignItems: 'center',
    justifyContent: 'center',

    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
