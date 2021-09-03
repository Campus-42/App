import React from 'react';
import {Pressable, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {Measurements} from '../Measurements';
import {TextStyle} from '../TextStyle';
import {createAnimatableComponent} from 'react-native-animatable';

const AnimatablePressable = createAnimatableComponent(Pressable);

export class FloatingButton extends React.Component {
  constructor() {
    super();
    this.pressable = React.createRef();
    this.state = {
      prevAnimation: false,
    };
  }
  componentDidUpdate() {
    if (
      (this.props.show && this.state.prevAnimation !== BOTTOM_IN) ||
      (this.props.show === false && this.state.prevAnimation !== BOTTOM_OUT)
    ) {
      var animation = BOTTOM_OUT;

      if (this.props.show) animation = BOTTOM_IN;
      if (this.pressable.current) {
        this.pressable.current.transitionTo(
          {bottom: animation},
          ANIMATION_DURATION,
        );
        this.setState({prevAnimation: animation});
      }
    }
  }
  render() {
    return (
      <AnimatablePressable
        ref={this.pressable}
        onPress={this.props.onPress}
        style={[
          styles.container,
          {
            backgroundColor: this.props.colors.main,
            shadowColor: this.props.colors.main,
          },
        ]}>
        <Text style={styles.title}>{this.props.title}</Text>
      </AnimatablePressable>
    );
  }
}
const ANIMATION_DURATION = 650;
const BOTTOM_OUT = Measurements.height * -0.5;
const BOTTOM_IN = StaticSafeAreaInsets.safeAreaInsetsTop / 1.5;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: BOTTOM_OUT,
    width: Measurements.width * 0.85,
    alignSelf: 'center',

    borderRadius: 15,
    padding: 20,

    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  title: {
    ...TextStyle.buttonMedium,
    color: '#fff',
    alignSelf: 'center',
  },
});

FloatingButton.defaultProps = {
  onPress: () => {},
  title: '',
  colors: {main: ''},
  show: false,
};
FloatingButton.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  colors: PropTypes.object,
  show: PropTypes.bool.isRequired,
};
