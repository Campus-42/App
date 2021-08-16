import React from 'react';
import {Text, View, TextInput, TouchableOpacity} from 'react-native';
import {styles} from '../../ManageSocietyFocus/style';
import PropTypes from 'prop-types';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {MinLengthView} from './MinLengthView';

export const CustomTextInput = (props) => {
  const _textInput = React.useRef(null);

  return (
    <TouchableOpacity
      onLayout={props.onLayout}
      activeOpacity={0.5}
      underlayColor={GlobalStyle.Palettes.background.palette6}
      style={[styles.textInputView, props.error && styles.errorView]}
      onPress={() => _textInput.current.focus()}>
      <View>
        <Text style={styles.textInputTitle}>{props.type}</Text>
        <TextInput
          ref={_textInput}
          defaultValue={props.defaultValue}
          onFocus={props.focus}
          multiline={props.multiline}
          maxLength={props.maxLength}
          keyboardType={props.keyboardType}
          style={[
            styles.textInput,
            {
              minHeight:
                props.multiline && GlobalStyle.Measurements.height * 0.15,
              width:
                styles.textInputView.width - styles.textInputView.padding * 2,
            },
          ]}
          placeholder={props.placeHolder}
          onChangeText={props.onChangeText}
        />
        <MinLengthView minLength={props.minLength} text={props.defaultValue} />
        {props.error !== false && (
          <Text style={styles.errorText}>{props.error}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Specify default props and prop types
 */
CustomTextInput.defaultProps = {
  type: '',
  keyboardType: 'default',
  onChangeText: () => {},
  placeHolder: 'Write here',
  defaultValue: '',
  error: false,
  maxLength: null,
  minLength: null,
};
CustomTextInput.propTypes = {
  type: PropTypes.string,
  keyboardType: PropTypes.string,
  onChangeText: PropTypes.func,
  placeHolder: PropTypes.string,
  defaultValue: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
};
