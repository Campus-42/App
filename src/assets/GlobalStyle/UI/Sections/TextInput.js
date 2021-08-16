import React from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  TextInput as RNTextInput,
} from 'react-native';
import {View} from 'react-native';
import {Palettes} from '../../ColorStyle';
import {Line} from '../../Line';
import {styles} from './style';

export function TextInput(props) {
  /**
   * @props { title, placeholder, last, icon, color, ...TextInputProps }
   */

  const textinput = React.useRef();
  const color = props.color || Palettes.text.palette6;

  return (
    <View style={{marginVertical: 3}}>
      <View style={props.error && styles.errorContainer}>
        <TouchableWithoutFeedback
          onPress={() => textinput.current.focus()}
          style={styles.childrenView}>
          <View style={styles.childrenSubView}>
            <Text style={[styles.childrenTitle, {color}]}>
              {props.title || 'TextInput'}
            </Text>
            <RNTextInput
              ref={textinput}
              style={[styles.childrenText, {marginVertical: 3}]}
              {...props}
            />
          </View>
        </TouchableWithoutFeedback>
        {props.error && <Text style={styles.errorText}>{props.error}</Text>}
      </View>
      {!props.last && <Line />}
    </View>
  );
}
