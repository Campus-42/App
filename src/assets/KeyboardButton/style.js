import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height * 0.05,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: GlobalStyle.Measurements.margin * 1.5,

    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
});
