import React from 'react';
import {View, Linking, Text, Alert} from 'react-native';
import {styles} from '../style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';

export function WebButton(props) {
  return (
    <TouchableShrink
      {...props}
      showIcon
      shrinkFactor={1}
      iconColor={GlobalStyle.TextStyle.blueText.color}
      iconSize={GlobalStyle.Measurements.unit * 0.7}
      iconBackground={GlobalStyle.Palettes.background.palette6}
      icon={'external-link-alt'}
      triggerHaptic
      style={styles.actionButtonContainer}
      onPress={() => {
        props.navigation.navigate('Web View', {url: props.link});
      }}>
      <Text style={styles.actionButtonText}>Society Website</Text>
    </TouchableShrink>
  );
}
