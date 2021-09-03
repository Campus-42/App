import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {TextInput as RNTextInput} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import PropTypes from 'prop-types';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Platform} from 'react-native';

export function AuthTextInput(props) {
  const textinput = React.useRef();
  const [showSecure, setShowSecure] = React.useState(false);

  const width =
    styles.container.width -
    styles.container.paddingHorizontal * 2 -
    (props.secureTextEntry ? EYE_SIZE + 10 : 0);

  return (
    <Pressable
      style={[styles.container, props.style, props.error && styles.errorBorder]}
      hitSlop={5}
      onPress={() => textinput.current.focus()}>
      <RNTextInput
        {...props}
        ref={textinput}
        style={[styles.textinput, {width}]}
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        clearButtonMode={props.clearButtonMode}
        onSubmitEditing={props.onSubmitEditing}
        autoCorrect={props.autoCorrect}
        secureTextEntry={
          !showSecure && !props.showSecureText && props.secureTextEntry
        }
      />
      {props.secureTextEntry ? (
        <Pressable
          onPress={() => {
            const newValue = !showSecure;
            props.onSecureToggle(newValue);
            setShowSecure(newValue);
          }}>
          <Ionicon
            name={showSecure || props.showSecureText ? 'eye-off' : 'eye'}
            color={GlobalStyle.Palettes.text.palette2}
            size={EYE_SIZE}
          />
        </Pressable>
      ) : (
        <></>
      )}
    </Pressable>
  );
}
const EYE_SIZE = 20;
export const styles = StyleSheet.create({
  textinput: {
    ...GlobalStyle.TextStyle.textInputSmall,
    marginVertical: Platform.OS === 'ios' ? 15 : 2,
  },
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,

    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#eee',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,

    width: GlobalStyle.Measurements.width * 0.85,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    elevation: 3,

    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
});

AuthTextInput.defaultProps = {
  placeholder: '',
  autoCorrect: false,
  clearButtonMode: 'while-editing',
  onSecureToggle: () => {},
  onSubmitEditing: () => {},
  onChangeText: () => {},
};

AuthTextInput.propTypes = {
  autoCompleteType: PropTypes.string,
  placeholder: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  clearButtonMode: PropTypes.string,
  autoCorrect: PropTypes.bool,
  onSubmitEditing: PropTypes.func,
  onChangeText: PropTypes.func,
};
