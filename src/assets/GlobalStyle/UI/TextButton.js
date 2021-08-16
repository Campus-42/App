import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {ColorStyle} from '../ColorStyle';
import {Measurements} from '../Measurements';
import {TextStyle} from '../TextStyle';

export function TextButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress} style={props.buttonStyles}>
      <Text style={styles.text}>{props.title || 'Button Title'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    ...TextStyle.buttonSmall,
    color: ColorStyle.blueButtonText,
    height: undefined,
    alignSelf: 'center',
    padding: 10,
    marginVertical: Measurements.marginHalf / 1.5,
  },
});
