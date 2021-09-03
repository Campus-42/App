import React from 'react';
import {TextInput, View, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';

export function BlogHeading(props) {
  return (
    <View style={styles.contentHeadingContainer}>
      {props.creating ? (
        <TextInput
          style={styles.contentHeading}
          defaultValue={props.item.value}
          placeholder={props.item.start ? 'Add title' : 'Add heading'}
          onChangeText={(text) => props.onValueChange(props.index, text)}
        />
      ) : (
        <Text style={styles.contentHeading}>{props.item.value}</Text>
      )}
      <GlobalStyle.Line style={{width: GlobalStyle.Measurements.width * 0.8}} />
    </View>
  );
}
