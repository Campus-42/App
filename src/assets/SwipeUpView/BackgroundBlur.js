import React from 'react';
import {Pressable, Animated} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import * as Animtable from 'react-native-animatable';
import {BlurView} from '@react-native-community/blur';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';

export function BackgroundBlur(props) {
  return props.isActive ? (
    <Pressable onPress={props.onClose} style={styles.pressable} />
  ) : null;
}
const styles = StyleSheet.create({
  pressable: {
    position: 'absolute',
    zIndex: 0,
    height: GlobalStyle.Measurements.height * 2,
    width: GlobalStyle.Measurements.width,
    top: 0,
  },
});
