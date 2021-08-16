import React from 'react';
import {View, TextInput, Text, Alert} from 'react-native';
import {auth, db} from '../../assets/Firebase/Firebase';
import {styles} from './style';
import {GlobalStyle} from '../../assets/GlobalStyle';
import {AuthButtons} from './AuthButtons';
import TouchableShrink from '../../assets/TouchableShrink/TouchableShrink';
import * as Animatable from 'react-native-animatable';
import {parseFirebaseError} from '../../assets/Firebase/errorHandling';

export class ResetPasswordComponent extends React.Component {
  constructor() {
    super();
    this._password = React.createRef();
    this._email = React.createRef();
    this.state = {
      email: '',
      error: '',
      buttonDisabled: false,
    };
  }
  render() {
    return (
      <Animatable.View
        style={styles.container}
        animation={'fadeInUpBig'}
        duration={600}>
        <Text style={styles.errorText}>{this.state.error}</Text>
        <TextInput
          ref={this._email}
          style={styles.textInput}
          placeholder={'E-mail'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCorrect={false}
          autoCapitalize={'none'}
          autoCompleteType={'email'}
          keyboardType={'email-address'}
          onChangeText={(text) => this.setState({email: text})}
          onSubmitEditing={this.sendResetEmail}
        />
        <TouchableShrink
          showGradient
          gradientColor={'#26b3f0'}
          loading={this.state.buttonDisabled}
          disabled={this.state.buttonDisabled}
          showIcon
          onPress={this.sendResetEmail}
          style={styles.largeButton}>
          <Text style={styles.largeButtonText}>Reset Password</Text>
        </TouchableShrink>
        <AuthButtons
          goToAuthMiddle={this.goToAuthMiddle}
          target1="Sign In"
          target2="Create Account"
        />
      </Animatable.View>
    );
  }
  sendResetEmail = () => {
    this.setState({buttonDisabled: true});

    auth
      .sendPasswordResetEmail(this.state.email)
      .then(() =>
        Alert.alert(
          'Password Reset',
          "We've sent you an e-mail with a pasword reset link",
        ),
      )
      .catch(async (err) => {
        if (err.toString().includes('network-request-failed'))
          this.props.setNetworkError(true);
        else {
          this.props.setNetworkError(false);
          this.setState({error:  parseFirebaseError(err)});
        }
        console.log('Could not send password reset email', err);
      })
      .finally(() => this.setState({buttonDisabled: false}));
  };
  goToAuthMiddle = (target = String) => {
    target = target.toLowerCase().replace(' ', '');
    this.props.goToAuthTop(target);
  };
}
