import React from 'react';
import {ImagePropTypes} from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {Palettes} from '../ColorStyle';
import {Pressable} from 'react-native';
import {Platform} from 'react-native';

export function Image(
  props = {
    ...ImagePropTypes,
    style: {height: 10, width: 10, borderWidth: 0},
    resize: false,
    navigate: false,
  },
) {
  const [ratio, setRatio] = React.useState(1); // height / width
  const [loading, setLoading] = React.useState(true);

  // Android needs further source configuration
  const source =
    Platform.OS === 'android'
      ? props.source &&
        typeof props.source.uri === 'string' &&
        !props.source.uri.split('http')[1]
        ? null
        : props.source
      : props.source;

  function renderImage() {
    return (
      <FastImage
        {...props}
        onLoad={({nativeEvent}) => {
          setLoading(false);
          if (props.resize) {
            const ratio = nativeEvent.height / nativeEvent.width;
            setRatio(ratio > props.maxRatio ? props.maxRatio : ratio);
          }
        }}
        source={{...source, priority: FastImage.priority.normal}}
        style={[
          loading && {backgroundColor: Palettes.background.palette5},
          props.style,
          props.resize && {
            height: props.style.width * ratio,
            width: props.style.width,
          },
        ]}
      />
    );
  }
  if (props.navigate)
    return (
      <Pressable
        onPress={() => props.navigate('Image Focus', {uri: props.source.uri})}>
        {renderImage}
      </Pressable>
    );
  else return renderImage();
}
Image.defaultProps = {
  maxRatio: 1.3,
  source: {uri: ''},
  navigate: false,
};
Image.propTypes = {
  maxRatio: PropTypes.number,
  resize: PropTypes.bool,
  style: PropTypes.object,
};
