import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, Pressable} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function TopButtons(props) {
  return (
    <View style={styles.container}>
      <Element {...props} title={'Map'} icon={'map'} color={'#ce1127'} />
      <Element {...props} title={'Faq'} icon={'faq'} color={'#14faff'} />
    </View>
  );
}

function Element(props) {
  return (
    <Pressable style={styles.element}>
      <View style={[styles.iconWrapper, {backgroundColor: props.color}]}></View>
      <Text style={styles.title}>{props.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  element: {
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    padding: 4,
    borderRadius: 5,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    borderRadius: 3,
    padding: 15,
  },
  title: {
    ...GlobalStyle.TextStyle.bodyMedium,
    marginHorizontal: 10,
  },
});
