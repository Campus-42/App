import React from 'react';
import {Text} from 'react-native';
import {styles} from '../../ManageSocietyFocus/style';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {View} from 'react-native';
import CheckBox from 'react-native-check-box';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import * as Animatable from 'react-native-animatable';
import Ionicon from 'react-native-vector-icons/Ionicons';

const AnimatableTouchableShrink = Animatable.createAnimatableComponent(
  TouchableShrink,
);

export const SearchElementInScroll = (props) => {
  return (
    <AnimatableTouchableShrink
      key={props.value}
      style={[
        styles.scrollViewElementContainer,
        {
          borderWidth: props.isSelected ? 1 : 0,
          borderColor: props.isSelected ? props.colors.main : '#00000000',
        },
      ]}
      triggerHaptic
      showShadow
      shadowElevation={3}
      shadowOpacity={0.15}
      animation={'fadeInUpBig'}
      duration={500}
      delay={100 + props.index * 50}
      onPress={props.onPress}>
      {props.showCheckBox ? (
        <CheckBox
          onClick={props.onPress}
          isChecked={props.isSelected}
          checkedCheckBoxColor={props.colors.main}
          uncheckedCheckBoxColor={GlobalStyle.Palettes.background.palette4}
          style={{
            marginRight: GlobalStyle.Measurements.margin,
          }}
        />
      ) : (
        props.showCloseIcon && (
          <View
            style={{
              height: GlobalStyle.Measurements.unit / 1.1,
              width: GlobalStyle.Measurements.unit / 1.1,
              borderRadius: GlobalStyle.Measurements.unit * 0.25,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: GlobalStyle.Measurements.marginHalf,
            }}>
            <Ionicon
              name="ios-close"
              size={GlobalStyle.Measurements.unit}
              color="#ff4545"
            />
          </View>
        )
      )}
      <Text style={[styles.scrollViewElementText, props.textStyle]}>
        {props.value}
      </Text>
    </AnimatableTouchableShrink>
  );
};

SearchElementInScroll.defaultProps = {
  textStyle: {},
  showCheckBox: false,
  showCloseIcon: false,
  index: 0,
};
