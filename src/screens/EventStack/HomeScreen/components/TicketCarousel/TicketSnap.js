import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import PropTypes from 'prop-types';
import {TicketFuncs} from './functions';
import TouchableShrink from '../../../../../assets/TouchableShrink/TouchableShrink';
import QRCode from 'react-native-qrcode-svg';
import {DateFuncs} from '../../../../../assets/Date';

export function TicketSnap(props) {
  const item = props.item || {};
  var barCode = TicketFuncs.generateCode(item.id);

  const times = DateFuncs.getTimeInterval(item.date.start, item.date.end);

  return (
    <TouchableShrink
      style={styles.container}
      triggerHaptic
      onPress={() => props.openTicket(props.item)}>
      <GlobalStyle.UI.Image
        style={styles.image}
        source={{uri: item.images.preview}}
      />
      <View style={{marginLeft: PADDING}}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.timeText}>
          {times}
        </Text>
      </View>
    </TouchableShrink>
  );
}

const IMAGE_SIZE = GlobalStyle.Measurements.unit * 2.5;
const WIDTH = GlobalStyle.Measurements.width * 0.8;
const PADDING = 7.5;

const styles = StyleSheet.create({
  container: {
    padding: PADDING,
    borderRadius: GlobalStyle.Measurements.unit,

    shadowColor: GlobalStyle.Palettes.text.palette6,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: GlobalStyle.Measurements.unit / 5,
    elevation: 3,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
    width: WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    ...GlobalStyle.TextStyle.bodyMedium,
    width: WIDTH - IMAGE_SIZE - PADDING * 4,
  },
  timeText: {
    ...GlobalStyle.TextStyle.bodySmall,
    width: WIDTH - IMAGE_SIZE - PADDING * 4,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: PADDING,
  },
});

TicketSnap.defaultProps = {
  style: {
    width: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.unit * 7,
  },
  colors: {main: 'blue', extraLight: 'blue'},
  item: {},
  navigate: () => {},
};
TicketSnap.propTypes = {
  style: PropTypes.object.isRequired,
  colors: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
};
