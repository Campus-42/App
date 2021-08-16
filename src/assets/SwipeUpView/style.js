import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    borderTopWidth: 0.5,
    borderColor: '#e5e5e5',

    marginTop: GlobalStyle.Measurements.height,
    // height: GlobalStyle.Measurements.safeheight * 0.9,
    width: GlobalStyle.Measurements.width,
    borderRadius: GlobalStyle.Measurements.unit * 1.5,

    shadowColor: 'black',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 30,
  },
});
