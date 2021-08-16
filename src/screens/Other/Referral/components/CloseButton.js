import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function CloseButton(props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <Icon
        style={styles.icon}
        name={'chevron-down'}
        color={GlobalStyle.ColorStyle.referralColour}
        size={ICON_SIZE}
      />
    </TouchableOpacity>
  );
}
const ICON_SIZE = GlobalStyle.Measurements.unit * 1.2;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#fff',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,

    borderRadius: ICON_SIZE / 2.5,

    top: ICON_SIZE / 2,
    right: ICON_SIZE / 2,
    padding: 3,
  },
  icon: {},
});
