import React from 'react';
import {StyleSheet} from 'react-native';
import {Keyboard} from 'react-native';
import {Text} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';
import {AUTH_COLOUR} from '../AuthStages/style';

export function PrimaryButton(props) {
  function onPress() {
    Keyboard.dismiss();
    props.onPress();
  }
  return (
    <TouchableShrink
      onPress={onPress}
      showShadow
      shadowOpacity={0.1}
      showGradient
      loading={props.loading}
      disabled={props.disabled}
      showIcon={props.showIcon}
      shadowColor={props.color || AUTH_COLOUR}
      gradientColor={props.color || AUTH_COLOUR}
      style={[
        styles.button,
        props.showIcon && {justifyContent: 'space-between'},
        props.style,
      ]}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableShrink>
  );
}

const styles = StyleSheet.create({
  button: {
    ...GlobalStyle.ButtonStyle.Large,
    alignSelf: 'center',
    marginVertical: 30,
    flexDirection: 'row',
  },
  text: {
    ...GlobalStyle.TextStyle.buttonMedium,
    color: '#fff',
  },
});
