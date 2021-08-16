import {StyleSheet, Dimensions} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  scroll: {
    height: GlobalStyle.Measurements.safeheight,
  },
  title: {
    ...GlobalStyle.TextStyle.headingLarge,
    textAlign: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  subTitle: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette5,
    alignSelf: 'center',
    marginBottom: GlobalStyle.Measurements.margin,
  },
  statRow: {
    width: GlobalStyle.Measurements.width,
    flexDirection: 'row',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  statComponent: {
    width: GlobalStyle.Measurements.width * 0.4,
    marginHorizontal: GlobalStyle.Measurements.width * 0.05,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  statTitle: {
    ...GlobalStyle.TextStyle.headingMedium,
    fontSize: Dimensions.get('screen').fontScale * 18,
  },
  statText: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    fontSize: Dimensions.get('screen').fontScale * 28,
    fontStyle: 'italic',
  },
  participantsComponent: {
    padding: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    width: GlobalStyle.Measurements.width * 0.9,
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
    flexDirection: 'column',
  },
  participantRow: {
    // width: GlobalStyle.Measurements.width,
    minHeight: GlobalStyle.Measurements.height * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: GlobalStyle.Palettes.background.palette5,
    paddingHorizontal: GlobalStyle.Measurements.marginHalf,
    paddingVertical: GlobalStyle.Measurements.marginQuarter,
  },
  participantIcon: {
    width: GlobalStyle.Measurements.unit,
    height: GlobalStyle.Measurements.unit,
  },
  participantText: {
    ...GlobalStyle.TextStyle.bodyLarge,
    fontWeight: '700',
  },
  participantSubText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
  },
  participantRowName: {
    width: GlobalStyle.Measurements.width * 0.7,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
