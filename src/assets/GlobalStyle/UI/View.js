import React from 'react';
import {View as RNView} from 'react-native';

export function View(props) {
  const style = props.colorScheme;

  return (
    <RNView {...props} style={[style, props.style]}>
      {props.children}
    </RNView>
  );
}
