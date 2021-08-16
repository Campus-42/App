import React from 'react';
import {Text, View, TouchableHighlight} from 'react-native';
import {styles} from './style';

export const AuthButtons = (props) => {
  return (
    <View style={styles.authButtonsContainer}>
      <TouchableHighlight
        underlayColor={'#00000000'}
        activeOpacity={0.5}
        style={{padding: 10}}
        onPress={() => props.goToAuthMiddle(props.target1)}>
        <Text style={styles.authButtonsText}>{props.target1}</Text>
      </TouchableHighlight>
      <TouchableHighlight
        underlayColor={'#00000000'}
        activeOpacity={0.5}
        style={{padding: 10}}
        onPress={() => props.goToAuthMiddle(props.target2)}>
        <Text style={styles.authButtonsText}>{props.target2}</Text>
      </TouchableHighlight>
    </View>
  );
};
