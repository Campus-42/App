import React from 'react';
import {Text} from 'react-native';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function AppCrashedLastTime(props) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <FontAwesome5Icon
          name={'exclamation'}
          size={ICON_SIZE}
          color={'#fff'}
        />
      </View>
      <View>
        <Text style={styles.title}>App crashed last time</Text>
        <Text style={styles.text}>
          We apologize for this and will look into why it happened
        </Text>
      </View>
    </View>
  );
}
const ICON_SIZE = GlobalStyle.Measurements.unit * 0.6;

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width * 0.9,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
    borderRadius: GlobalStyle.Measurements.unit,
    padding: GlobalStyle.Measurements.marginHalf,

    backgroundColor: '#fff',

    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,

    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  icon: {
    height: ICON_SIZE + 10,
    width: ICON_SIZE + 10,
    borderRadius: ICON_SIZE + 15,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#aaa',
    marginRight: 10,
  },
  title: {
    ...GlobalStyle.TextStyle.bodyMedium,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
    width:
      GlobalStyle.Measurements.width * 0.9 -
      GlobalStyle.Measurements.marginHalf * 2 -
      10 -
      ICON_SIZE -
      15,
  },
});
