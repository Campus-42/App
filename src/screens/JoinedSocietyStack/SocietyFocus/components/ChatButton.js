import React from 'react';
import {View, Alert, Linking, Text} from 'react-native';
import {styles} from '../style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';

export function ChatButton(props) {
  return (
    <TouchableShrink
      {...props}
      showIcon
      iconColor={'#25D366'}
      shrinkFactor={1}
      iconSize={GlobalStyle.Measurements.unit}
      iconBackground={GlobalStyle.Palettes.background.palette6}
      icon={'whatsapp'}
      triggerHaptic
      style={styles.actionButtonContainer}
      onPress={() => {
        Linking.openURL(props.link).catch((err) => {
          Alert.alert(
            'Cannot open URL',
            'This link is not valid, Ask your society to update their link',
          );
          console.warn('Could not open link', err);
        });
      }}>
      <Text style={styles.actionButtonText}>Chat on WhatsApp</Text>
    </TouchableShrink>
  );
}
