import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import RNDatePicker from 'react-native-date-picker';
import {styles} from '../../ManageSocietyFocus/style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {DateFuncs} from '../../../../assets/Date';

const maxDate = DateFuncs.getFutureDateInMonths(6);
const today = DateFuncs.getToday();

export const DatePicker = (props) => {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.heading}>{props.title}</Text>
      <View
        style={[
          styles.largeSwipeUpContainer,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <RNDatePicker
          onDateChange={props.onDateChange}
          style={styles.picker}
          mode={'datetime'}
          minuteInterval={5}
          date={props.date}
          minimumDate={props.type === 'end' ? props.minimumDate : today}
          maximumDate={maxDate}
        />
      </View>
      <TouchableShrink
        style={[
          GlobalStyle.ButtonStyle.Large,
          {
            justifyContent: 'space-between',
            alignSelf: 'center',
            paddingHorizontal: GlobalStyle.Measurements.margin,
          },
        ]}
        showGradient
        gradientColor={props.colors.main}
        triggerHaptic
        showIcon
        icon="chevron-down"
        onPress={props.onSwipeUpViewClose}>
        <Text style={GlobalStyle.TextStyle.buttonLarge}>Continue</Text>
      </TouchableShrink>
    </View>
  );
};
