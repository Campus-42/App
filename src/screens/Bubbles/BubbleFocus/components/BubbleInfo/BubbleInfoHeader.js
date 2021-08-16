import React from 'react';
import {Pressable} from 'react-native';
import {View, Text} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {styles} from '../../style';

export function BubbleInfoHeader(props) {
  return (
    <View style={styles.infoHeader}>
      <Pressable hitSlop={10} onPress={() => props.onPress()}>
        <FontAwesome5Icon
          name={'chevron-left'}
          color={GlobalStyle.ColorStyle.blueButtonText}
          size={GlobalStyle.Measurements.unit}
        />
      </Pressable>
      <Text numberOfLines={1} style={styles.infoHeaderText}>
        {props.title}
      </Text>
    </View>
  );
}
