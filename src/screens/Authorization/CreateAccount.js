import React from 'react';
import {TextInput, Text} from 'react-native';
import {auth, db} from '../../assets/Firebase/Firebase';
import {styles} from './style';
import {GlobalStyle} from '../../assets/GlobalStyle';
import {AuthButtons} from './AuthButtons';
import TouchableShrink from '../../assets/TouchableShrink/TouchableShrink';
import {uploadEmailDomain} from '../../assets/Airtable/functions';
import {AsyncStorage} from '../../assets/AsyncStorage/functions';
import * as Animatable from 'react-native-animatable';
import {parseFirebaseError} from '../../assets/Firebase/errorHandling';
import {Campus} from '../../assets/Campus';
import {analytics} from '../../assets/Analytics';
import {Testing} from '../../assets/Testing';
import {Alert} from 'react-native';

export class CreateAccountComponent extends React.Component {
  constructor() {
    super();
    this._password1 = React.createRef();
    this._password2 = React.createRef();
    this._email = React.createRef();
    this._firstName = React.createRef();
    this._lastName = React.createRef();
    this.state = {
      email: '',
      password1: '',
      password2: '',
      firstName: '',
      lastName: '',
      error: '',
      buttonDisabled: false,

      testAccount: false,
    };
  }
  // TODO: Fix error message to not only show wrong campus
  render() {
    return (
      <Animatable.View
        style={styles.container}
        animation={'fadeInUpBig'}
        duration={600}>
        <Text style={styles.errorText}>{this.state.error}</Text>
        <TextInput
          ref={this._firstName}
          onFocus={(evt) => this.scrollToElement(evt, 'first_name')}
          style={styles.textInput}
          placeholder={'First name'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCapitalize={'words'}
          autoCorrect={false}
          autoCompleteType={'name'}
          onLayout={(evt) => this.onLayout(evt, 'first_name')}
          onChangeText={(text) => this.setState({firstName: text})}
          onSubmitEditing={() => this._lastName.current.focus()}
        />
        <TextInput
          ref={this._lastName}
          onFocus={(evt) => this.scrollToElement(evt, 'last_name')}
          style={styles.textInput}
          placeholder={'Last name'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCapitalize={'words'}
          autoCorrect={false}
          autoCompleteType={'name'}
          onLayout={(evt) => this.onLayout(evt, 'last_name')}
          onChangeText={(text) => this.setState({lastName: text})}
          onSubmitEditing={() => this._email.current.focus()}
        />
        <TextInput
          ref={this._email}
          onFocus={(evt) => this.scrollToElement(evt, 'email')}
          style={styles.textInput}
          placeholder={'University Email'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCorrect={false}
          autoCapitalize={'none'}
          autoCompleteType={'email'}
          keyboardType={'email-address'}
          onLayout={(evt) => this.onLayout(evt, 'email')}
          onChangeText={(text) => this.setState({email: text})}
          onSubmitEditing={() => this._password1.current.focus()}
        />
        <TextInput
          ref={this._password1}
          onFocus={(evt) => this.scrollToElement(evt, 'password1')}
          style={styles.textInput}
          placeholder={'Password'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCorrect={false}
          onLayout={(evt) => this.onLayout(evt, 'password1')}
          onChangeText={(text) => this.setState({password1: text})}
          onSubmitEditing={() => this._password2.current.focus()}
          secureTextEntry
        />
        <TextInput
          ref={this._password2}
          onFocus={(evt) => this.scrollToElement(evt, 'password2')}
          style={styles.textInput}
          placeholder={'Confirm Password'}
          placeholderTextColor={GlobalStyle.Palettes.text.palette2}
          autoCorrect={false}
          onLayout={(evt) => this.onLayout(evt, 'password2')}
          onChangeText={(text) => this.setState({password2: text})}
          onSubmitEditing={this.createAccount}
          secureTextEntry
        />
        <TouchableShrink
          showGradient
          gradientColor={'#26b3f0'}
          loading={this.state.buttonDisabled}
          disabled={this.state.buttonDisabled}
          showIcon
          onPress={this.createAccount}
          style={styles.largeButton}>
          <Text style={styles.largeButtonText}>Create Account</Text>
        </TouchableShrink>
        <AuthButtons
          goToAuthMiddle={this.goToAuthMiddle}
          target1="Sign In"
          target2="Reset Password"
        />
        {Testing.available && (
          <Testing.UI.TestSwitch
            onValueChange={(val) => this.setState({testAccount: val})}
          />
        )}
      </Animatable.View>
    );
  }
  onLayout = ({nativeEvent}, name) =>
    (this[`textinput_${name}`] = nativeEvent.layout.y);

  scrollToElement = ({nativeEvent}, name) =>
    this.props.scrollTo({y: this[`textinput_${name}`]});

  createAccount = async () => {
    this.setState({buttonDisabled: true});

    if (this.state.password1 == this.state.password2) {
      let valid = await isEmailDomainValid(this.state.email);
      console.log('Validity of email entered', valid);
      if (valid.status === true) {
        //We are creating a user and sending them to the verification component after to verufy their email

        if (this.state.testAccount)
          if (this.state.email.toLowerCase().split('@')[1] === 'campus42.co.uk')
            await Testing.Funcs.deletePreviousLinkedAccount(this.state.email);
          else {
            Alert.alert(
              'Test account',
              'You must enter a valid campus42 email to register a test account',
            );
            throw new Error('Could not create a test account');
          }

        auth
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password1,
          )
          .then(() => auth.currentUser.reload())

          .then(async () => {
            this.props.setUserIsNew();
            return AsyncStorage.setSignIn(
              this.state.email,
              this.state.password1,
            );
          })
          .then(async () => {
            return AsyncStorage.setFullName(
              this.state.firstName,
              this.state.lastName,
            );
          })
          .then(async () => {
            return createUserDocOnFirestore(
              this.state.email,
              this.state.firstName,
              this.state.lastName,
              valid.campus.key,
            );
          })
          .then(() => {
            Campus.Funcs.points.triggerPointEvent(
              'userCreated',
              valid.campus.key,
              () => {},
            );
            this.props.updateSignInState('verify');
          })
          .catch(async (err) => {
            if (err.toString().includes('network-request-failed'))
              this.props.setNetworkError(true);
            else {
              this.props.setNetworkError(false);
              this.setState({error: parseFirebaseError(err)});
            }
            analytics.error(err, 'CreateAccount', 'createAccount()');
          })
          .finally(() => this.setState({buttonDisabled: false}));
      } else {
        valid.status === false &&
          uploadEmailDomain(this.state.email.split('@')[1]); // This function uploads the email to Airtable (Database) which we can run analytics on later to see which campuses we should move to
        this.setState({
          error: "We don't support your campus yet",
          buttonDisabled: false,
        });
        console.warn('Error getting allowed campuses', valid.error);
      }
    } else {
      this.setState({error: "Passwords doesn't match", buttonDisabled: false});
    }
  };
  goToAuthMiddle = (target = String) => {
    target = target.toLowerCase().replace(' ', '');
    this.props.goToAuthTop(target);
  };
}

export async function isEmailDomainValid(email = String) {
  //THis function will get the valid emails from /general/campuses in Firebase. It will check if at least one equals the entered email domain
  const emailDomain = email.split('@')[1];

  return db
    .collection('general')
    .doc('allowed_campuses')
    .get()
    .then((doc) => {
      // Is email domain accepted
      const status = doc
        .data()
        .campuses.some((el) => el.email_domain === emailDomain);

      // The filter will return relevant campus, we will select the first element in the array that it returns
      let campus = {};
      if (status === true) {
        campus = doc.data().campuses.filter((campus) => {
          return campus.email_domain === emailDomain;
        })[0];
      }

      // Then we return if the email is valid, if else we don't
      return {
        status: status,
        campus: campus,
      };
    })
    .catch((err) => {
      console.warn('Could not get campuses from Firebase', err);
      return {status: false, error: err};
    });
}

async function createUserDocOnFirestore(email, firstName, lastName, campusKey) {
  /**
   * Create the doc on firestore that holds all info about the user
   */
  const data = {
    first_name: firstName,
    last_name: lastName,
    event_count: 0,
    image: null,
    email: email,
    read_blogs: [],
    level: 1,
    campus42_admin: false,
    su_admin: false, // If user is an admin at the Student's Union
    admin_societies: [], // Which societies the user is an admin in
    joined_societies: [], // Which societies the user has (will) joined
    permissions: ['all', 'student'],
    campus: campusKey, // Support multiple campuses in the future
    unclaimed_invitations: 0,
    points: 0,
    search_index: firstName
      .toLowerCase()
      .split(' ')
      .concat(
        lastName
          .toLowerCase()
          .split(' ')
          .concat(email.toLowerCase().split('@')[0]),
      ),
  };

  auth.currentUser.reload();
  return db
    .collection('users')
    .doc(auth.currentUser.uid)
    .set(data)
    .then(() => console.log("Successfully created user's doc on firestore"))
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.warn("Could not create user's doc on firestore", err);
      auth.currentUser.delete(); // Delete the account so the firebase doc is being created
      throw 'The account could not be created';
    });
}
