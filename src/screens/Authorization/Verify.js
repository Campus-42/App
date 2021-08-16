import React from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {GlobalStyle} from '../../assets/GlobalStyle';
import {styles} from './style';
import {auth} from '../../assets/Firebase/Firebase';
import LottieView from 'lottie-react-native';
import Loading from '../../assets/Images/loading-animation.json';
import {getSignedInUserInfo} from '../../assets/Firebase/functions';

var interval;

export class VerifyComponent extends React.Component {
  componentDidMount() {
    //Send email verification to user
    auth.currentUser
      .sendEmailVerification()
      .then(() => {
        this.props.showPopup({
          level: 'email-verify',
          active: true,
          type: 'toast',
        });
      })
      .catch((err) => {
        console.warn("Couldn't send email verification to user", err);
        this.props.showPopup({
          level: 'error',
          title: "Couldn't send email verification",
          text: 'Please check your connection and try again to verify your email',
          active: true,
          type: 'toast',
        });
      });

    // Listen to auth and if it has been verified. update signed in
    interval = setInterval(() => {
      auth.currentUser
        .reload()
        .then(async () => {
          if (auth.currentUser.emailVerified) {
            // Show introduction if user is new
            if (this.props.isUserNew) this.props.updateSignInState('intro');
            // Else go to app
            else
              getSignedInUserInfo()
                .then((user) => {
                  this.props.updateSignedIn(true, user);
                  clearInterval(interval);
                })
                .catch((err) => {
                  if (err.toString().includes('network-request-failed'))
                    this.props.setNetworkError(true);
                  else {
                    this.props.setNetworkError(false);
                  }
                  throw err;
                });
          }
        })

        .catch((err) => console.warn('Could not reload auth', err));
    }, 1000);
  }
  componentWillUnmount() {
    //remove listening interval
    clearInterval(interval);
  }
  render() {
    return (
      <View style={styles.container}>
        <LottieView
          source={Loading}
          autoPlay
          autoSize
          loop
          style={styles.verifyContent}
        />
        <Text
          style={[
            GlobalStyle.TextStyle.bodyMedium,
            {
              alignSelf: 'center',
              textAlign: 'center',
              marginVertical: GlobalStyle.Measurements.margin,
            },
          ]}>
          Verification e-mail sent to {'\n'}
          {auth.currentUser.email}
          {'\n'}Checking if you have verified...
        </Text>
        <TouchableOpacity
          onPress={() => auth.currentUser.sendEmailVerification()}
          style={{
            paddin: 10,
            alignSelf: 'center',
          }}>
          <Text
            style={[
              GlobalStyle.TextStyle.buttonSmall,
              {color: GlobalStyle.ColorStyle.blueButtonText},
            ]}>
            Send email again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.goToSignIn}
          style={{
            paddin: 10,
            alignSelf: 'center',
          }}>
          <Text
            style={[
              GlobalStyle.TextStyle.buttonSmall,
              {
                color: GlobalStyle.ColorStyle.blueButtonText,
                marginTop: GlobalStyle.Measurements.margin,
              },
            ]}>
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  goToSignIn = () => {
    this.props.goToAuthTop('signin');
  };
}
