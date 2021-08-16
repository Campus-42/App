import React from 'react';
import {View, Text, Switch, TouchableOpacity} from 'react-native';
import {styles} from '../../ManageSocietyFocus/style';
import PropTypes from 'prop-types';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export const SwitchComponent = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.textInputView, props.error !== false && styles.errorView]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{maxWidth: styles.textInputView.width * 0.7}}>
          <Text style={styles.textInputTitle}>{props.text}</Text>
          <Text numberOfLines={2} style={styles.subText}>
            {props.subText}
          </Text>
        </View>
        <Switch value={props.value} onValueChange={props.onValueChange} />
      </View>
      {props.error !== false && (
        <Text style={styles.errorText}>{props.error}</Text>
      )}
    </TouchableOpacity>
  );
};

SwitchComponent.defaultProps = {
  error: false,
  text: '',
  subText: '',
  onValueChange: () => {},
  onPress: () => {},
  value: false,
};

SwitchComponent.propTypes = {
  error: PropTypes.bool,
  text: PropTypes.string,
  subText: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  onPress: PropTypes.func,
};
