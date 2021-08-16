import React from 'react';
import {StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {triggerHaptic} from '../../../assets/Haptic/hapticFeedback';

export const EventHeader = (props) => {
  /**
   * @deprecated
   */
  return (
    <SafeAreaView style={{position: 'absolute'}}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => handlePress(props.navigation)}>
        <MaterialCommunityIcon
          name={'chevron-left'}
          size={GlobalStyle.Measurements.unit}
          color={'#000000'}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

function handlePress(navigation) {
  navigation.goBack();
}

const SIZE = GlobalStyle.Measurements.unit * 1.65;
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginLeft: 23,

    width: SIZE,
    height: SIZE,
    borderRadius: SIZE,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#ffffff',

    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: GlobalStyle.Measurements.unit,
    shadowOffset: {width: 0, height: 0},
  },
});
