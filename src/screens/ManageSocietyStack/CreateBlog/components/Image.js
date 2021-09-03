import React from 'react';
import {Pressable} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';

export function BlogImage(props) {
  return (
    <GlobalStyle.UI.Image
      source={{uri: props.item.value}}
      style={styles.contentImage}
      resize
      navigate={props.navigate}
    />
  );
}
