import {GlobalStyle} from '../GlobalStyle';

const {StyleSheet} = require('react-native');

export const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.margin,
    marginHorizontal: GlobalStyle.Measurements.width * 0.05,

    flexDirection: 'column',
  },
  snapContainer: {
    width: GlobalStyle.Measurements.width * 0.9,
    minHeight: GlobalStyle.Measurements.height * 0.065,

    padding: GlobalStyle.Measurements.margin,

    backgroundColor: GlobalStyle.Palettes.background.palette6,

    flexDirection: 'column',
    alignItems: 'center',
  },
  snapTitle: {
    ...GlobalStyle.TextStyle.bodyMedium,
  },
  snapSubTitle: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
  snapMessage: {
    ...GlobalStyle.TextStyle.bodyRegular,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width:
      GlobalStyle.Measurements.width * 0.9 -
      GlobalStyle.Measurements.margin * 2,
    marginHorizontal: GlobalStyle.Measurements.margin,
    maxHeight: 0,
    marginVertical: 0,
  },
  dot: {
    marginHorizontal: GlobalStyle.Measurements.margin,

    width: 13,
    height: 13,
    borderRadius: 13 / 2,

    opacity: 1,
  },

  heading: {
    ...GlobalStyle.TextStyle.headingRegular,
    fontWeight: '700',
    marginVertical: GlobalStyle.Measurements.marginHalf,
    minHeight: GlobalStyle.Measurements.margin,
    minWidth: GlobalStyle.Measurements.width * 0.6,
  },
});
