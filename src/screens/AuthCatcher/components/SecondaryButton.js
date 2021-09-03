import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import TouchableShrink from '../../../assets/TouchableShrink/TouchableShrink';

export function SecondaryButton(props) {
  return (
    <TouchableShrink
      onPress={props.onPress}
      showShadow
      shadowOpacity={0.075}
      shadowElevation={3}
      style={styles.button}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableShrink>
  );
}

const styles = StyleSheet.create({
  button: {
    ...GlobalStyle.ButtonStyle.Large,

    backgroundColor: '#fff',
    alignSelf: 'center',
    marginVertical: 30,
  },
  text: {
    ...GlobalStyle.TextStyle.buttonMedium,
  },
});
