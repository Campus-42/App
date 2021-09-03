import React from 'react';
import {View, Text, Switch} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {styles as pickerStyles} from './ReportReasonPicker';

export function SendAnonymouslySwitch(props) {
  return (
    <View
      style={{
        ...pickerStyles.button,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff00',
        marginBottom: 25
      }}>
      <Text style={pickerStyles.buttonText}>Send anonymously</Text>
      <Switch value={props.value} onValueChange={props.onValueChange} />
    </View>
  );
}
