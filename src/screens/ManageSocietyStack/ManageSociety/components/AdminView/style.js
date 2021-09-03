import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';

const CONFIRM_EVENT_WIDTH = GlobalStyle.Measurements.width * 0.8;
const CONFIRM_EVENT_HEIGHT = GlobalStyle.Measurements.height * 0.3;

const EVENT_SOON_HEIGHT = GlobalStyle.Measurements.height * 0.27;
const EVENT_SOON_BASE = {
  width: GlobalStyle.Measurements.width * 0.8,
  borderRadius: GlobalStyle.Measurements.unit / 2,
};

export const styles = StyleSheet.create({
  confirmationContainer: {
    width: CONFIRM_EVENT_WIDTH,
    height: CONFIRM_EVENT_HEIGHT,
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: GlobalStyle.Measurements.unit / 4,
  },
  confirmationInnerContainer: {
    margin: 2,
    width: CONFIRM_EVENT_WIDTH - 2,
    height: CONFIRM_EVENT_HEIGHT - 2,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    padding: GlobalStyle.Measurements.marginHalf,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  confirmationTitle: {
    ...GlobalStyle.TextStyle.headingMedium,
    textAlign: 'center',
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  confirmationSubTitle: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
  confirmationText: {
    ...GlobalStyle.TextStyle.bodyRegular,
  },

  confirmationButton: {
    backgroundColor: '#ffffff00',
    marginVertical:10
  },
  confirmationButtonText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    color: GlobalStyle.ColorStyle.blueButtonText,
  },
  confirmationButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  eventsSoonContainer: {
    height: EVENT_SOON_HEIGHT,
    width: GlobalStyle.Measurements.width * 0.8,
    marginBottom: GlobalStyle.Measurements.marginHalf,
    justifyContent: 'space-between',
  },
  eventsSoonContainerUpper: {
    ...EVENT_SOON_BASE,
    height: EVENT_SOON_HEIGHT * 0.65,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  eventsSoonContainerLower: {
    ...GlobalStyle.ButtonStyle.Large,
    ...EVENT_SOON_BASE,
    minHeight: EVENT_SOON_HEIGHT * 0.2,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    paddingLeft: GlobalStyle.Measurements.marginHalf,
    paddingRight: GlobalStyle.Measurements.margin,
    paddingVertical: GlobalStyle.Measurements.marginQuarter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventsSoonIconContainer: {
    width: EVENT_SOON_HEIGHT / 6.5,
    height: EVENT_SOON_HEIGHT / 6.5,
    borderRadius: EVENT_SOON_HEIGHT / 13,

    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsSoonIcon: {
    width: EVENT_SOON_HEIGHT / 12,
    height: EVENT_SOON_HEIGHT / 12,
  },
});
