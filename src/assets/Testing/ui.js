import React from 'react';
import {View, Text, Switch, StyleSheet} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import {ColorStyle} from '../GlobalStyle/ColorStyle';

export const UI = {
  TestSwitch: function (props) {
    const [isOn, setOn] = React.useState(false);
    function onSwitch(val) {
      setOn(val);
      typeof props.onValueChange == 'function' && props.onValueChange(val);
    }

    return (
      <View style={styles.switch.container}>
        <View style={styles.switch.textContainer}>
          <Text style={styles.switch.title}>Use test account</Text>
          <Text style={styles.switch.subTitle}>
            This will reset your account
          </Text>
        </View>
        <Switch value={isOn} onValueChange={onSwitch} />
      </View>
    );
  },
  Badge: function () {
    return (
      <View style={styles.badge.container}>
        <Text style={[GlobalStyle.TextStyle.bodySmall, {color: '#fff'}]}>
          Testing
        </Text>
      </View>
    );
  },
};

const styles = {
  switch: StyleSheet.create({
    container: {
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',

      marginVertical: GlobalStyle.Measurements.margin * 2,
      width: GlobalStyle.Measurements.width,
    },
    textContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    title: {
      ...GlobalStyle.TextStyle.bodyMedium,
    },
    subTitle: {
      ...GlobalStyle.TextStyle.bodySmall,
      color: GlobalStyle.Palettes.text.palette5,
    },
  }),
  badge: StyleSheet.create({
    container: {
      alignSelf: 'center',
      padding: 7.5,
      borderRadius: 100,
      backgroundColor: ColorStyle.candyRed,
    },
  }),
};
