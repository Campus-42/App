import React from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import {styles} from '../../ManageSocietyFocus/style';
import PropTypes from 'prop-types';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function CustomTouchable(props) {
  return (
    <TouchableOpacity
      onLayout={props.onLayout}
      style={[styles.textInputView, props.error && styles.errorView]}
      onPress={props.onPress}>
      <Text style={styles.textInputTitle}>{props.text}</Text>
      {props.subText !== null && props.subText.length > 0 && (
        <Text style={styles.subText}>{props.subText}</Text>
      )}
      {props.required && <Text style={styles.requirementText}>Required</Text>}
      {props.error !== false && (
        <Text style={styles.errorText}>{props.error}</Text>
      )}
    </TouchableOpacity>
  );
}

CustomTouchable.defaultProps = {
  onLayout: () => {},
  onPress: () => {},
  error: false,
  subText: null,
  text: '',
  required: false,
};

CustomTouchable.propTypes = {
  onLayout: PropTypes.func,
  onPress: PropTypes.func.isRequired,
  error: PropTypes.bool,
  subText: PropTypes.string,
  text: PropTypes.string.isRequired,
  required: PropTypes.bool,
};
