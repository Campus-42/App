import React from 'react';
import {AsyncStorage} from '../../../assets/AsyncStorage/functions';
import {auth} from '../../../assets/Firebase/Firebase';
import {
  getCampusInfo,
  getSignedInUserInfo,
  getUserInfoForUID,
} from '../../../assets/Firebase/functions';
import {AuthUI} from '../components';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {parseFirebaseError} from '../../../assets/Firebase/errorHandling';

export class Signin extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      signingIn: false, // When it is currently trying to sign in user
    };
  }
  render() {
    return (
      <AuthUI.MainContainer>
        <AuthUI.ScreenTitle title={'Sign in'} />
        <AuthUI.TextInput
          placeholder={'University email'}
          keyboardType={'email-address'}
          autoCompleteType={'email'}
          onChangeText={(text) => this.setState({email: text})}
        />
        <AuthUI.TextInput
          placeholder={'Password'}
          secureTextEntry={true}
          autoCompleteType={'password'}
          keyboardType={'default'}
          onChangeText={(text) => this.setState({password: text})}
        />
        {this.state.signInError && (
          <Animatable.Text
            animation={{
              0: {opacity: 0, scale: 0.75, height: 0},
              1: {
                opacity: 1,
                scale: 1,
                height: GlobalStyle.TextStyle.bodyRegular.fontSize + 10,
              },
            }}
            duration={450}
            style={[GlobalStyle.TextStyle.bodyRegular, {alignSelf: 'center'}]}>
            {this.state.signInError}
          </Animatable.Text>
        )}
        <AuthUI.PrimaryButton
          title={'Sign in'}
          onPress={this.signIn}
          loading={this.state.signingIn}
          disabled={this.state.signingIn}
          style={
            this.state.signingIn && {
              justifyContent: 'space-between',
            }
          }
        />
        <AuthUI.FooterButtons
          keys={['createaccount', 'resetpassword']}
          updateTarget={this.props.updateTarget}
        />
      </AuthUI.MainContainer>
    );
  }
  signIn = () => {
    this.setState({signingIn: true});
    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(async (res) => {
        auth.currentUser.reload();
        const user = await getSignedInUserInfo();
        const campus = await getCampusInfo(user.campus);
        await AsyncStorage.setSignIn(this.state.email, this.state.password);
        await AsyncStorage.setFullName(user.first_name, user.last_name);

        this.props.updateUser(user);

        if (!res.user.emailVerified && user.verification_method === 'email') {
          this.props.updateTarget('verify');
        } else {
          this.props.updateSignedIn(
            true,
            user,
            res.additionalUserInfo.isNewUser,
          );
        }
      })
      .catch((err) => {
        this.setState({
          signInError: parseFirebaseError(err),
        });
      })
      .finally(() => {
        setTimeout(() => this.setState({signingIn: false}), 750);
      });
  };
}
