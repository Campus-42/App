import React from 'react';
import {ActivityIndicator} from 'react-native';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {Text} from 'react-native';
import {auth} from '../../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {LoadingCircle} from '../../../../assets/LottieAnims/loading';
import {SuccessAnimation} from '../../../../assets/LottieAnims/success';
import {ErrorAnimation} from '../../../../assets/LottieAnims/error';
import {TouchableOpacity} from 'react-native';
import {Campus} from '../../../../assets/Campus';
import {analytics} from '../../../../assets/Analytics';
import {Alert} from 'react-native';

export class Stage4 extends React.Component {
  constructor() {
    super();
    this.emailVerificationInterval;
    this.state = {
      createdAccount: undefined,
      createdAccountError: false,
      verifiedEmail: false,
      sentVerificationEmail: false,
      email: '',
    };
  }
  componentDidMount() {
    //confirmedReferralInvite
    var userData = this.props.user;

    // Pass the referral info so that it can be handled later
    userData.referral = {sender: this.props.referralSender, claimed: false};

    const studentId = userData.student_id;
    const domain = this.props.campus.email_domain;
    const email = `${studentId}@${domain}`;
    userData.email = email;
    analytics.breadcrumb('Creating account document');
    analytics.breadcrumb('Referral passed: ' + this.props.referralSender);

    Campus.Funcs.user
      .createAccount(
        userData,
        this.props.campus.key,
        this.props.verificationMethod,
      )
      .then(async ({user}) => {
        this.setState({email: user.email});
        this.props.updateUser(user);
        this.setState({createdAccount: true});
        if (this.props.verificationMethod === 'email') {
          this.sendVerificationEmail(user.email);
        } else {
          setTimeout(() => {
            this.props.updateSignedIn(true, this.props.user, true);
          }, 2000);
        }
      })
      .catch((err) => {
        this.setState({createdAccountError: err.toString()});
      });
  }

  render() {
    const verifyEmail = this.props.verificationMethod === 'email';
    return (
      <View>
        <View style={styles.animationContainer}>
          {this.state.createdAccountError ? (
            <ErrorAnimation />
          ) : verifyEmail && !this.state.verifiedEmail ? (
            <LoadingCircle />
          ) : this.state.createdAccount ? (
            <SuccessAnimation />
          ) : (
            <LoadingCircle />
          )}
          <Text style={styles.text}>
            {this.state.createdAccountError
              ? this.state.createdAccountError
              : verifyEmail && !this.state.verifiedEmail
              ? 'Waiting for email to be verified\nCheck your email and come back'
              : this.state.createdAccount
              ? 'Wohoo, the account has been created'
              : 'Creating account'}
          </Text>
          {verifyEmail &&
            !this.state.verifiedEmail &&
            !this.state.createdAccountError && (
              <TouchableOpacity onPress={this.sendVerificationEmail}>
                <Text style={GlobalStyle.ButtonStyle.TextButton}>
                  Send again
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    );
  }
  sendVerificationEmail = (email = false) => {
    auth.currentUser
      .sendEmailVerification()
      .then(() => {
        console.log('Sent verification email');
        this.setState({sentVerificationEmail: true});
        this.props.showPopup({
          active: true,
          level: 'email-verify',
          type: 'toast',
          text:
            'Sent verification email to ' + this.props.user.email ||
            this.state.email,
        });
      })
      .catch((err) => {
        console.warn('Could not send verification email', err);
        this.setState({
          createdAccountError: 'We could not send the verification email',
        });
      });

    this.emailVerificationInterval = setInterval(async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          this.setState({verifiedEmail: true});
          // Claim referral
          if (this.props.referralSender) await this.claimReferral();

          clearInterval(this.emailVerificationInterval);

          setTimeout(() => {
            this.props.updateSignedIn(true, this.props.user, true);
          }, 2000);
        }
      }
    }, 2000);
  };
}

const styles = StyleSheet.create({
  animationContainer: {
    alignSelf: 'center',
    alignItems: 'center',

    marginTop: GlobalStyle.Measurements.height * 0.1,
    height: GlobalStyle.Measurements.height * 0.25,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    marginTop: 10,
    width: GlobalStyle.Measurements.width * 0.7,
    alignSelf: 'center',
    textAlign: 'center',
  },
});
