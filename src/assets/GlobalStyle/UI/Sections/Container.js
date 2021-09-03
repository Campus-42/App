import React from 'react';
import {Text} from 'react-native';
import {View} from 'react-native';
import {styles} from './style';

export function Container(props) {
  /**
   * The overarching container for the section
   * children.
   *
   * @props { title }
   */
  return (
    <View style={styles.container}>
      {props.title && (
        <View style={styles.containerTitleWrapper}>
          <Text style={styles.containerTitle}>{props.title}</Text>
          {props.footer}
        </View>
      )}
      {props.children}
    </View>
  );
}
