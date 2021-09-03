import React from 'react';
import LottieView from 'lottie-react-native';
import {getSize} from './style';
import {View} from 'react-native';
import Animation from '../Images/error-animation.json';
import PropTypes from 'prop-types';

export function ErrorAnimation(props) {
  const size = getSize(props.size);
  return (
    <View style={[props.style, {width: size, height: size}]}>
      <LottieView source={Animation} loop={false} autoPlay />
    </View>
  );
}

ErrorAnimation.defaultProps = {
  loading: false,
  size: 'regular',
  style: {},
};
ErrorAnimation.propTypes = {
  loading: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['regular', 'large', 'small']),
  style: PropTypes.object,
};
