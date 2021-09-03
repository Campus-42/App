import React from 'react';
import {StyleSheet} from 'react-native';
import {Pressable} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {CAPTURE_SIZE, styles as captureStyles} from './CaptureButton';

export function FlipCamera(props) {
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Ionicon name={'repeat'} color={'#fff'} size={SIZE} />
    </Pressable>
  );
}
const SIZE = GlobalStyle.Measurements.width * 0.075;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    marginTop: captureStyles.container.marginTop - CAPTURE_SIZE,
    alignSelf: 'center',
  },
});
