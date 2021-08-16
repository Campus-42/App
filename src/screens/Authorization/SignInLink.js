import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  TouchableHighlight,
  Text,
} from 'react-native';
import {auth, db} from '../../assets/Firebase/Firebase';
import {styles} from './style';
import {GlobalStyle} from '../../assets/GlobalStyle';
import {AuthButtons} from './AuthButtons';
import {LinearGradientButton} from '../../assets/GlobalStyle/ButtonStyle';

export class SignInLinkComponent extends React.Component {
  constructor() {
    super();
    this._password = React.createRef();
    this._email = React.createRef();
    this.state = {
      email: '',
      password: '',
      error: '',
    };
  }
  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <Text style={styles.errorText}>{this.state.error}</Text>
        <TextInput
          ref={this._email}
          style={styles.textInput}
          placeholder={'University E-mail'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCorrect={false}
          autoCapitalize={'none'}
          autoCompleteType={'email'}
          keyboardType={'email-address'}
          onChangeText={(text) => this.setState({email: text})}
        />
        <LinearGradientButton
          colors={['#0394fc', '#5cd1ff']}
          onPress={this.signIn}
          style={styles.largeButton}
          text="Sign in"
        />
        {/* <AuthButtons
          goToAuthMiddle={this.goToAuthMiddle}
          target1="Reset Password"
          target2="Create Account"
        /> */}
      </KeyboardAvoidingView>
    );
  }
  signIn = async () => {
    const actionCodeSettings = {
      url:
        'https://www.campuslife-861f0.firebaseapp.com/?email=' +
        this.state.email,
      iOS: {
        bundleId: 'campuslife.app',
      },
      android: {
        packageName: 'com.campuslife',
        installApp: true,
        minimumVersion: '12',
      },
      handleCodeInApp: true,
      dynamicLinkDomain: 'campuslife-861f0.firebaseapp.com',
    };

    auth
      .sendSignInLinkToEmail(this.state.email, actionCodeSettings)
      .then((response) => {
        window.localStorage.setItem('emailForSignIn', email);
        console.log('Successfully sent sign in email to user', response);
      })
      .catch((err) => {
       if (err.toString().includes('network-request-failed'))
          this.props.setNetworkError(true);
        else {
          this.props.setNetworkError(false);
          this.setState({error: err.message});
        }

        console.warn('Could not send sign in link to user', err);
      });
  };
  goToAuthMiddle = (target = String) => {
    target = target.toLowerCase().replace(' ', '');
    this.props.goToAuthTop(target);
  };
}
