import React from 'react';
import {View, Text} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {styles} from '../../ManageSocietyFocus/style';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';

export const NumberPicker = (props) => {
  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.heading}>{props.title}</Text>
      <Picker
        style={styles.picker}
        onValueChange={props.onValueChange}
        selectedValue={props.selectedValue}>
        <Picker.Item label={"Don't Repeat"} value={0} />
        <Picker.Item label={'1 day'} value={1} />
        <Picker.Item label={'2 days'} value={2} />
        <Picker.Item label={'3 days'} value={3} />
        <Picker.Item label={'4 days'} value={4} />
        <Picker.Item label={'5 days'} value={5} />
        <Picker.Item label={'6 days'} value={6} />
        <Picker.Item label={'7 days'} value={7} />
        <Picker.Item label={'8 days'} value={8} />
        <Picker.Item label={'9 days'} value={9} />
        <Picker.Item label={'10 days'} value={10} />
        <Picker.Item label={'11 days'} value={11} />
        <Picker.Item label={'12 days'} value={12} />
        <Picker.Item label={'13 days'} value={13} />
        <Picker.Item label={'2 Weeks'} value={14} />
        <Picker.Item label={'3 Weeks'} value={21} />
        <Picker.Item label={'4 Weeks'} value={28} />
        <Picker.Item label={'8 Weeks'} value={56} />
      </Picker>
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
