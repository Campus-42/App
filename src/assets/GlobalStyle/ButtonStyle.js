import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Text,
  View,
  ImagePropTypes,
  ActivityIndicator,
} from 'react-native';
import {Measurements} from './Measurements';
import {ColorStyle, Palettes} from './ColorStyle';
import {ViewStyle} from './ViewStyle';
import LinearGradient from 'react-native-linear-gradient';
import {TextStyle} from './TextStyle';

export const ButtonStyle = StyleSheet.create({
  Circle: {
    ...ViewStyle.palette6,
    width: Measurements.unit * 2,
    height: Measurements.unit * 2,
    borderRadius: Measurements.unit,
  },
  TouchableUnderlay: {
    ...ViewStyle.palette5,
  },
  Large: {
    ...ViewStyle.palette6,
    minHeight: Measurements.height * 0.062,
    width: Measurements.width * 0.85,
    borderRadius: Measurements.height * 0.02,
    paddingHorizontal: Measurements.margin,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bdbdbd',
  },
  Medium: {
    ...ViewStyle.palette6,
    height: Measurements.safeheight * 0.05,
    width: Measurements.width * 0.4,
    borderRadius: Measurements.height * 0.01,
    padding: Measurements.height * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bdbdbd',
  },
  Small: {
    ...ViewStyle.palette6,
    height: Measurements.height * 0.03,
    width: Measurements.width * 0.25,
    borderRadius: Measurements.height * 0.005,
    padding: Measurements.height * 0.005,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bdbdbd',
  },
  DestructiveTextButton: {
    ...TextStyle.buttonMedium,
    color: ColorStyle.redButtonText,
    alignSelf: 'center',
    marginVertical: Measurements.margin * 2,
  },
  TextButton: {
    ...TextStyle.buttonSmall,
    color: ColorStyle.blueButtonText,
    alignSelf: 'center',
    marginVertical: Measurements.marginHalf,
  },
});

export const LinearGradientButton = (props) => {
  return (
    <TouchableHighlight
      style={[
        internalStyles.gradientButton,
        {marginVertical: Measurements.margin},
        props.style,
      ]}
      disabled={props.disabled}
      onPress={props.onPress}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        colors={props.colors}
        style={[internalStyles.gradientButton, props.style]}>
        <View
          style={[
            props.style,
            {
              flexDirection: 'row',
              backgroundColor: '#00000000',
              justifyContent: 'space-between',
            },
          ]}>
          <Text style={internalStyles.gradientText}>{props.text}</Text>
          <ActivityIndicator color={'#fff'} animating={props.loading} />
        </View>
      </LinearGradient>
    </TouchableHighlight>
  );
};

LinearGradientButton.defaultProps = {disabled: false, loading: false};

const internalStyles = StyleSheet.create({
  gradientButton: {
    borderRadius: Measurements.unit,
    height: Measurements.unit * 2,
    width: Measurements.unit * 4,
    alignItems: 'center',
    flexDirection: 'row',
  },

  gradientText: {
    ...TextStyle.textInputMedium,
    color: Palettes.inverseText.palette6,
  },
});
