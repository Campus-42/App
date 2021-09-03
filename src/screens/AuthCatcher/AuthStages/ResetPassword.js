import React from 'react';
import {} from 'react-native';
import {auth} from '../../../assets/Firebase/Firebase';
import {AuthUI} from '../components';

export class ResetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      sending: false,
      email: '',
    };
  }
  render() {
    return (
      <AuthUI.MainContainer>
        <AuthUI.ScreenTitle title={'Reset password'} />
        <AuthUI.TextInput
          placeholder={'University email'}
          keyboardType={'email-address'}
          autoCompleteType={'email'}
          onChangeText={(text) => this.setState({email: text})}
        />
        <AuthUI.PrimaryButton
          title={'Reset password'}
          onPress={this.sendVerification}
          loading={this.state.sending}
          style={
            this.state.sending && {
              justifyContent: 'space-between',
            }
          }
        />
        <AuthUI.FooterButtons
          keys={['createaccount', 'signin']}
          updateTarget={this.props.updateTarget}
        />
      </AuthUI.MainContainer>
    );
  }
  sendVerification = () => {
    this.setState({sending: true});
    setTimeout(
      () =>
        auth
          .sendPasswordResetEmail(this.state.email)
          .then(() => {
            this.props.showPopup({
              active: true,
              level: 'password-reset',
              type: 'toast',
              text: 'Sent password reset email to ' + this.state.email,
            });
          })
          .catch((err) => {
            this.props.showPopup({
              active: true,
              level: 'error',
              type: 'toast',
              title: 'Could not send password reset email',
              text:
                'Could not send password reset email to ' + this.state.email,
            });
          })
          .finally(() => this.setState({sending: false})),
      1000,
    );
  };
}
