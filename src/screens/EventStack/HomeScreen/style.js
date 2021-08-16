import {StyleSheet, Dimensions} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export const styles = StyleSheet.create({
  container: {
    ...GlobalStyle.ViewStyle.largeContainer,
  },
  modal: {
    position: 'absolute',
    height: GlobalStyle.Measurements.height,
    width: GlobalStyle.Measurements.width,
    backgroundColor: '#00000070',
  },
  modalTicketContainer: {
    position: 'absolute',
    zIndex: 2,

    minHeight: GlobalStyle.Measurements.height * 0.6,
    width: GlobalStyle.Measurements.width * 0.9,

    marginVertical: GlobalStyle.Measurements.height * 0.2,
    // padding: GlobalStyle.Measurements.marginHalf,
    borderRadius: GlobalStyle.Measurements.unit,

    alignSelf: 'center',
    backgroundColor: '#fff',

    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ticketTitle: {
    ...GlobalStyle.TextStyle.headingMedium,
    marginTop: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },
  ticketSubTitle: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette4,
    marginTop: GlobalStyle.Measurements.marginQuarter,
    alignSelf: 'center',
  },
  qrCode: {
    padding: GlobalStyle.Measurements.marginHalf,
    borderWidth: 2,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    borderColor: GlobalStyle.Palettes.background.palette5,
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width:
      GlobalStyle.Measurements.width * 0.9 -
      GlobalStyle.Measurements.margin * 2,
  },
  ticketRowComponent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: GlobalStyle.Measurements.width * 0.375,
  },
  ticketBoldText: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  ticketText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  ticketClaimContainer: {
    width:
      GlobalStyle.Measurements.width * 0.9 -
      GlobalStyle.Measurements.margin * 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  ticketClaimText: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    marginRight: GlobalStyle.Measurements.marginHalf,
  },
  ticketClaimImage: {
    width: GlobalStyle.Measurements.unit,
    height: GlobalStyle.Measurements.unit,
    resizeMode: 'center',
  },
  search: {
    width: GlobalStyle.Measurements.width,
    minHeight: GlobalStyle.Measurements.height * 0.3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: GlobalStyle.Measurements.margin,
  },
  eventSnapSearch: {
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  showEventButton: {
    ...GlobalStyle.ButtonStyle.Large,
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  title: {
    ...GlobalStyle.TextStyle.logoRegular,
    textAlign: 'left',
  },
  filterHeading: {
    ...GlobalStyle.TextStyle.headingMedium,
    marginTop: GlobalStyle.Measurements.margin,
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  modalContainer: {
    paddingHorizontal: GlobalStyle.Measurements.margin,
    // flex: 1,
  },
  sliderMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 1},
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
  },
  filterPriceInput: {
    ...GlobalStyle.TextStyle.textInputMedium,
    minWidth: GlobalStyle.Measurements.width * 0.3,

    padding: 10,
    paddingVertical: 5,

    borderColor: '#bbb',
    // borderWidth: 1,
    borderRadius: 10,
  },
  filterDateText: {
    ...GlobalStyle.TextStyle.textInputMedium,
  },
  filterFlatList: {
    height: GlobalStyle.Measurements.height * 0.3,
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    marginTop: GlobalStyle.Measurements.margin,
    paddingHorizontal: 5,
    paddingBottom: GlobalStyle.Measurements.margin,
  },
});
