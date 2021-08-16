import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';

function Stat(props) {
  return (
    <View style={styles.component}>
      <Text style={styles.bigText}>{props.value}</Text>
      <Text style={styles.smallText}>{props.type}</Text>
    </View>
  );
}

export function Stats(props) {
  return (
    <View style={styles.container}>
      <Stat value={props.eventCount} type={'Events'} />
      <Stat value={props.societyCount} type={'Societies'} />
      <Stat
        value={props.points.toString().replace(/\D/g, '')}
        type={'Points'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: GlobalStyle.Measurements.width * 0.6,
    justifyContent: 'space-around',
    marginVertical: GlobalStyle.Measurements.marginHalf,
    marginTop: GlobalStyle.Measurements.margin,
  },
  component: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: GlobalStyle.Measurements.width * 0.2,
    minHeight: GlobalStyle.Measurements.height * 0.05,
  },
  bigText: {
    ...GlobalStyle.TextStyle.headingMedium,
    textAlign: 'center',
  },
  smallText: {
    ...GlobalStyle.TextStyle.bodySmall,
    textAlign: 'center',
  },
});
