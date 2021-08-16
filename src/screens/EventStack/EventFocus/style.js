import {Platform, StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const FLOATING_BUTTON_MARGIN = GlobalStyle.Measurements.marginHalf;
const JOIN_WIDTH = GlobalStyle.Measurements.width * 0.5;
const INVITE_WIDTH =
  GlobalStyle.Measurements.width - JOIN_WIDTH - FLOATING_BUTTON_MARGIN * 3;

export const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height,
  },
  innerContainer: {
    position: 'absolute',
    zIndex: 1,
    elevation: 1,
    height:
      GlobalStyle.Measurements.height - GlobalStyle.Measurements.height * 0.275,
    width: GlobalStyle.Measurements.width,
    paddingHorizontal: GlobalStyle.Measurements.marginHalf,
    backgroundColor: 'white',
    borderRadius: GlobalStyle.Measurements.unit,
    marginTop: GlobalStyle.Measurements.height * 0.275,
  },
  title: {
    ...GlobalStyle.TextStyle.headingLarge,
    alignSelf: 'center',
    textAlign: 'center',
    minHeight: GlobalStyle.Measurements.height * 0.03,
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
  },
  titleContainer: {
    // backgroundColor: '#ffffff',
    // opacity: 0.9,
    // borderRadius: 5,
    paddingHorizontal: 6,
    // paddingVertical: 2,
    margin: GlobalStyle.Measurements.marginHalf,
    // marginTop: GlobalStyle.Measurements.margin,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyLarge,
    marginVertical: GlobalStyle.Measurements.margin,
    marginHorizontal: GlobalStyle.Measurements.margin,
    textAlign: 'left',
  },
  labelText: {
    ...GlobalStyle.TextStyle.bodySmall,
    textAlign: 'center',

    color: '#fff',
  },
  labelContainer: {
    alignSelf: 'center',
    backgroundColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: GlobalStyle.Measurements.margin,
  },
  image: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height * 0.3,
  },
  rowContainer: {flexDirection: 'row'},
  iconsContainer: {
    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginHorizontal: GlobalStyle.Measurements.margin,
    width: GlobalStyle.Measurements.width * 0.1,
    height: GlobalStyle.Measurements.width * 0.1,
    borderRadius: GlobalStyle.Measurements.width * 0.025,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  iconText: {
    ...GlobalStyle.TextStyle.bodyMedium,
    color: GlobalStyle.Palettes.text.palette5,
    maxWidth: GlobalStyle.Measurements.width * 0.6,
    textAlign: 'left',
  },
  iconText2: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette1,
    textAlign: 'left',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop:
      GlobalStyle.Measurements.safeheight *
      (Platform.OS == 'ios' ? 0.92 : 0.86),
    width: GlobalStyle.Measurements.width,
    paddingHorizontal: GlobalStyle.Measurements.width * 0.03,
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  floatingButton: {
    ...GlobalStyle.ButtonStyle.Large,
    height: GlobalStyle.Measurements.height * 0.06,
    // borderRadius: GlobalStyle.Measurements.height * 0.025,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inviteButton: {
    width: INVITE_WIDTH,
    marginRight: FLOATING_BUTTON_MARGIN,
  },
  joinButton: {
    width: JOIN_WIDTH,
  },
  floatingButtonText: {
    ...GlobalStyle.TextStyle.buttonLarge,
    color: '#fff',
  },
  backgroundImage: {
    width: GlobalStyle.Measurements.width * 0.9,
    // marginLeft: GlobalStyle.Measurements.width * 0.05,
    height: GlobalStyle.Measurements.height * 0.25,
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
    marginTop: GlobalStyle.Measurements.marginHalf,
    alignItems: 'center',
    borderRadius: GlobalStyle.Measurements.unit,

    // borderWidth: 0.5,
    // borderColor: GlobalStyle.Palettes.background.palette4,
    // backgroundColor: GlobalStyle.ColorStyle.boneColor,
  },
  societyContainer: {
    marginVertical: GlobalStyle.Measurements.margin,
    // paddingHorizontal: GlobalStyle.Measurements.marginHalf,
  },
  editEventButton: {
    ...GlobalStyle.ButtonStyle.Large,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
});
