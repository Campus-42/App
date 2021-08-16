import React from 'react';
import {TextInput, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';

export function BlogText(props) {
  if (props.creating)
    return (
      <TextInput
        scrollEnabled={false}
        style={styles.contentText}
        defaultValue={props.item.value}
        placeholder={'Add text'}
        multiline
        onChangeText={(text) => props.onValueChange(props.index, text)}
      />
    );
  else
    return (
      <GlobalStyle.UI.Text
        style={styles.contentText}
        navigation={props.navigation}>
        {props.item.value}
      </GlobalStyle.UI.Text>
    );
}
