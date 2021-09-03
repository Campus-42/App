import React from 'react';
import {View} from 'react-native';
import {Measurements} from './Measurements';

export const Line = (props) => {
  return <View style={[style, props.style]} />;
};
const style = {
  borderTopWidth: .65,
  borderTopColor: '#d5d5d5',
  width: Measurements.width * 0.75,
  borderRadius: 3,
  alignSelf: 'center',
  marginVertical: Measurements.marginQuarter,
};
