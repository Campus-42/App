import React from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {styles} from '../style';

import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {DateFuncs} from '../../../../assets/Date';

export function Icons(props) {
  // props.event = {
  //   link: {show: false},
  //   email: {show: false},
  //   ...props.event,
  // };
  function addToCalendar() {
    // create the config based on event info
    const eventConfig = {
      title: props.event.title,
      startDate: props.event.date.start.toISOString(),
      endDate: props.event.date.end.toISOString(),
      location: props.event.location.name,
      notes: props.event.description,
      url: props.event.link.show ? props.event.link.url : '',
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((data) => console.log('Event added to calendar', data))
      .catch((err) => console.warn('Event not added to calendar', err));
  }
  function openWeb() {
    props.navigation.navigate('Web View', {url: props.event.link.url});
  }

  const date = props.event.date;
  const dateString = `${date.start
    .toString()
    .substring(0, 3)} ${date.start.getDate()} ${DateFuncs.getMonthName(
    date.start.getMonth(),
  )} ${date.start.getFullYear()}`;

  const timeString = DateFuncs.getTimeInterval(date.start, date.end);
  const numberParticipants = props.event.number_of_participants || 0;

  return (
    <View>
      <IconView
        icon={'users'}
        color="#e00bbd"
        text={`${numberParticipants} ${
          numberParticipants == 1 ? 'person is' : 'people are'
        } coming!`}
        text2={'Are you coming?'}
      />
      {props.event.location.show && (
        <IconView
          icon={'map'}
          color="#18d7de"
          text={props.event.location.address}
          text2={props.event.location.name}
        />
      )}
      <IconView
        onPress={addToCalendar}
        icon={'clock'}
        color="#F02626"
        text={dateString}
        text2={timeString}
      />

      <IconView
        icon={'coins'}
        color="#13e8c4"
        text={
          props.event.pricing.price == 0 || !props.event.pricing.price
            ? 'Free Entry'
            : `${props.event.pricing.currency} ${props.event.pricing.price}`
        }
        text2={'Limited spaces available'}
      />
      {props.event.link !== undefined && props.event.link.show && (
        <IconView
          icon={'globe'}
          color={'#0ae7ff'}
          text={'Open Website'}
          text2={props.event.link.url}
          onPress={openWeb}
        />
      )}
      {/* {props.event.email !== undefined && props.event.email.show && (
        <IconView
          color={'#7926F0'}
          icon={'at'}
          text={'Send e-mail'}
          text2={props.event.email.address}
          onPress={() => Linking.openURL('mailto:' + props.event.email.address)}
        />
      )} */}
    </View>
  );
}

const IconView = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress !== undefined ? props.onPress : () => {}}
      disabled={props.onPress === undefined}>
      <View style={styles.iconsContainer}>
        <View style={[styles.icon, {backgroundColor: `${props.color}35`}]}>
          <FontAwesome5
            name={props.icon}
            color={props.color}
            size={GlobalStyle.Measurements.unit * 0.8}
          />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text
            numberOfLines={1}
            style={[
              styles.iconText,
              props.onPress !== undefined && {
                color: GlobalStyle.ColorStyle.blueButtonText,
              },
            ]}>
            {props.text}
          </Text>
          <Text style={styles.iconText2}>{props.text2}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
