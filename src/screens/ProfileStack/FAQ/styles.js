import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const WIDTH = GlobalStyle.Measurements.width * 0.9;
export const ICON_SIZE = GlobalStyle.Measurements.unit / 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    width: GlobalStyle.Measurements.width,
    padding: GlobalStyle.Measurements.marginQuarter,
  },
  sectionContainer: {
    width: WIDTH,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
    padding: 20,
    borderRadius: GlobalStyle.Measurements.unit,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  sectionTitle: {
    ...GlobalStyle.TextStyle.headingMedium,
    marginBottom: GlobalStyle.Measurements.margin,
  },
  questionContainer: {
    width: WIDTH - 40,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  questionTitle: {
    ...GlobalStyle.TextStyle.headingSmall,
    paddingHorizontal: 2,
  },
  questionAnswer: {
    ...GlobalStyle.TextStyle.bodyRegular,
    paddingHorizontal: 2,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  questionTitleContainer: {
    width: WIDTH - 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    borderRadius: 50,
    backgroundColor: '#e5e5e570',
    height: ICON_SIZE + 10,
    width: ICON_SIZE + 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: GlobalStyle.Measurements.margin,
  },
  questionImage: {
    width: WIDTH - 40,
    minHeight: GlobalStyle.Measurements.height * 0.25,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit / 1.5,
    alignSelf: 'center',
  },
  askQuestionIcon: {
    height: GlobalStyle.Measurements.unit * 1.3,
    width: GlobalStyle.Measurements.unit * 1.3,
    borderRadius: 100,
    backgroundColor: GlobalStyle.ColorStyle.blueButtonText,

    alignItems: 'center',
    justifyContent: 'center',
  },
  askQuestionRow: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  askQuestionTextInput: {
    ...GlobalStyle.TextStyle.bodyRegular,
    width: WIDTH * 0.8,

    padding: 3,
  },
});
