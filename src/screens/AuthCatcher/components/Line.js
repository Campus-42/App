import React from 'react';
import {Text} from 'react-native';
import {View} from 'react-native';
import {} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const COLOR = GlobalStyle.Palettes.text.palette4;
const LINE_WIDTH = GlobalStyle.Measurements.width * 0.25;

export function Line() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'stretch',
      }}>
      <GlobalStyle.Line style={{width: LINE_WIDTH}} />
      <Text
        style={[
          GlobalStyle.TextStyle.bodySmall,
          {color: COLOR, marginHorizontal: 15},
        ]}>
        OR
      </Text>
      <GlobalStyle.Line style={{width: LINE_WIDTH}} />
    </View>
  );
}
