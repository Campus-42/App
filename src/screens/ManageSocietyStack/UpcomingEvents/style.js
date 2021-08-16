const {StyleSheet} = require('react-native');
const {GlobalStyle} = require('../../../assets/GlobalStyle');

export const styles = StyleSheet.create({
  scroll: {
    ...GlobalStyle.ViewStyle.backgroundView,
    height: GlobalStyle.Measurements.height * 0.9,
    width: GlobalStyle.Measurements.width,
  },
  fullErrorView: {
    height: GlobalStyle.Measurements.height * 0.7,
    width: GlobalStyle.Measurements.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
