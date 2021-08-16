import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

const WIDTH = GlobalStyle.Measurements.width * 0.9;
const PADDING = GlobalStyle.Measurements.marginHalf;

export const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',

    width: WIDTH,
    padding: PADDING,

    borderRadius: GlobalStyle.Measurements.unit,
    marginVertical: GlobalStyle.Measurements.marginHalf,

    backgroundColor: GlobalStyle.Palettes.background.palette6,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0,
    shadowRadius: 5,
    elevation: 0,
  },
  title: {
    ...GlobalStyle.TextStyle.headingSmall,
    fontWeight: '600',
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  footerText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette5,
    marginVertical: 3,
    alignSelf: 'center',
  },

  userContainer: {
    width: WIDTH - PADDING * 2,
    padding: PADDING,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    borderRadius: GlobalStyle.Measurements.unit / 1.5,
  },
  userImageWrapper: {
    marginRight: PADDING,
    padding: 2,
    borderRadius: 300,

    alignItems: 'center',
  },
  userName: {
    ...GlobalStyle.TextStyle.bodyRegular,
    fontWeight: '400',
    maxWidth: GlobalStyle.Measurements.width * 0.55,
  },
  level: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette5,
  },

  points: {
    ...GlobalStyle.TextStyle.levelText,
    color: GlobalStyle.Palettes.text.palette5,
    fontSize: Dimensions.get('screen').fontScale * 16,
  },
  pointContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  positionText: {
    ...GlobalStyle.TextStyle.levelText,
    fontSize: Dimensions.get('screen').fontScale * 12,
    marginRight: 5,
    fontStyle: 'italic',
    width: 15,
  },
});
