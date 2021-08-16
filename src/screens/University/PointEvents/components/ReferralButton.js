import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function PointsReferralButton(props) {
  const {padding, width} = props.parentStyle || {};
  function onPress() {
    props.navigate('Referral Focus');
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        padding &&
          width && {
            marginTop: padding,
            width: width - padding * 2,
          },
        props.style,
      ]}>
      <Text style={styles.text}>{props.text || 'Refer a friend'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyle.ButtonStyle.Medium,
    borderRadius: GlobalStyle.Measurements.unit / 2,
    backgroundColor: `${GlobalStyle.ColorStyle.referralColour}20`,
  },
  text: {
    ...GlobalStyle.TextStyle.buttonMedium,
    color: GlobalStyle.ColorStyle.referralColour,
  },
});
