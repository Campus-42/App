import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity, Text, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Measurements} from '../Measurements';
import {TextStyle} from '../TextStyle';
import PropTypes from 'prop-types';

const DISABLED_OPACITY = 0.75;

export function GeneralButton(props) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={[
        styles.container,
        props.style,
        props.disabled && {opacity: DISABLED_OPACITY},
      ]}
      onPress={props.onPress}>
      <Text
        style={[styles.text, props.disabled && {opacity: DISABLED_OPACITY}]}>
        {props.title}
      </Text>
      <FontAwesome5Icon
        name={'chevron-right'}
        size={Measurements.unit * 0.65}
        style={props.disabled && {opacity: DISABLED_OPACITY}}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Measurements.width * 0.75,
    padding: 15,
    paddingHorizontal: 20,
    marginVertical: 8.5,

    borderRadius: Measurements.unit / 1.5,

    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  text: {
    ...TextStyle.buttonMedium,
    fontWeight: '500',
  },
});

GeneralButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};
GeneralButton.defaultProps = {
  onPress: () => {},
  title: 'Some title',
  style: {},
};
