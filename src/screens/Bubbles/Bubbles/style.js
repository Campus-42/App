import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const THREAD_IMG_SIZE = GlobalStyle.Measurements.unit * 3;
const UNREAD_SIZE = GlobalStyle.Measurements.unit / 1.3;
export const MESSAGE_ROW_MARGIN = GlobalStyle.Measurements.marginHalf;

export const styles = StyleSheet.create({
  swipeupTitle: {
    ...GlobalStyle.TextStyle.headingLarge,
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  swipeupContainer: {
    width: GlobalStyle.Measurements.width,
    alignItems: 'center',
  },
  horizontalUsersContainer: {
    width: GlobalStyle.Measurements.width,
    maxHeight: null,
    marginVertical: GlobalStyle.Measurements.margin,
  },
  flatlistVertical: {
    width: GlobalStyle.Measurements.width,
    marginTop: 2,
    paddingTop: 10,
  },
  horizontalUsers: {
    width: GlobalStyle.Measurements.width,
  },
  userImage: {
    position: 'absolute',
    borderRadius: GlobalStyle.Measurements.unit / 2,
    backgroundColor: GlobalStyle.Palettes.background.palette4,
    height: GlobalStyle.Measurements.unit,
    width: GlobalStyle.Measurements.unit,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -5,
    marginTop: -5,
  },
  noThreadContainer: {
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin * 2,
    alignItems: 'center',
  },
  messagerowContainer: {
    width: GlobalStyle.Measurements.width - MESSAGE_ROW_MARGIN * 2,
    height: THREAD_IMG_SIZE + GlobalStyle.Measurements.margin,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: GlobalStyle.Measurements.marginHalf,

    backgroundColor: '#fff',
    borderRadius: GlobalStyle.Measurements.unit,
    // marginHorizontal: MESSAGE_ROW_MARGIN,
    // marginVertical: MESSAGE_ROW_MARGIN / 2,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.075,
    shadowRadius: MESSAGE_ROW_MARGIN / 2,
    elevation: 1,
  },
  threadImageContainer: {
    height: THREAD_IMG_SIZE,
    width: THREAD_IMG_SIZE,
    borderRadius: THREAD_IMG_SIZE / 2,
    backgroundColor: GlobalStyle.Palettes.background.palette5,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
  },
  threadPreviewContainer: {
    width:
      GlobalStyle.Measurements.width -
      GlobalStyle.Measurements.marginHalf * 5 -
      THREAD_IMG_SIZE -
      MESSAGE_ROW_MARGIN,
    height: THREAD_IMG_SIZE,
    marginRight: GlobalStyle.Measurements.marginHalf,

    flexDirection: 'column',
    // justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  previewText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette6,
  },
  unreadBadge: {
    marginLeft: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  messageRowTagContainer: {
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  messageRowTagText: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
});
