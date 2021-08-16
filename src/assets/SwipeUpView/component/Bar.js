import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GlobalStyle} from '../../GlobalStyle';

export const Bar = (props) => {
  return (
    <View {...props}>
      <View style={styles.container}>
        <View style={styles.bar} />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: GlobalStyle.Measurements.height * 0.055,
    width: GlobalStyle.Measurements.width,
    backgroundColor: '#00000000',
  },
  bar: {
    width: GlobalStyle.Measurements.width * 0.2,
    height: 5,
    borderRadius: 3,
    // marginVertical: 10,
    marginTop: 15,
    backgroundColor: '#e2e2e2',
  },
});
