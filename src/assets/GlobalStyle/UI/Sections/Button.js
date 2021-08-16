import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {ColorStyle, Palettes} from '../../ColorStyle';
import {Line} from '../../Line';
import {ICON_COLOUR, ICON_SIZE, styles} from './style';

export function Button(props) {
  /**
   * @props { title, onPress, text, last, icon, color }
   *
   * The last prop, determines if a line should
   * be shown after the component. If true, then
   * no line
   */
  function onPress() {
    if (typeof props.onPress === 'function') props.onPress();
  }

  const color =
    props.color || props.blue
      ? ColorStyle.blueButtonText
      : Palettes.text.palette6;

  return (
    <View>
      <View style={props.error && styles.errorContainer}>
        <TouchableOpacity style={styles.childrenView} onPress={onPress}>
          <View style={styles.childrenSubView}>
            <Text style={[styles.childrenTitle, {color}]}>
              {props.title || 'Button'}
            </Text>
            {props.text && (
              <Text
                style={[styles.childrenText, props.textStyle]}
                numberOfLines={1}>
                {props.text}
              </Text>
            )}
          </View>
          <FontAwesome5Icon
            name={props.icon || 'chevron-right'}
            size={ICON_SIZE}
            color={props.color || ICON_COLOUR}
          />
        </TouchableOpacity>
        {props.error && <Text style={styles.errorText}>{props.error}</Text>}
      </View>
      {!props.last && <Line />}
    </View>
  );
}
