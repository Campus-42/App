import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {View, Image} from 'react-native-animatable';
import {GlobalStyle} from '../../../assets/GlobalStyle';

export function ReferralView(props) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../../assets/Images/celebration-confetti.gif')}
      />
      <Text style={styles.text}>
        Hurray! You were invited, join and get 40 extra points
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width * 0.85,

    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: GlobalStyle.Measurements.unit * 2,
    height: GlobalStyle.Measurements.unit * 2,
    marginRight: 10,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyMedium,
    width: GlobalStyle.ButtonStyle.Large.width * 0.7,
  },
});
