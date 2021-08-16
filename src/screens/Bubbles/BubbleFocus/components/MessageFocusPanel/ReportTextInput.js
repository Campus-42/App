import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Dimensions} from 'react-native';
import {Platform} from 'react-native';
import {Pressable, Text} from 'react-native';
import {TextInput} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {styles as pickerStyles} from './ReportReasonPicker';

export function ReportTextInput(props) {
  const textinput = React.useRef();
  return (
    <View style={pickerStyles.buttonWrapper}>
      <Pressable
        onPress={() => textinput.current.focus()}
        style={[
          pickerStyles.button,
          Platform.OS === 'ios' && {paddingTop: 4},
          props.showRed && {borderColor: 'red'},
        ]}>
        <TextInput
          ref={textinput}
          defaultValue={props.defaultValue}
          multiline
          style={[
            pickerStyles.buttonText,
            {minHeight: Dimensions.get('screen').fontScale * 20 * 2},
          ]}
          placeholder={'Do you have any further comment?'}
          onChangeText={props.onChangeText}
        />
      </Pressable>
      <Text style={pickerStyles.buttonSubTitle}>Further comment</Text>
    </View>
  );
}
