import React from 'react';
import {TextPropTypes} from 'react-native';
import TextTicker from 'react-native-text-ticker';

export function TextTickerAnimation(
  props = {
    text: '',
    style: {},
    loop: false,
    bounce: false,
    shouldAnimateTreshold: 0,
    bounceDelay: 5000,
    marqueeDelay: 2500,
    ...TextPropTypes,
  },
) {
  return (
    <TextTicker
      {...props}
      bounce
      loop={false}
      scroll={false}
      marqueeDelay={2500}
      style={props.style}>
      {props.text}
    </TextTicker>
  );
}
