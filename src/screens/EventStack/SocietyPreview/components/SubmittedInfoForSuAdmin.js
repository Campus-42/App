import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function SubmittedInfoForSuAdmin(props) {
  const color = GlobalStyle.ColorStyle.blueButtonText;
  return (
    <View
      style={{
        marginVertical: GlobalStyle.Measurements.marginHalf,
        width: GlobalStyle.Measurements.width * 0.9,
        padding: GlobalStyle.Measurements.marginHalf,
        backgroundColor: GlobalStyle.Palettes.background.palette6,
        borderRadius: GlobalStyle.Measurements.unit,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: GlobalStyle.Measurements.marginHalf,
        }}>
        <FontAwesome5Icon
          name={'info-circle'}
          color={color}
          size={GlobalStyle.Measurements.unit}
          style={{marginRight: 10}}
        />
        <Text style={[GlobalStyle.TextStyle.bodyLargeBold, {color, color}]}>
          Submitted society
        </Text>
      </View>
      <Text
        style={[GlobalStyle.TextStyle.bodyRegular, {paddingHorizontal: 10}]}>
        See more information and confirm it on the admin panel in your desktop
        browser
      </Text>
    </View>
  );
}
