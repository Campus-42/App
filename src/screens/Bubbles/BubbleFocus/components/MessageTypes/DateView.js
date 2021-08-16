import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';

export function DateView(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {new Date(props.date).toDateString().substring(0, 10)}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',

    borderRadius: 5,
    marginVertical: 5,
    padding: 5,

    backgroundColor: GlobalStyle.Palettes.background.palette4,
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: '#fff',
  },
});
