import React from 'react';
import {View, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../../ManageSocietyFocus/style';

export function MinLengthView(props) {
  return (
    props.minLength !== null &&
    props.text.trim().length < props.minLength && (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 3,
        }}>
        <Text style={styles.requirementText}>
          {props.text.trim().length} / {props.minLength} characters minimum
        </Text>
        <FontAwesome
          name={'circle'}
          color={
            props.text.trim().length >= props.minLength
              ? '#31d329'
              : GlobalStyle.ButtonStyle.DestructiveTextButton.color
          }
          size={styles.requirementText.fontSize}
          style={{marginLeft: 5}}
        />
      </View>
    )
  );
}

MinLengthView.defaultProps = {
  minLength: null,
  text: '',
};
