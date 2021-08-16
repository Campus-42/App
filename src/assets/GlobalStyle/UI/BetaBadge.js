import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Measurements} from '../Measurements';
import {TextStyle} from '../TextStyle';

export function BetaBadge(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.text}>Beta</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6.5,
    paddingVertical: 5,
    backgroundColor: '#0f93ff',
    borderRadius: 50,
  },
  text: {
    ...TextStyle.bodySmall,
    color: '#fff',
  },
});
