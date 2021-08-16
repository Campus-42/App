import React from 'react';
import {Pressable} from 'react-native';
import PropTypes from 'prop-types';
import {createAnimatableComponent} from 'react-native-animatable';
import {triggerHaptic} from '../../Haptic/hapticFeedback';

const AnimatablePressable = createAnimatableComponent(Pressable);

// Variables to handle a double tap by comparing time deltas
let lasttap = 0; // when the latest tap was
let delay = 400; // double tap delay in milliseconds
let timeout;

export class Touchable extends React.Component {
  constructor() {
    super();
    this.pressable = React.createRef(); // The reference to the pressable component
  }

  handlePress = (evt) => {
    // Construct the time delta
    const time = Date.now();
    const delta = time - lasttap;

    if (this.props.allowDoublePress) {
      if (delta < delay) {
        // Double tap
        clearTimeout(timeout); // Remove the activated single tap

        this.props.pulse && triggerHaptic('notificationSuccess');
        this.props.pulse && this.pressable.current.pulse(400, 50);

        this.props.onDoublePress(evt);
      } else {
        // Single tap
        timeout = setTimeout(() => this.props.onPress(evt), delay);
      }
    } else {
      this.props.onPress(evt);
    }
    lasttap = time;
  };

  // Pass the animation function to call freely the animation required
  animate = (animation = 'pulse', duration = 500, delay = 0) => {
    // pressable.current[animation](duration);
    try {
      if (typeof animation == 'string')
        this.pressable.current[animation](duration, delay);
      else if (typeof animation == 'object')
        this.pressable.current.animate(animation, duration);
    } catch {}
  };

  render() {
    return (
      <AnimatablePressable
        ref={this.pressable}
        {...this.props}
        onPress={this.handlePress}>
        {this.props.children}
      </AnimatablePressable>
    );
  }
}

Touchable.defaultProps = {
  hitSlop: 3,
  pulse: true,
  allowDoublePress: false,

  onPress: () => {},
  onDoublePress: () => {},
  onLongPress: () => {},
};
Touchable.propTypes = {
  hitSlop: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  onPress: PropTypes.func,
  allowDoublePress: PropTypes.bool,

  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onLongPress: PropTypes.func,
  pulse: PropTypes.bool,
};
