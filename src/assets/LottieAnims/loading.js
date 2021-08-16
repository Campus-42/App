import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import LoadingAnimation from '../Images/loading-animation.json';
import PropTypes from 'prop-types';
import {getSize} from './style';

export const LoadingCircle = (props) => {
  const size = getSize(props.size);
  return (
    <View style={[props.style, {width: size, height: size}]}>
      <LottieView
        source={LoadingAnimation}
        loop
        autoPlay
        style={{position: 'relative'}}
      />
    </View>
  );
};

LoadingCircle.defaultProps = {
  size: 'regular',
  style: {},
};
LoadingCircle.propTypes = {
  size: PropTypes.oneOf(['regular', 'large', 'small']),
  style: PropTypes.object,
};
