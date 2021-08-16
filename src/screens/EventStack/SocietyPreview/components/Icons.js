import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {styles} from '../../EventFocus/style';

import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export function Icons(props) {
  return (
    <View
      style={{
        backgroundColor: GlobalStyle.Palettes.background.palette6,
        width: GlobalStyle.Measurements.width * 0.9,
        borderRadius: GlobalStyle.Measurements.unit,
        paddingVertical: GlobalStyle.Measurements.marginHalf,
      }}>
      <IconView
        icon={'users'}
        color="#e00bbd"
        text={`${props.society.members.length} member${
          props.society.members.length == 1 ? '' : 's'
        }`}
        text2={'Why not join today?'}
      />
      {props.society.pricing.show && (
        <IconView
          icon={'coins'}
          color="#13e8c4"
          text={'Membership Fee '}
          text2={
            props.society.pricing.value == 0
              ? 'Free'
              : props.society.pricing.value == undefined
              ? 'Could not get price'
              : `£${props.society.pricing.value}`
          }
        />
      )}
    </View>
  );
}

const IconView = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress !== undefined ? props.onPress : () => {}}
      disabled={props.onPress === undefined}>
      <View
        style={[
          styles.iconsContainer,
          {width: GlobalStyle.Measurements.width * 0.9},
        ]}>
        <View style={[styles.icon, {backgroundColor: `${props.color}30`}]}>
          <FontAwesome5
            name={props.icon}
            color={props.color}
            size={GlobalStyle.Measurements.unit * 0.8}
          />
        </View>
        <View style={{justifyContent: 'flex-end', alignItems: 'flex-start'}}>
          <Text style={styles.iconText}>{props.text}</Text>
          <Text style={styles.iconText2}>{props.text2}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
