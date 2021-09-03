import React from 'react';
import {Alert} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text, View} from 'react-native';
import {Campus} from '../../../assets/Campus';
import {auth} from '../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {LoadingCircle} from '../../../assets/LottieAnims/loading';
import {AuthUI} from '../components';

export class Verify extends React.Component {
  constructor() {
    super();
    this.emailVerificationInterval;
  }
  componentDidMount() {
    this.sendEmailVerification();

    this.emailVerificationInterval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          clearInterval(this.emailVerificationInterval);
          this.props.updateSignedIn(true, this.props.user, true);
        }
      }
    }, 2000);
  }
  componentWillUnmount() {
    clearInterval(this.emailVerificationInterval);
  }
  render() {
    return (
      <AuthUI.MainContainer style={{justifyContent: 'space-between'}}>
        <View>
          <AuthUI.ScreenTitle title={'Verify email'} />
          <Text
            style={[
              GlobalStyle.TextStyle.bodyRegular,
              {marginLeft: GlobalStyle.Measurements.width * 0.05},
            ]}>
            Just making sure you are student
          </Text>
          <LoadingCircle
            style={{alignSelf: 'center', marginVertical: 20, marginTop: 60}}
          />
          <Text
            style={[
              GlobalStyle.TextStyle.bodyRegular,
              {alignSelf: 'center', textAlign: 'center'},
            ]}>
            {'Waiting for email to be verified\nCheck your university email'}
          </Text>
          <TouchableOpacity
            onPress={this.sendEmailVerification}
            style={{marginTop: 5}}>
            <Text style={GlobalStyle.ButtonStyle.TextButton}>Send again</Text>
          </TouchableOpacity>
        </View>
        <AuthUI.FooterButtons
          keys={['signin']}
          updateTarget={this.props.updateTarget}
        />
      </AuthUI.MainContainer>
    );
  }
  sendEmailVerification = () => {
    auth.currentUser
      .sendEmailVerification()
      .then(() => {
        this.props.showPopup({
          active: true,
          level: 'email-verify',
          type: 'toast',
          text: 'Sent verification email to ' + this.props.user.email,
        });
      })
      .catch((err) => {
        console.warn(err);
        this.props.showPopup({
          active: true,
          level: 'error',
          type: 'toast',
          title: 'Could not send verification email',
          text: 'Please check your internet and try again',
        });
      });
  };
}
