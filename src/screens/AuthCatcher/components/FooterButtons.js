import React from 'react';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {Pressable} from 'react-native';
import {View} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const KEYS = {
  resetpassword: {
    title: 'Reset password',
  },
  signin: {
    title: 'Sign in',
  },
  createaccount: {
    title: 'Create account',
  },
};

export function FooterButtons(props) {
  return (
    <View style={styles.container}>
      {props.keys.map((key) => (
        <Button
          key={key}
          authKey={key || 'initial'}
          onPress={props.updateTarget}
        />
      ))}
    </View>
  );
}

function Button(props) {
  const title = (KEYS[props.authKey] || {}).title;
  return (
    <Pressable
      style={styles.button}
      onPress={() => props.onPress(props.authKey)}>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',

    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: 40,
  },
  title: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
});
