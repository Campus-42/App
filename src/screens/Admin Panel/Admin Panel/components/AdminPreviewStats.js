import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {Dimensions} from 'react-native';

export function AdminPreviewStats(props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Reported users</Text>
          <Text style={styles.boxNumber}>3</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Submitted societies</Text>
          <Text style={styles.boxNumber}>6</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Reported users</Text>
          <Text style={styles.boxNumber}>3</Text>
        </View>
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Submitted societies</Text>
          <Text style={styles.boxNumber}>6</Text>
        </View>
      </View>
    </View>
  );
}

const ROW_WIDTH = GlobalStyle.Measurements.width;
const PADDING = GlobalStyle.Measurements.marginHalf;
const BOX_WIDTH = ROW_WIDTH / 2 - PADDING * 1.75;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',

    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.margin,
  },
  row: {
    width: ROW_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PADDING,
  },
  box: {
    width: BOX_WIDTH,
    padding: GlobalStyle.Measurements.marginHalf,

    borderRadius: GlobalStyle.Measurements.unit / 2,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  boxTitle: {
    ...GlobalStyle.TextStyle.headingSmall,
  },
  boxNumber: {
    ...GlobalStyle.TextStyle.bodyMedium,
    fontSize: Dimensions.get('screen').fontScale * 32,
    fontWeight: 'bold',
    color: 'red',
  },
});

AdminPreviewStats.defaultProps = {};
AdminPreviewStats.propTypes = {};
