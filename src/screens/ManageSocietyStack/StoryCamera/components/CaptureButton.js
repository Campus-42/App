import React from 'react';
import {StyleSheet, Pressable, Animated} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import * as Animtable from 'react-native-animatable';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Easing} from 'react-native';

export const MAX_VIDEO_DURATION = 8000; // Mlliseconds

const AnimPressable = Animtable.createAnimatableComponent(Pressable);

export function CaptureButton(props) {
  /**
   * Capture button to visualize and capture images and videos
   *
   * INFORMATION: When an animation in circular is done, a new key will be set to reset
   * the animation circle to zero without animation
   */
  const [holding, setHolding] = React.useState(false);
  const [fill, setFill] = React.useState(0);
  const [key, setKey] = React.useState('1');

  const pressable = React.useRef();
  const circular = React.useRef();
  var timeout;

  function onLongPress() {
    setHolding(true);
    setFill(100);
    scaleButton(1.2);
    props.startRecording();
  }
  function onRelease() {
    // TODO: How to detect when still holding but outside the button
    // TODO: How to zoom the video or image
    setHolding(false);
    scaleButton(1);
    setFill(0);
    incrementKey();
    props.stopRecording();
  }
  function onPress() {
    props.takePicture();
  }

  function incrementKey() {
    /** Used to reset the circular to zero without animation
     *  by creating a new component when setting a different key
     */
    setKey(parseInt(key) + 1);
  }

  const onMaxDurationReached = () => {
    if (holding && fill > 95) {
      incrementKey();
      props.restartRecording();
    }
  };

  function scaleButton(value = 1) {
    pressable.current.transitionTo({scale: value}, 500);
    try {
      circular.current.transitionTo({scale: value * 1.2}, 500);
    } catch {}
  }

  return (
    <AnimPressable
      ref={pressable}
      style={styles.container}
      onPress={onPress}
      hitSlop={10}
      onPressOut={onRelease}
      onLongPress={onLongPress}>
      {holding && (
        <Animtable.View ref={circular} style={styles.circular}>
          <AnimatedCircularProgress
            key={key}
            padding={3}
            width={5}
            lineCap={'round'}
            duration={MAX_VIDEO_DURATION}
            fill={fill}
            rotation={360}
            easing={Easing.linear}
            size={CAPTURE_SIZE - 2}
            tintColor={'#ff0000'}
            onAnimationComplete={onMaxDurationReached}
          />
        </Animtable.View>
      )}
    </AnimPressable>
  );
}

export const CAPTURE_SIZE = GlobalStyle.Measurements.width * 0.185;
export const styles = StyleSheet.create({
  container: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
    borderRadius: CAPTURE_SIZE / 2,

    backgroundColor: GlobalStyle.Palettes.background.palette6,
    opacity: 1,

    position: 'absolute',
    alignSelf: 'center',

    marginTop: GlobalStyle.Measurements.height * 0.95 - CAPTURE_SIZE,
  },
  circular: {
    width: CAPTURE_SIZE,
    height: CAPTURE_SIZE,
  },
});
