import React from 'react';
import {Text as RNText, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Palettes} from '../../ColorStyle';
import {Line} from '../../Line';
import {ICON_COLOUR, ICON_SIZE, styles} from './style';

export function Text(props) {
  /**
   * @props { title, text, color }
   *
   * The last prop, determines if a line should
   * be shown after the component. If true, then
   * no line
   */

  const color = props.color || Palettes.text.palette6;

  return (
    <View>
      <View style={styles.childrenView}>
        <View style={styles.childrenSubView}>
          {props.title && (
            <RNText style={[styles.childrenTitle, {color}]}>
              {props.title}
            </RNText>
          )}
          {props.text && (
            <RNText style={[styles.childrenText, {color}]}>{props.text}</RNText>
          )}
        </View>
      </View>
      {!props.last && <Line />}
    </View>
  );
}
