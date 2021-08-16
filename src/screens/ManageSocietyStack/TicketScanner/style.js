const {StyleSheet} = require('react-native');
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles as headerStyles} from '../../../assets/GlobalStyle/Header';

export const BAR_SIZE = GlobalStyle.Measurements.unit * 14;

export const styles = StyleSheet.create({
  camera: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height,
  },
  textConainer: {
    position: 'absolute',
    marginTop: GlobalStyle.Measurements.height * 0.2,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  title: {
    ...GlobalStyle.TextStyle.headingLarge,
    alignSelf: 'center',
    color: '#fff',
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    marginHorizontal: GlobalStyle.Measurements.width * 0.1,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#fff',
  },
  navButton: {
    ...headerStyles.iconLeft,
    position: 'absolute',
    zIndex: 3,
    backgroundColor: 'white',
    marginTop: 60,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimView: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',

    opacity: 0,
    // minHeight: GlobalStyle.ButtonStyle.Large.height,
    // width: GlobalStyle.Measurements.width * 0.8,

    width: BAR_SIZE / 2,
    height: BAR_SIZE / 2,

    alignSelf: 'center',
    // marginTop: GlobalStyle.Measurements.height,
    marginTop: (GlobalStyle.Measurements.height - BAR_SIZE / 2) / 2,

    borderRadius: GlobalStyle.Measurements.unit,
    paddingHorizontal: GlobalStyle.Measurements.margin,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  loadingAnimation: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: BAR_SIZE / 2,
    height: BAR_SIZE / 2,
    marginTop: (GlobalStyle.Measurements.height - BAR_SIZE / 2) / 2,

    padding: GlobalStyle.Measurements.margin,
    backgroundColor: GlobalStyle.Palettes.background.palette6,

    borderRadius: GlobalStyle.Measurements.unit,
  },
  claimText: {
    ...GlobalStyle.TextStyle.bodyMedium,
  },
  claimSubText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette4,
  },
  claimIcon: {
    width: GlobalStyle.Measurements.unit,
    height: GlobalStyle.Measurements.unit,
    resizeMode: 'center',
  },
  eventButton: {
    ...GlobalStyle.ButtonStyle.Small,
    position: 'absolute',
    borderRadius: GlobalStyle.ButtonStyle.Small.height / 2,
    marginTop:
      (GlobalStyle.Measurements.height - BAR_SIZE) / 2 +
      BAR_SIZE +
      GlobalStyle.Measurements.margin,
    alignSelf: 'center',
  },
  eventButtonText: {
    ...GlobalStyle.TextStyle.buttonSmall,
  },
});
