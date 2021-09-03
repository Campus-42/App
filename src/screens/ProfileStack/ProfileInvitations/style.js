import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const INVITATION_HEIGHT = GlobalStyle.Measurements.height * 0.1;
const INVITATION_WIDTH = GlobalStyle.Measurements.width * 0.9;
export const STAR_SIZE = GlobalStyle.Measurements.unit / 1.2;
export const STAR_COLOR = '#fe5764';

export const styles = StyleSheet.create({
  scrollview: {
    ...GlobalStyle.ViewStyle.backgroundView,
    height: GlobalStyle.Measurements.height * 0.9,
    paddingTop: 10,
  },
  scrollContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  loading: {
    height: GlobalStyle.Measurements.height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    height: GlobalStyle.Measurements.height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    ...GlobalStyle.ButtonStyle.Large,
    width: INVITATION_WIDTH,
    height: INVITATION_HEIGHT,
    borderRadius: GlobalStyle.Measurements.unit,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  image: {
    width: INVITATION_HEIGHT - GlobalStyle.Measurements.margin,
    height: INVITATION_HEIGHT - GlobalStyle.Measurements.margin,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    marginHorizontal: INVITATION_WIDTH * 0.025,
    resizeMode: 'cover',
  },
  infoContainer: {
    width: INVITATION_WIDTH * 0.7,
    height: INVITATION_HEIGHT - GlobalStyle.Measurements.marginHalf,
    marginHorizontal: INVITATION_WIDTH * 0.025,
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingVertical: GlobalStyle.Measurements.marginQuarter,
  },
  invitationTitle: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
  },
  invitationText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    fontSize: Dimensions.get('screen').fontScale * 12,
  },
  invitationIconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  invitationIconText: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    fontSize: STAR_SIZE / 1,
    fontStyle: 'italic',
    marginRight: 3,
    color: STAR_COLOR,

    shadowColor: STAR_COLOR,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.7,
    shadowRadius: STAR_SIZE / 12,
  },
  invitationIcon: {
    marginTop: STAR_SIZE / 7,
    shadowColor: STAR_COLOR,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.7,
    shadowRadius: STAR_SIZE / 12,
  },
  claimContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 5,
    borderRadius: GlobalStyle.Measurements.unit / 3,
    backgroundColor: GlobalStyle.Palettes.background.palette3,
  },
});
