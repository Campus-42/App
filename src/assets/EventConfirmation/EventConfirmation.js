import React from 'react';
import {View, StyleSheet, Text, Button, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import ConfirmationAnimation from '../Images/confirmation-animation.json';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import TouchableShrink from '../TouchableShrink/TouchableShrink';
import {SwipeUpViewSmall} from '../SwipeUpView';

export const EventConfirmation = (props) => {
  return (
    <SwipeUpViewSmall
      isActive={props.isActive}
      canScroll={false}
      onClose={props.onClose}>
      {props.isActive ? (
        <View style={styles.container}>
          <LottieView
            source={ConfirmationAnimation}
            style={styles.animation}
            autoPlay
            autoSize
            loop={false}
          />
          <Text style={styles.heading}>
            {props.type === 'joined'
              ? 'You have successfully joined'
              : 'You have successfully left the event'}
          </Text>
          <View style={styles.line} />
          <View style={{alignItems: 'flex-start'}}>
            <Text style={styles.text}>Event: {props.event.title}</Text>
            <Text style={styles.text}>
              Date:
              {`${props.event.date.hour_start}:${props.event.date.minutes_start} ${props.event.date.date_string}`}
            </Text>
            <Text style={styles.text}>
              Location: {props.event.location.name}
            </Text>
            <Text style={styles.text}>Host: {'SOCIETY NAME'}</Text>
            {props.event.pricing.show && (
              <Text style={styles.text}>
                Price:{' '}
                {`${props.event.pricing.currency}${props.event.pricing.price}`}
              </Text>
            )}
          </View>
          {props.type === 'joined' && (
            <Button
              onPress={() => addToCalendar(props.event)}
              title={'Add to calendar'}
            />
          )}

          <TouchableShrink
            onPress={() => props.navigation.goBack()}
            style={[GlobalStyle.ButtonStyle.Large, {alignSelf: 'auto'}]}
            showGradient
            gradientColor={props.colors.main}>
            <Text
              style={[
                GlobalStyle.TextStyle.textInputMedium,
                {
                  color: '#ffffff',
                  fontSize: Dimensions.get('screen').fontScale * 18,
                },
              ]}>
              Continue
            </Text>
          </TouchableShrink>
        </View>
      ) : (
        <React.Fragment />
      )}
    </SwipeUpViewSmall>
  );
};
function addToCalendar(event) {
  // get date related variables
  const {
    year,
    day,
    month_double_digit,
    hour_start,
    hour_end,
    minutes_start,
    minutes_end,
  } = event.date;
  //YYYY-MM-DDTHH:mm:ss.SSSZ
  const date = `${year}-${month_double_digit}-${day}`;

  // create the config based on event info
  const eventConfig = {
    title: event.title,
    startDate: `${date}T${hour_start}:${minutes_start}:00.000Z`,
    endDate: `${date}T${hour_end}:${minutes_end}:00.000Z`,
    location: event.location.name,
    notes: event.text,
    url: event.url,
  };
  AddCalendarEvent.presentEventCreatingDialog(eventConfig)
    .then((data) => console.log('Event added to calendar', data))
    .catch((err) => console.warn('Event not added to calendar', err));
}

/**
 * Specify default props and prop types
 */
EventConfirmation.defaultProps = {
  onClose: () => {},
  isActive: false,
  navigation: {goBack: () => {}, navigate: () => {}},
  event: {},
  type: '',
  colors: {},
};
EventConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  navigate: PropTypes.object.isRequired,
  event: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  colors: PropTypes.object.isRequired,
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: GlobalStyle.Measurements.width * 0.1,
    height: GlobalStyle.Measurements.height * 0.5,
  },
  animation: {
    width: GlobalStyle.Measurements.width * 0.2,
    height: GlobalStyle.Measurements.width * 0.2,
    alignSelf: 'center',
  },
  heading: {
    ...GlobalStyle.TextStyle.headingMedium,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    textAlign: 'left',
    marginVertical: GlobalStyle.Measurements.marginQuarter,
    marginHorizontal: GlobalStyle.Measurements.width * 0.1,
  },
  line: {
    borderTopWidth: 2,
    borderTopColor: '#e5e5e5',
    width: GlobalStyle.Measurements.width * 0.75,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  button: {
    width: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.height * 0.065,
    borderRadius: GlobalStyle.Measurements.height * 0.0325,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: GlobalStyle.Measurements.margin,
  },
});
