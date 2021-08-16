import React from 'react';
import {Text, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {createAnimatableComponent} from 'react-native-animatable';
import {Pressable} from 'react-native';

const AnimIcon = createAnimatableComponent(FontAwesome5Icon);

export function ScreenTitle(props) {
  return (
    <View
      style={{
        marginHorizontal: GlobalStyle.Measurements.width * 0.05,
        marginTop: GlobalStyle.Measurements.height * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {props.showLeftArrow && (
          <Pressable onPress={props.onLeftArrowPress} hitSlop={7}>
            <AnimIcon
              animation={{
                0: {scale: 0, marginRight: 0},
                1: {scale: 1, marginRight: 10},
              }}
              duration={650}
              name={'arrow-left'}
              size={GlobalStyle.Measurements.unit * 0.725}
              color={GlobalStyle.ColorStyle.blueButtonText}
            />
          </Pressable>
        )}
        <Text style={GlobalStyle.TextStyle.headingLarge}>
          {props.title || ''}
        </Text>
      </View>
      {props.showRightArrow && (
        <Pressable onPress={props.onRightArrowPress} hitSlop={7}>
          <AnimIcon
            animation={{0: {scale: 0}, 1: {scale: 1}}}
            duration={650}
            name={'arrow-right'}
            size={GlobalStyle.Measurements.unit * 0.725}
            color={GlobalStyle.ColorStyle.blueButtonText}
            delay={500}
          />
        </Pressable>
      )}
    </View>
  );
}
