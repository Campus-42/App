import React from 'react';
import {
  Text,
  TextInput,
  Alert,
  View,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {styles} from '../../ManageSocietyFocus/style';
import PropTypes from 'prop-types';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import Ionicon from 'react-native-vector-icons/Ionicons';

export const CustomTextInputWithSwitchOrIcon = (props) => {
  const _textInput = React.useRef(null);
  return (
    <TouchableOpacity
      onLayout={props.onLayout}
      activeOpacity={0.5}
      underlayColor={GlobalStyle.Palettes.background.palette6}
      style={[styles.textInputView, props.error !== false && styles.errorView]}
      onPress={() => _textInput.current.focus()}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View>
          <Text style={styles.textInputTitle}>{props.type}</Text>
          <TextInput
            ref={_textInput}
            onFocus={props.focus}
            defaultValue={props.defaultValue}
            multiline={props.multiline}
            autoCapitalize={props.keyboardType === 'url' ? 'none' : 'sentences'}
            keyboardType={props.keyboardType}
            style={styles.textInput}
            placeholder={props.placeHolder}
            onChangeText={props.onChangeText}
          />
        </View>
        {props.showIcon ? (
          <TouchableShrink onPress={props.onIconPress}>
            <Ionicon
              name={props.icon}
              color={props.iconColor}
              size={props.iconSize}
            />
          </TouchableShrink>
        ) : (
          <Switch value={props.isChecked} onValueChange={props.onValueChange} />
        )}
      </View>
      {props.error !== false && (
        <Text style={styles.errorText}>{props.error}</Text>
      )}
    </TouchableOpacity>
  );
};

/**
 * Specify default props and prop types
 */
CustomTextInputWithSwitchOrIcon.defaultProps = {
  type: '',
  keyboardType: 'default',
  onChangeText: () => {},
  placeHolder: 'Write here',
  onValueChange: () => {},
  isChecked: false,
  defaultValue: '',
  showIcon: false,
  icon: 'information-circle',
  iconSize: GlobalStyle.Measurements.unit,
  iconColor: GlobalStyle.Palettes.text.palette6,
  onIconPress: () => {},
  error: false,
};
CustomTextInputWithSwitchOrIcon.propTypes = {
  type: PropTypes.string,
  keyboardType: PropTypes.string,
  onChangeText: PropTypes.func,
  placeHolder: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  defaultValue: PropTypes.string,
  showIcon: PropTypes.bool,
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  onIconPress: PropTypes.func,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};
