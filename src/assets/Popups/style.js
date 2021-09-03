import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

export const TOAST_HEIGHT = GlobalStyle.Measurements.height * 0.075;
const TOAST_WIDTH = GlobalStyle.Measurements.width * 0.95;

export const POPUP_MIN_HEIGHT = GlobalStyle.Measurements.height * 0.15;
export const POPUP_ICON_SIZE = GlobalStyle.Measurements.unit * 5;
export const POPUP_MARGIN =
  (GlobalStyle.Measurements.height -
    POPUP_MIN_HEIGHT -
    GlobalStyle.Measurements.height * 0.1) /
  2;
const POPUP_WIDTH = GlobalStyle.Measurements.width * 0.7;

export const styles = {
  toast: StyleSheet.create({
    container: {
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 1,

      height: TOAST_HEIGHT,
      width: TOAST_WIDTH,
      borderRadius: GlobalStyle.Measurements.unit / 2,

      backgroundColor: GlobalStyle.Palettes.background.palette6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',

      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.2,
      shadowRadius: GlobalStyle.Measurements.unit / 4,
      elevation: 10,
    },
    imageLeft: {
      height: TOAST_HEIGHT - 20,
      width: TOAST_HEIGHT - 20,
      marginRight: 10,
      resizeMode: 'contain',

      borderRadius: 3,
    },
    buttonContainer: {
      height: TOAST_HEIGHT,
      width: TOAST_WIDTH,

      padding: 5,
      paddingHorizontal: 10,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      ...GlobalStyle.TextStyle.bodyRegular,
      fontWeight: '600',
    },
    text: {
      ...GlobalStyle.TextStyle.bodySmall,
      width: TOAST_WIDTH * 0.8,
    },
    textContainer: {
      width: TOAST_WIDTH - 5,
    },
    iconBackground: {
      height: TOAST_HEIGHT - 30,
      width: TOAST_HEIGHT - 30,
      borderRadius: TOAST_HEIGHT,
      marginRight: 10,

      alignItems: 'center',
      justifyContent: 'center',
    },
    iconSize: TOAST_HEIGHT / 3.5,
  }),
  popup: StyleSheet.create({
    container: {
      alignSelf: 'center',
      position: 'absolute',
      zIndex: 1,

      minHeight: POPUP_MIN_HEIGHT,
      width: POPUP_WIDTH,
      borderBottomColor: GlobalStyle.Measurements.unit / 2,
      borderRadius: GlobalStyle.Measurements.unit,
      padding: GlobalStyle.Measurements.margin,
      paddingBottom: GlobalStyle.Measurements.margin * 1.75,

      backgroundColor: GlobalStyle.Palettes.background.palette6,
      flexDirection: 'column',
      alignItems: 'center',

      shadowOffset: {width: 0, height: 5},
      shadowOpacity: 0.2,
      shadowRadius: GlobalStyle.Measurements.unit / 2,
      elevation: 10,
    },
    title: {
      ...GlobalStyle.TextStyle.headingMedium,
      textAlign: 'center',
    },
    text: {
      ...GlobalStyle.TextStyle.bodyRegular,
      marginVertical: GlobalStyle.Measurements.marginHalf,
      textAlign: 'center',
      alignSelf: 'center',
    },
    icon: {
      width: POPUP_ICON_SIZE,
      height: POPUP_ICON_SIZE,
      marginVertical: GlobalStyle.Measurements.marginHalf,
    },
    button: {
      ...GlobalStyle.ButtonStyle.Large,
      width: POPUP_WIDTH * 0.9,
      height: GlobalStyle.Measurements.height * 0.047,
      borderRadius: GlobalStyle.Measurements.unit / 1.5,
      backgroundColor: GlobalStyle.Palettes.background.palette5,
      marginVertical: 4,
    },
    buttonText: {
      ...GlobalStyle.TextStyle.buttonSmall,
      color: GlobalStyle.ColorStyle.blueButtonText,
      textAlign: 'center',
    },
    blurView: {
      position: 'absolute',
      zIndex: 0,
      height: GlobalStyle.Measurements.height,
      width: GlobalStyle.Measurements.width,
    },
  }),
  parent: StyleSheet.create({
    container: {},
  }),
};
