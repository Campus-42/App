import React from 'react';
import Color from 'color';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function MenuButtons(props) {
  return (
    <View style={styles.container}>
      <Icon icon={'university'} text={'Map'} color={'#4deeea'} />
      <Icon icon={'university'} text={'FAQ'} color={'#74ee15'} />
      <Icon icon={'university'} text={'Channels'} color={'#f000ff'} />
      <Icon icon={'university'} color={'#001eff'} />
    </View>
  );
}

function Icon(props) {
  return (
    <TouchableOpacity style={styles.button}>
      <LinearGradient
        style={styles.gradient}
        colors={[
          Color(props.color).lighten(0.25).hsl().string(),
          Color(props.color).darken(0.1).hsl().string(),
        ]}>
        <FontAwesome5Icon name={props.icon} size={SIZE} color={'#fff'} />
      </LinearGradient>
      {/* <Text>{props.text}</Text> */}
    </TouchableOpacity>
  );
}
const SIZE = GlobalStyle.Measurements.unit * 0.75;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',

    width: GlobalStyle.Measurements.width * 0.7,
    marginTop: 10,
  },
  button: {},
  gradient: {
    height: SIZE + 20,
    width: SIZE + 20,
    borderRadius: SIZE * 2,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
