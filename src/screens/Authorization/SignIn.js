import React from 'react';
import {View, TextInput, Text} from 'react-native';
import {auth, db} from '../../assets/Firebase/Firebase';
import {styles} from './style';
import {GlobalStyle} from '../../assets/GlobalStyle';
import {AuthButtons} from './AuthButtons';
import TouchableShrink from '../../assets/TouchableShrink/TouchableShrink';
import {AsyncStorage} from '../../assets/AsyncStorage/functions';
import {parseFirebaseError} from '../../assets/Firebase/errorHandling';
import {
  getCampusInfo,
  getSignedInUserInfo,
} from '../../assets/Firebase/functions';
import * as Animatable from 'react-native-animatable';

export class SignInComponent extends React.Component {
  constructor() {
    super();
    this._password = React.createRef();
    this._email = React.createRef();
    this.state = {
      email: '',
      password: '',
      error: '',
      buttonDisabled: false,
    };
  }
  componentDidMount() {
    if (this.props.signInError !== false) {
      this.setState({error: this.props.signInError});
    }
    db.enableNetwork();
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
          onSubmitEditing={() => this._password.current.focus()}
        />
        <TextInput
          ref={this._password}
          style={styles.textInput}
          placeholder={'Password'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCorrect={false}
          autoCompleteType={'password'}
          onChangeText={(text) => this.setState({password: text})}
          onSubmitEditing={this.signIn}
          secureTextEntry
        />
        <TouchableShrink
          showGradient
          gradientColor={'#26b3f0'}
          loading={this.state.buttonDisabled}
          disabled={this.state.buttonDisabled}
          showIcon
          onPress={this.signIn}
          style={styles.largeButton}>
          <Text style={styles.largeButtonText}>Sign In</Text>
        </TouchableShrink>
        <AuthButtons
          goToAuthMiddle={this.goToAuthMiddle}
          target1="Reset Password"
          target2="Create Account"
        />
      </Animatable.View>
    );
  }
  signIn = async () => {
    this.setState({buttonDisabled: true});

    auth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        return auth.currentUser.reload();
      }) // Reload user data
      .then(async () => {
        return await db.enableNetwork();
      })
      .then(async () => {
        return getSignedInUserInfo();
      })
      .then((res) => {
        getCampusInfo(res.campus);
        console.log('User has signed in', res);
        this.props.updateSignedIn(true, res);
        AsyncStorage.setSignIn(this.state.email, this.state.password);
      })
      .catch(async (err) => {
        console.warn('User could not sign in', err);
        this.setState({error: parseFirebaseError(err)});
      })
      .finally(() => this.setState({buttonDisabled: false}));
  };
  goToAuthMiddle = (target = String) => {
    target = target.toLowerCase().replace(' ', '');
    this.props.goToAuthTop(target);
  };
}
