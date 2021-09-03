import React from 'react';
import {Image} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import Logo_Transparent from '../Images/logo_transparent.png';

export function Logo() {
  return <Image source={Logo_Transparent} style={style} />;
}

const size = GlobalStyle.Measurements.unit;

const style = {
  width: size,
  height: size,
  resizeMode: 'contain',
  alignSelf: 'center',
  marginBottom: GlobalStyle.Measurements.height * 0.05,
};
