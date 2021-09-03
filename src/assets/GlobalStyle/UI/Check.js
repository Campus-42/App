import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Measurements} from '../Measurements';

export function ClaimCheck(props = {claimed: false}) {
  return (
    // <LottieView
    //   source={require('../../Images/confirmation-animation.json')}
    //   style={{
    //     width: GlobalStyle.Measurements.unit,
    //     height: GlobalStyle.Measurements.unit,
    //   }}
    //   autoPlay
    // />
    <FontAwesome5
      name={props.claimed ? 'check-circle' : 'times-circle'}
      color={props.claimed ? 'green' : 'red'}
      size={Measurements.unit}
    />
  );
}
