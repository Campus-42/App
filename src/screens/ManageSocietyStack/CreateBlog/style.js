import {StyleSheet, Dimensions} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const CONTENT_MARGIN = GlobalStyle.Measurements.width * 0.035;
const CONTENT_BORDER_RADIUS = GlobalStyle.Measurements.unit / 3;
const CONTENT_VIEWBASE = {
  width: GlobalStyle.Measurements.width * 0.95 - CONTENT_MARGIN * 2,
  // marginVertical: 10,
  borderRadius: CONTENT_BORDER_RADIUS,

  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  paddingHorizontal: GlobalStyle.Measurements.marginHalf,

  // backgroundColor: GlobalStyle.Palettes.background.palette6,

  // shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
  // shadowOffset: {width: 0, height: 3},
  // shadowRadius: GlobalStyle.Measurements.unit / 4,
  // shadowOpacity: 0.15,
};

export const styles = StyleSheet.create({
  scroll: {
    height: GlobalStyle.Measurements.height,
    width: GlobalStyle.Measurements.width,
    backgroundColor: GlobalStyle.ColorStyle.greyBackground,
  },
  childContainer: {
    width: GlobalStyle.Measurements.width * 0.95,
    minHeight: GlobalStyle.Measurements.height * 0.05,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    flexDirection: 'column',
    alignItems: 'center',

    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // elevation: 5,
    // backgroundColor: GlobalStyle.Palettes.background.palette6,
    // padding: GlobalStyle.Measurements.marginHalf,

    marginVertical: GlobalStyle.Measurements.marginQuarter,
    // justifyContent: 'flex-start',
  },
  keyboardBoxContainer: {
    // height: GlobalStyle.Measurements.height * 0.1,
    width: GlobalStyle.Measurements.width,
    alignSelf: 'center',
    position: 'absolute',
    marginBottom: GlobalStyle.Measurements.height * 0.3,
    marginTop: GlobalStyle.Measurements.height * 0.825,

    // backgroundColor: '#00000000',
  },
  keyboardBox: {
    marginHorizontal: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    height: GlobalStyle.Measurements.height * 0.055,
    minWidth: GlobalStyle.Measurements.width * 0.2,
    backgroundColor: GlobalStyle.Palettes.background.palette6,

    justifyContent: 'center',
    alignItems: 'center',
    padding: GlobalStyle.Measurements.unit / 2,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: GlobalStyle.Measurements.unit / 4,
    shadowOpacity: 0.15,
  },
  keyboardText: {
    ...GlobalStyle.TextStyle.buttonMedium,
  },
  blogContentContainer: {
    width: GlobalStyle.Measurements.width,
    alignSelf: 'center',

    paddingVertical: CONTENT_MARGIN / 2,
    // marginVertical: GlobalStyle.Measurements.margin,

    // backgroundColor: GlobalStyle.Palettes.background.palette6,

    // shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    // shadowOffset: {width: 0, height: 3},
    // shadowRadius: GlobalStyle.Measurements.unit / 2,
    // shadowOpacity: 0.75,
  },

  contentHeadingContainer: {
    padding: GlobalStyle.Measurements.marginQuarter,
  },
  contentHeading: {
    ...GlobalStyle.TextStyle.headingLarge,
    ...CONTENT_VIEWBASE,
    fontSize: Dimensions.get('screen').fontScale * 24,
    alignSelf: 'flex-start',
  },
  contentText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    ...CONTENT_VIEWBASE,
    marginVertical: -CONTENT_MARGIN / 2,

    textAlign: 'left',
  },
  contentImage: {
    ...CONTENT_VIEWBASE,
    minHeight: GlobalStyle.Measurements.height * 0.15,
    resizeMode: 'cover',
    backgroundColor: GlobalStyle.Palettes.background.palette5,
  },
  content: {
    ...CONTENT_VIEWBASE,
  },
  delete: {
    position: 'absolute',
    width: GlobalStyle.Measurements.unit,
    height: GlobalStyle.Measurements.unit,
    borderRadius: 6,
    marginLeft: CONTENT_VIEWBASE.width + 10,
    marginTop: 5,

    backgroundColor: GlobalStyle.Palettes.background.palette4,
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...GlobalStyle.TextStyle.bodySmall,
    marginHorizontal: GlobalStyle.Measurements.margin,
    marginTop: GlobalStyle.Measurements.margin * 2,

    textAlign: 'center',
  },
  largeButton: {
    ...GlobalStyle.ButtonStyle.Large,
    justifyContent: 'space-between',
    alignSelf: 'center',
    paddingHorizontal: GlobalStyle.Measurements.margin,
    marginTop: GlobalStyle.Measurements.margin,
  },

  accessoryWrapper: {
    // position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',

    marginHorizontal: GlobalStyle.Measurements.width * 0.05,
    marginBottom: 20,
  },
  accessoryBase: {
    justifyContent: 'flex-end',
  },
});
