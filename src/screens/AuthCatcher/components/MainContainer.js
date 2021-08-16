import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {ANIMATION_LOGO_MARGINS, LOGO_BOTTOM_MARGIN, LOGO_SIZE} from '../style';

export function MainContainer(props) {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
}

const MAIN_CONTAINER_HEIGHT =
  GlobalStyle.Measurements.safeheight - LOGO_SIZE - LOGO_BOTTOM_MARGIN - 10;

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    height: MAIN_CONTAINER_HEIGHT,
  },
});
