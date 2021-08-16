import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {styles as modStyles} from '../../../assets/ModalTop';

export const HEIGHT = GlobalStyle.TextStyle.bodyRegular.fontSize * 2.6;
export const MARGIN = GlobalStyle.Measurements.margin;
const WIDTH = GlobalStyle.Measurements.width * 0.7;
const PADDING = 4;

export const styles = StyleSheet.create({
  keyboardAccessoryContainer: {
    flexDirection: 'row',
    width: GlobalStyle.Measurements.width,
    padding: PADDING,
    flex: 1,

    paddingHorizontal: MARGIN,
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 0.5,
    borderColor: '#ddd',
    paddingBottom: GlobalStyle.Measurements.height * 0.075,
    paddingTop: 10,
  },
  keyboardAccessoryShadow: {
    width: GlobalStyle.Measurements.width,
    backgroundColor: GlobalStyle.Palettes.background.palette6,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 7,
    elevation: 4,
  },
  flatlist: {
    width: GlobalStyle.Measurements.width,
    flex: 0.75,
    // paddingVertical: -10,
    paddingTop: 20,
  },
  messageContainer: {
    backgroundColor: GlobalStyle.ViewStyle.whiteBackground.backgroundColor,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  textinputContainer: {
    width: WIDTH,
    minHeight: HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    borderRadius: HEIGHT / 2,
    borderWidth: 0.5,
    borderColor: GlobalStyle.Palettes.background.palette4,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  textinput: {
    ...GlobalStyle.TextStyle.bodyRegular,
    padding: PADDING * 2,
    paddingHorizontal: 8,
    width: WIDTH - HEIGHT,
  },
  icon: {
    height: HEIGHT * 0.95,
    width: HEIGHT * 0.95,

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: HEIGHT / 2,

    marginRight: MARGIN / 2,

    // backgroundColor: GlobalStyle.Palettes.background.palette4,
  },
  sendIcon: {
    height: HEIGHT * 0.95 - PADDING * 2,
    width: HEIGHT * 0.95 - PADDING * 2,
    opacity: 0,
    marginRight: PADDING,
    marginTop: PADDING,
  },
  customBubbleImage: {
    height: GlobalStyle.Measurements.height * 0.35,
    width: GlobalStyle.Measurements.width * 0.65,

    borderRadius: GlobalStyle.Measurements.unit / 2,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: GlobalStyle.Measurements.unit / 3,
  },
  loadingContainer: {
    position: 'absolute',
    width: GlobalStyle.Measurements.unit * 1.75,
    height: GlobalStyle.Measurements.unit * 1.75,
    borderRadius: GlobalStyle.Measurements.unit,
    backgroundColor: '#ffffff',

    alignItems: 'center',
    justifyContent: 'center',

    shadowOffset: {width: 0, height: 2},
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  infoContainer: {
    width: GlobalStyle.Measurements.width,
    flex: 1,
    alignSelf: 'center',
    // paddingTop: GlobalStyle.Measurements.margin,
  },
  infoHeader: {
    ...modStyles.container,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoHeaderText: {
    ...modStyles.title,
    marginLeft: GlobalStyle.Measurements.margin,
  },
  infoImage: {
    width: GlobalStyle.Measurements.unit * 7,
    height: GlobalStyle.Measurements.unit * 7,
    borderRadius: GlobalStyle.Measurements.unit * 3.5,
    marginVertical: GlobalStyle.Measurements.margin,
    backgroundColor: GlobalStyle.ColorStyle.greyBackground,
  },
  infoMembersText: {
    ...GlobalStyle.TextStyle.headingSmall,
    marginTop: GlobalStyle.Measurements.margin,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginLeft: GlobalStyle.Measurements.margin,
  },
  infoImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: GlobalStyle.Measurements.unit / 2,
  },
  infoTextInput: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    // marginVertical: GlobalStyle.Measurements.marginQuarter,
  },
  infoTextInputContainer: {
    padding: GlobalStyle.Measurements.marginHalf,
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginHalf,

    borderRadius: GlobalStyle.Measurements.unit,

    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',

    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },
  inviteButton: {
    // width: GlobalStyle.Measurements.width * 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: GlobalStyle.Measurements.margin * 1.5,
  },
  imgLoadingIcon: {
    position: 'absolute',
  },

  pinButtonContainer: {
    backgroundColor: '#fff',
    width: GlobalStyle.Measurements.width * 0.9,
    padding: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit,
    marginVertical: GlobalStyle.Measurements.marginHalf,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },
  pinButtonIconContainer: {
    width: GlobalStyle.Measurements.unit * 1.5,
    height: GlobalStyle.Measurements.unit * 1.5,
    borderRadius: GlobalStyle.Measurements.unit * 0.75,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#eb833430',
  },
  textinputSubText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
    paddingVertical: 3,
    paddingBottom: GlobalStyle.Measurements.height * 0.01,

    backgroundColor: '#fff',
    textAlign: 'center',
  },
  bubbleInfoComponentContainer: {
    borderRadius: GlobalStyle.Measurements.unit,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: GlobalStyle.Measurements.unit / 3,

    backgroundColor: '#fff',
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    padding: GlobalStyle.Measurements.marginHalf,
  },
});
