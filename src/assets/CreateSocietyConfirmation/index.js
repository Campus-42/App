import React from 'react';
import {View, StyleSheet, Text, Button, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import ConfirmationAnimation from '../Images/confirmation-animation.json';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

import TouchableShrink from '../TouchableShrink/TouchableShrink';
import {SwipeUpViewSmall} from '../SwipeUpView';

export const CreateSocietyConfirmation = (props) => {
  return (
    <SwipeUpViewSmall
      isActive={props.isActive}
      canScroll={false}
      onClose={props.onClose}>
      {props.isActive ? (
        <View style={styles.container} >
          <LottieView
            source={ConfirmationAnimation}
            style={styles.animation}
            autoPlay
            autoSize
            loop={false}
          />
          <Text style={styles.heading}>You have created a society</Text>
          <Text
            style={[
              styles.text,
              {marginTop: -GlobalStyle.Measurements.margin},
            ]}>
            We have received your application and will make the society visible
            once it's confirmed
          </Text>
          <GlobalStyle.Line />
          <View style={{alignItems: 'flex-start'}}>
            <Text style={styles.text}>Society: {props.society.name}</Text>
            <Text style={styles.text}>
              President: {props.society.president}
            </Text>
          </View>

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
/**
 * Specify default props and prop types
 */
CreateSocietyConfirmation.defaultProps = {
  onClose: () => {},
  isActive: false,
  navigation: {goBack: () => {}},
  society: {},
  type: '',
  colors: {},
  societyName: '',
};
CreateSocietyConfirmation.propTypes = {
  onClose: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  society: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  colors: PropTypes.object.isRequired,
  societyName: PropTypes.string.isRequired,
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
