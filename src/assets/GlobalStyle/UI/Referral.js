import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ButtonStyle} from '../ButtonStyle';
import {ColorStyle} from '../ColorStyle';
import {TextStyle} from '../TextStyle';
import Color from 'color';
import {Measurements} from '../Measurements';
import PropTypes from 'prop-types';
import {Alert} from 'react-native';
import {analytics} from '../../Analytics';

/**
 * A set of referral buttons
 */

function Large(props) {
  // Customize the text depending if points have been passed
  // 'points' is extra points earned by referring
  var text = 'Refer and earn more points';
  if (props.points) text = `Refer and earn ${props.points} points`;
  if (props.text) text = props.text;

  function onPress() {
    if (props.navigate) props.navigate('Referral Focus');
    else {
      analytics.error(
        new Error('Navigation was not passed to referral'),
        'Referral',
        'Large/onPress',
      );
      Alert.alert(
        'Referral error',
        'We could not refer right now, please try again later',
      );
    }
  }

  return (
    <TouchableOpacity
      style={[styles.large.shadow, props.wrapperStyle]}
      onPress={props.onPress || onPress}>
      <LinearGradient
        start={{x: 0, y: 0.1}}
        end={{x: 0.2, y: 0.3}}
        colors={gradientColors}
        style={[styles.large.container, props.style]}>
        <Text style={[styles.large.text, props.textStyle]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
function Small(props) {
  return <TouchableOpacity></TouchableOpacity>;
}

const color = ColorStyle.referralColour;
const gradientColors = [Color(color).lighten(0.35).hsl().string(), color];

const styles = {
  large: StyleSheet.create({
    container: {
      ...ButtonStyle.Large,
      alignSelf: 'center',
    },
    shadow: {
      marginVertical: Measurements.marginHalf,

      shadowColor: color,
      shadowOffset: {width: 0, height: 3},
      shadowOpacity: 0.5,
      shadowRadius: 5,
    },
    text: {
      ...TextStyle.buttonMedium,
      color: '#fff',
    },
  }),
  small: StyleSheet.create({}),
};

Large.defaultProps = {
  points: 40,
  navigate: false,
  text: false,

  style: {},
  textStyle: {},
  wrapperStyle: {},
};
Large.propTypes = {
  points: PropTypes.number,
  navigate: PropTypes.func,
  text: PropTypes.string,

  style: PropTypes.object,
  textStyle: {},
  wrapperStyle: {},
};

export const Referral = {Large, Small};
