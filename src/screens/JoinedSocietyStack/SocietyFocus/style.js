import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  backgroundImage: {
    width: GlobalStyle.Measurements.width * 0.9,
    minHeight: GlobalStyle.Measurements.height * 0.25,
    borderRadius: GlobalStyle.Measurements.unit,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    resizeMode: 'cover',
  },
  scroll: {
    height: GlobalStyle.Measurements.safeheight,
  },
  scrollContainer: {
    ...GlobalStyle.Props.focusBackgroundScrollView.contentContainerStyle,
    paddingBottom: GlobalStyle.Measurements.height * 0.15,
    alignItems: 'center',
  },
  descriptionContainer: {
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
    padding: GlobalStyle.Measurements.margin,
  },
  focusDescriptionGradient: {
    position: 'absolute',
    width: GlobalStyle.Measurements.width * 0.9,
    height: GlobalStyle.Measurements.height * 0.08,
    marginTop: GlobalStyle.Measurements.height * 0.07,
    borderRadius: GlobalStyle.Measurements.unit,

    alignItems: 'center',
    justifyContent: 'center',
  },
  focusDescriptionButton: {
    marginTop: GlobalStyle.Measurements.unit * 1.2,
    alignSelf: 'center',
    padding: 10,
  },
  carousel: {
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  actionButtonContainer: {
    ...GlobalStyle.ButtonStyle.Large,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    marginVertical: GlobalStyle.Measurements.marginHalf,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtonIcon: {
    height: GlobalStyle.Measurements.unit * 1.6,
    width: GlobalStyle.Measurements.unit * 1.6,
    // marginHorizontal: GlobalStyle.Measurements.marginHalf,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: GlobalStyle.Measurements.unit * 1.5,
    backgroundColor: '#45b3e7',
  },
  actionButtonText: {
    ...GlobalStyle.TextStyle.buttonSmall,
  },
});
