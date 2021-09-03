import React from 'react';
import {View, StyleSheet, Text, Button, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import TouchableShrink from '../TouchableShrink/TouchableShrink';
import {SwipeUpViewSmall, SwipeUpViewFlexible} from '../SwipeUpView';

import ConfirmationAnimation from '../Images/confirmation-animation.json';
import ErrorAnimation from '../Images/error-animation.json';
import LoadingAnimation from '../Images/loading-animation.json';
import ConfettiCannon from 'react-native-confetti-cannon';
import {STAR_COLOR} from '../../screens/ProfileStack/ProfileInvitations/style';
import {triggerHaptic} from '../Haptic/hapticFeedback';

const ANIMATION_SIZE = GlobalStyle.Measurements.width * 0.2;

export const ConfirmationPanel = (props) => {
  /**
   *
   * A component to show a confirmation via <SwipeUpViewSmall />
   *
   * It supports three modes Loading, Success and Error.
   * Each mode shows different animated icons and texts
   *
   * Pass @props for the body as an array of information. The array can only consist of two rows at max to fit inside the view
   *
   * The button's onPress should in most cases be used as a navigation goBack()
   *
   */
  const [showTimeout, setShowTimeout] = React.useState(false);
  return (
    <React.Fragment>
      <SwipeUpViewFlexible
        isActive={props.isActive}
        canScroll={false}
        isModal={props.isModal}
        height={styles.container.height}
        onClose={props.onClose}>
        {props.isActive ? (
          <View style={styles.container}>
            {!props.askConfirmation ? (
              <React.Fragment>
                <View style={styles.topContainer}>
                  <View style={styles.animation}>
                    <LottieView
                      source={
                        props.loading
                          ? LoadingAnimation
                          : props.error || props.validationError
                          ? ErrorAnimation
                          : ConfirmationAnimation
                      }
                      style={
                        props.loading
                          ? styles.loading
                          : props.error || props.validationError
                          ? styles.error
                          : styles.success
                      }
                      autoPlay
                      autoSize
                      loop={props.loading}
                    />
                  </View>
                  <Text style={styles.heading}>
                    {props.loading
                      ? props.loadingText
                      : props.validationError
                      ? props.validationText
                      : props.error
                      ? props.errorText
                      : props.successText}
                  </Text>
                  {props.subTitle !== '' && (
                    <Text
                      style={[
                        props.invitation && props.playConfetti
                          ? styles.invitationText
                          : styles.text,
                        {textAlign: 'center'},
                      ]}>
                      {!props.error &&
                        (showTimeout && props.loading
                          ? 'Hmm, this is taking longer than usual 😕'
                          : props.invitation && props.playConfetti
                          ? `You have successfully claimed the invitation`
                          : props.subTitle)}
                    </Text>
                  )}
                </View>
                <TouchableShrink
                  disabled={props.loading}
                  onPress={() =>
                    props.onPress !== false
                      ? props.onPress()
                      : props.dontGoBack
                      ? props.onClose()
                      : props.navigation.goBack()
                  }
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
              </React.Fragment>
            ) : (
              <View>
                <View>
                  <Text style={styles.heading}>
                    {props.askConfirmationText}
                  </Text>
                  <Text style={[styles.text, {textAlign: 'center'}]}>
                    You need to sign up on the Student Union's website as well
                  </Text>
                </View>
                <View style={styles.confirmationButtonContainer}>
                  <GlobalStyle.UI.GreyBackgroundButton
                    onPress={() => props.onConfirmationPress(false)}
                    style={styles.confirmationButton}
                    title={'No'}
                    red
                  />
                  <GlobalStyle.UI.GreyBackgroundButton
                    onPress={() => props.onConfirmationPress(true)}
                    style={styles.confirmationButton}
                    title={'Yes'}
                  />
                </View>
              </View>
            )}
          </View>
        ) : (
          <React.Fragment />
        )}
      </SwipeUpViewFlexible>
      {props.playConfetti && (
        <ConfettiCannon
          count={200}
          origin={{
            x: -10,
            y: 0,
          }}
          autoStart
        />
      )}
    </React.Fragment>
  );
};

/**
 * Specify default props and prop types
 */
ConfirmationPanel.defaultProps = {
  onClose: () => {},
  onConfirmationPress: (status = Boolean) => {},
  onPress: false,
  isActive: false,
  loading: true,
  error: false,
  navigation: {goBack: () => {}},
  successText: 'The process was successful',
  errorText: 'The process could not be fulfilled',
  loadingText: 'The process is loading',
  colors: {},
  bodyTexts: [],
  subTitle: '',
  dontGoBack: false, // If true, don't navigate back
  playConfetti: false,
  invitation: false,
  validationError: false,
  validationText: 'Looks like there is something wrong with the input',
  isModal: false,
  askConfirmation: false, // Request yes or no
  askConfirmationText: '', // The text for said confirmation
  navigationTitle: false,
  onNavigationPress: false,
};
ConfirmationPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirmationPress: PropTypes.func,
  isActive: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  colors: PropTypes.object.isRequired,
  successText: PropTypes.string,
  errorText: PropTypes.string,
  loadingText: PropTypes.string,
  bodyTexts: PropTypes.array,
  subTitle: PropTypes.string,
  dontGoBack: PropTypes.bool,
  playConfetti: PropTypes.bool,
  invitation: PropTypes.any,
  validationError: PropTypes.bool,
  validationText: PropTypes.string,
  isModal: PropTypes.bool,
  askConfirmation: PropTypes.bool,
  askConfirmationText: PropTypes.string,
  navigationTitle: PropTypes.string,
  onNavigationPress: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: GlobalStyle.Measurements.width * 0.1,
    height: GlobalStyle.Measurements.height * 0.3,
  },
  topContainer: {
    height: GlobalStyle.Measurements.height * 0.15,
    width: GlobalStyle.Measurements.width * 0.8,
    justifyContent: 'space-between',
    marginBottom: GlobalStyle.Measurements.height * 0.04,
  },
  middleContainer: {
    height: GlobalStyle.Measurements.height * 0.19,
    maxWidth: GlobalStyle.Measurements.width * 0.8,
    marginBottom: GlobalStyle.Measurements.height * 0.04,
    paddingHorizontal: GlobalStyle.Measurements.width * 0.1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  animation: {
    width: ANIMATION_SIZE,
    height: ANIMATION_SIZE,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    width: ANIMATION_SIZE * 0.9,
    height: ANIMATION_SIZE * 0.9,
    alignSelf: 'center',
  },
  success: {
    width: ANIMATION_SIZE,
    height: ANIMATION_SIZE,
    alignSelf: 'center',
  },
  loading: {
    width: ANIMATION_SIZE * 1.2,
    height: ANIMATION_SIZE * 1.2,
    alignSelf: 'center',
  },
  heading: {
    ...GlobalStyle.TextStyle.headingMedium,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
    alignSelf: 'center',
    textAlign: 'center',
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    textAlign: 'left',
  },
  invitationText: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    textAlign: 'left',
    color: STAR_COLOR,

    // shadowColor: STAR_COLOR,
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.4,
    // shadowRadius: 2,
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
  confirmationButton: {
    width: GlobalStyle.Measurements.width * 0.3,
  },
  confirmationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    width: GlobalStyle.Measurements.width * 0.8,
    height: GlobalStyle.Measurements.height * 0.185,
  },
  confirmationButtonText: {
    ...GlobalStyle.TextStyle.buttonMedium,
    color: '#fff',
  },
});
