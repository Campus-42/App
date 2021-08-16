import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export function DisabledView(props) {
  return (
    <View style={styles.container}>
      <FontAwesome5
        name={'exclamation-circle'}
        style={styles.icon}
        size={GlobalStyle.Measurements.unit}
        color={'#aaa'}
      />
      <View>
        <Text style={styles.title}>Bubble Disabled</Text>
        <Text style={styles.text}>{props.reason}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginBottom: 75,
    width: GlobalStyle.Measurements.width * 0.85,
    padding: 10,
    alignSelf: 'center',

    backgroundColor: '#fff',

    borderRadius: GlobalStyle.Measurements.unit / 2,
    borderColor: '#e5e5e5',
    borderWidth: 0.5,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.075,
    shadowRadius: 3,
    elevation: 4,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  icon: {
    marginRight: 10,
  },

  title: {
    ...GlobalStyle.TextStyle.bodyMedium,
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
});
