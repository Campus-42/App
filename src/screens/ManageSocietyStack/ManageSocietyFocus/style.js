import {StyleSheet, Dimensions, Platform} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  scroll: {
    ...GlobalStyle.Props.backgroundScrollView.style,
    ...GlobalStyle.Props.focusBackgroundScrollView.style,
    height: GlobalStyle.Measurements.height,
    width: GlobalStyle.Measurements.width,
    backgroundColor: GlobalStyle.ColorStyle.greyBackground,
  },
  top: {
    ...GlobalStyle.ViewStyle.backgroundView,
    flex: 1,
  },
  errorText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: '#ff0800',
    alignSelf: 'flex-end',
    marginTop: 3,
  },
  requirementText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
    alignSelf: 'flex-end',
  },
  errorView: {
    borderColor: '#ff080050',
    borderWidth: 1.5,
    backgroundColor: '#ff080015',
    borderRadius: 5,
  },
  topTitleContainer: {
    height: GlobalStyle.Measurements.height * 0.08,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    ...GlobalStyle.TextStyle.headingLarge,
    textAlign: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  actionButtonContainer: {
    ...GlobalStyle.ButtonStyle.Large,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
    justifyContent: 'space-between',
    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  title: {
    ...GlobalStyle.TextStyle.headingMedium,
    textAlign: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
  },
  rowWithButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  snapContainer: {
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin * 1.5,
  },
  textInputContainer: {
    marginVertical: GlobalStyle.Measurements.margin,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    width: GlobalStyle.Measurements.width * 0.9,
    alignSelf: 'center',
    borderRadius: GlobalStyle.Measurements.unit / 2,
    paddingVertical: GlobalStyle.Measurements.marginHalf,
  },
  textInputView: {
    width: GlobalStyle.Measurements.width * 0.85,
    marginHorizontal: GlobalStyle.Measurements.width * 0.075,
    alignSelf: 'center',
    padding: GlobalStyle.Measurements.marginHalf,
    backgroundColor: GlobalStyle.Palettes.background.palette6,

    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',

    // marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  textInput: {
    ...GlobalStyle.TextStyle.bodyRegular,
    width: GlobalStyle.Measurements.width * 0.6,
    flexGrow: 1,
  },
  textInputTitle: {
    ...GlobalStyle.TextStyle.bodyMedium,
    // color: '#24a0ed',

    // fontWeight: '600',
  },
  textButton: {
    ...GlobalStyle.TextStyle.buttonMedium,
    fontWeight: '500',
    color: '#24a0ed',
  },
  picker: {
    width: GlobalStyle.Measurements.width * 0.9,
    // minHeight: GlobalStyle.Measurements.height * 0.25,
    maxHeight:
      parseInt(Platform.Version, 10) == 14
        ? GlobalStyle.Measurements.height * 0.075
        : null,
    // minHeight: GlobalStyle.Measurements.height * 0.25,
    alignSelf: 'center',
  },
  button: {
    width: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.height * 0.065,
    borderRadius: GlobalStyle.Measurements.height * 0.0325,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
  },
  switchSelector: {
    width: GlobalStyle.Measurements.width * 0.75,
    height: GlobalStyle.Measurements.height * 0.035,
    alignSelf: 'center',
    borderRadius: GlobalStyle.Measurements.height * 0.005,
    marginTop: GlobalStyle.Measurements.margin,
    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    paddingVertical: GlobalStyle.Measurements.marginHalf,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 0},
  },
  largeButtonText: {
    ...GlobalStyle.TextStyle.textInputMedium,
    color: '#ffffff',
    fontSize: Dimensions.get('screen').fontScale * 18,
  },
  largeButton: {
    ...GlobalStyle.ButtonStyle.Large,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: GlobalStyle.Measurements.margin,
  },
  subText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.background.palette2,
    textAlign: 'left',
  },
  pickerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: GlobalStyle.Measurements.height * 0.7,
    width: GlobalStyle.Measurements.width,
    alignItems: 'center',
    flex: 1,
  },
  largePickerContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: GlobalStyle.Measurements.height * 0.7,
    alignItems: 'center',
  },
  searchTextInput: {
    alignSelf: 'center',
    width: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.height * 0.04,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    backgroundColor: GlobalStyle.ColorStyle.greyBackground,
    marginTop: GlobalStyle.Measurements.marginHalf,
    minHeight: GlobalStyle.Measurements.unit * 1.75,
  },
  swipeUpContainer: {
    height: GlobalStyle.Measurements.height * 0.55,
    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },
  largeSwipeUpContainer: {
    height: GlobalStyle.Measurements.height * 0.5,
    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },

  scrollViewElementContainer: {
    width: GlobalStyle.Measurements.width * 0.75,
    minHeight: GlobalStyle.Measurements.height * 0.05,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    alignItems: 'center',

    padding: GlobalStyle.Measurements.marginHalf,

    alignSelf: 'center',
    flexDirection: 'row',
  },
  scrollViewElementText: {
    ...GlobalStyle.TextStyle.buttonSmall,
  },
  scrollViewElementError: {
    alignSelf: 'center',
    marginTop: GlobalStyle.Measurements.margin,
  },
  eventViewContainer: {
    marginVertical: GlobalStyle.Measurements.margin,
  },
});
