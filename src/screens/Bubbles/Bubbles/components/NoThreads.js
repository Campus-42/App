import React from 'react';
import {View, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {styles} from '../style';
import {EmptyBox} from '../../../../assets/EmptyAnimation';

export function NoThreads(props) {
  return (
    <View style={styles.noThreadContainer}>
      <EmptyBox
      showButton={true}
        errorText={"We can't find any bubbles"}
        buttonText={'Message someone'}
        onPress={props.createThread}
      />
    </View>
  );
}
