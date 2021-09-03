import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {CAPTURE_SIZE} from './CaptureButton';

export function FlashButton(props) {
  return (
    <Pressable style={styles.container} onPress={() => props.onPress()}>
      <Ionicon
        name={props.flash == 'off' ? 'flash-off-outline' : 'flash'}
        size={SIZE}
        color={'#ffffff'}
      />
    </Pressable>
  );
}
const SIZE = GlobalStyle.Measurements.width * 0.075;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    marginTop: GlobalStyle.Measurements.height * 0.95 - CAPTURE_SIZE + SIZE / 2,
    marginLeft: (GlobalStyle.Measurements.width / 6) * 5 - SIZE / 2,

    alignSelf: 'flex-start',
  },
});
