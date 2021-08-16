import {Platform} from 'react-native';
import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: GlobalStyle.Measurements.width,
    flexDirection: 'column',
  },
  title: {
    ...GlobalStyle.TextStyle.headingMedium,
  },
  inviteButton: {
    ...GlobalStyle.ButtonStyle.Large,
    justifyContent: 'space-between',
  },
  inviteButtonText: {
    ...GlobalStyle.TextStyle.buttonLarge,
  },
  flatlist: {
    height:
      GlobalStyle.Measurements.safeheight *
      (Platform.OS == 'android' ? 0.475 : 0.5),
    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.margin,
    paddingVertical: GlobalStyle.Measurements.marginHalf,
  },
  searchbar: {
    width: GlobalStyle.Measurements.width * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    backgroundColor: GlobalStyle.ColorStyle.greyBackground,
  },
  userComponent: {
    ...GlobalStyle.ButtonStyle.Large,
    height: GlobalStyle.Measurements.unit * 2.1,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    paddingLeft: GlobalStyle.Measurements.marginQuarter,
    paddingRight: GlobalStyle.Measurements.marginHalf,
    width: GlobalStyle.Measurements.width * 0.85,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: GlobalStyle.Palettes.background.palette6,

  },
  userComponentTextContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: GlobalStyle.Measurements.marginHalf,
  },
  inviteNotificationContainer: {
    width: GlobalStyle.Measurements.width,
    alignItems: 'center',
    padding: GlobalStyle.Measurements.margin,
    marginBottom: GlobalStyle.Measurements.margin,
  },
  inviteAnimation: {
    width: GlobalStyle.Measurements.width * 0.6,
    height: GlobalStyle.Measurements.height * 0.2,
  },
  doneAnimation: {
    width: GlobalStyle.Measurements.width * 0.4,
    height: GlobalStyle.Measurements.height * 0.125,
    marginBottom: GlobalStyle.Measurements.margin,
  },
  suggestionsText: {
    ...GlobalStyle.TextStyle.headingMedium,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },
  quitSearchButton: {
    ...GlobalStyle.ButtonStyle.TextButton,
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
});
