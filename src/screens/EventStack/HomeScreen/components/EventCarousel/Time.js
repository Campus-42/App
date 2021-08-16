import React from 'react';
import {View, StyleSheet, Text, Dimensions, Appearance} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {DateFuncs} from '../../../../../assets/Date';
import {View as AnimView} from 'react-native-animatable';

export const Time = (props = {date: new Date(), animate: false}) => {
  const day = props.date.getDate();
  const month = DateFuncs.getMonthName(props.date.getMonth());
  return (
    <AnimView
      animation={props.animate && {0: {scale: 0}, 1: {scale: 1}}}
      duration={200}
      style={styles.container}>
      <Text style={[styles.text, styles.daytext]}>{day}</Text>
      <View
        style={[
          styles.monthContainer,
          {backgroundColor: (props.colors || {}).dark},
        ]}>
        <Text style={[styles.text, styles.monthText]}>{month}</Text>
      </View>
    </AnimView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: GlobalStyle.Measurements.height * 0.035,
    minWidth: GlobalStyle.Measurements.width * 0.065,
    borderRadius: GlobalStyle.Measurements.unit / 3,

    marginLeft: -10,
    marginTop: 2,

    padding: 4,

    elevation: 7.5,
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 2},
    shadowColor: 'black',
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    fontWeight: 'bold',
    // fontFamily: 'AvenirNext-Regular',
  },
  monthText: {
    fontSize: Dimensions.get('screen').fontScale * 12,
    color: 'white',
  },
  daytext: {
    color: GlobalStyle.Palettes.text.palette6,
  },
  monthContainer: {
    borderRadius: GlobalStyle.Measurements.unit / 4,
    paddingVertical: 1,
    paddingHorizontal: 3,
    backgroundColor: '#ff4d40',
  },
});
