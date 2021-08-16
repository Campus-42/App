import React from 'react';
import {ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native';
import {KeyboardAvoidingView} from 'react-native';
import {trySignInUser} from '../../assets/Firebase/functions';
import Logo42 from '../../assets/Images/logo_small_transparent.png';
import {AuthParent} from './AuthStages';
import {ANIMATION_LOGO_MARGINS, styles} from './style';
import * as Animatable from 'react-native-animatable';
import {StyleSheet} from 'react-native';
import {GlobalStyle} from '../../assets/GlobalStyle';
import {Text} from 'react-native';
import {View} from 'react-native';
import {analytics} from '../../assets/Analytics';
import {auth} from '../../assets/Firebase/Firebase';
import {Platform} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';

export class AuthCatcher extends React.Component {
  constructor() {
    super();
    this.logo = React.createRef();
    this.state = {
      target: false,
      scrollEnabled: false,
      user: {},
    };
  }
  componentDidMount() {
    setTimeout(
      () =>
        trySignInUser()
          .then((response) => {
            console.log('Sign in initial', response);
            console.log('Is verified', auth.currentUser.emailVerified);
            console.log("Verification method",  response.user.verification_method)

            if (response.couldSignIn && auth.currentUser !== null) {
              this.setState({user: response.user});
              if (
                response.user.verification_method === 'email' &&
                !auth.currentUser.emailVerified
              ) {
                this.updateTarget('verify');
                this.animateLogoVertically('up');
                this.setLoading(false);
              } else {
                this.props.updateSignedIn(true, response.user, false);
              }
            } else {
              this.animateLogoVertically('up');
              this.setLoading(false);
              this.updateTarget('initial');
            }
          })
          .catch((err) => {
            console.log('Sign in initial', err);
            this.animateLogoVertically('up');
            this.setLoading(false);
            this.updateTarget('initial');

            this.setState({
              internetConnectError: err
                .toString()
                .includes('network-request-failed'),
            });
          }),
      1500,
    );
  }
  render() {
    return (
      <KeyboardAvoidingView
        style={styles.authScroll}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}>
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingBottom: GlobalStyle.Measurements.height * 0.075,
          }}
          scrollEnabled={this.state.scrollEnabled}
          keyboardShouldPersistTaps={'handled'}>
          <Animatable.Image
            ref={this.logo}
            source={Logo42}
            style={styles.logo}
            animation={'pulse'}
            iterationCount={'infinite'}
            duration={PULSE_DURATION}
            iterationDelay={PULSE_ITERATION_DELAY}
          />
          {this.state.internetConnectError && (
            <Animatable.View
              style={styles.internetView}
              animation={'fadeIn'}
              duration={650}>
              <Text style={styles.internetText}>Bad internet connection</Text>
            </Animatable.View>
          )}
          {this.state.target && (
            <AuthParent
              updateSignedIn={this.props.updateSignedIn}
              target={this.state.target}
              animationDuration={LOGO_ANIMATION_DURATION}
              updateTarget={this.updateTarget}
              showPopup={this.props.showPopup}
              user={this.state.user}
              setScrollIsEnabled={(scrollEnabled) =>
                this.setState({scrollEnabled})
              }
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
  updateTarget = (target = 'initial') => {
    console.log('Update target =>', target);
    analytics.breadcrumb(
      'Changed authorization target to ' + target,
      'AuthCatcher',
    );
    this.setState({internetConnectError: false});
    this.setState({target});
  };
  setLoading = (loading = false) => {
    if (loading) this.logo.current.pulse();
    else this.logo.current.stopAnimation();
  };
  animateLogoVertically = (direction = 'down' || 'up') => {
    var marginTop = 0;
    var size = styles.logo.width;

    if (direction === 'down') marginTop = ANIMATION_LOGO_MARGINS.down;
    else size = styles.logo.width * 0.45;
    marginTop += StaticSafeAreaInsets.safeAreaInsetsTop;

    this.logo.current.transitionTo(
      {marginTop, height: size, width: size},
      LOGO_ANIMATION_DURATION,
    );
  };
}

const PULSE_DURATION = 850;
const PULSE_ITERATION_DELAY = 250;
const LOGO_ANIMATION_DURATION = 950;
