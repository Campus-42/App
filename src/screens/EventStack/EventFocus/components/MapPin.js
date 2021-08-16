import React from 'react';
import {TouchableOpacity} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export const MapPin = (props) => {
  return (
    <Entypo
      name={'location-pin'}
      color={props.color}
      size={GlobalStyle.Measurements.unit * 2.5}
    />
  );
};
