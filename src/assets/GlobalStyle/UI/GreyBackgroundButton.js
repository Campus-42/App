import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {Measurements} from '../Measurements';
import {TextStyle} from '../TextStyle';
import {ColorStyle} from '../ColorStyle';
import {ButtonStyle} from '../ButtonStyle';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export function GreyBackgroundButton(props) {
  const color = props.red
    ? ColorStyle.redButtonText
    : ColorStyle.blueButtonText;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props.style,
        props.icon && {justifyContent: 'space-between'},
      ]}
      onPress={props.onPress}
      activeOpacity={0.8}>
      {props.icon && <View style={{width: Measurements.unit * 0.65}} />}
      <Text
        adjustsFontSizeToFit
        style={[styles.text, props.textStyle, {color}]}>
        {props.title}
      </Text>
      {props.icon && (
        <FontAwesome5Icon
          name={props.icon}
          size={Measurements.unit * 0.65}
          color={color}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    ...ButtonStyle.Large,
    height: undefined,
    backgroundColor: '#e8e8e8',
    marginVertical: Measurements.marginHalf / 1.5,
    padding: 15,

    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    ...TextStyle.buttonMedium,
    color: ColorStyle.blueButtonText,
    alignSelf: 'center',
  },
});

GreyBackgroundButton.defaultProps = {
  title: '',
  onPress: () => {},
  red: false,

  style: {},
  textStyle: {},
};
GreyBackgroundButton.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  red: PropTypes.bool,

  style: PropTypes.object,
  textStyle: PropTypes.object,
};
