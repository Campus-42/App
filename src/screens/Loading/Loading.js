import React from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {GlobalStyle} from '../../assets/GlobalStyle/index';
import {AuthorizationComponents} from '../Authorization/index';
import {
  trySignInUser,
  getSignedInUserInfo,
} from '../../assets/Firebase/functions';
import {auth, db} from '../../assets/Firebase/Firebase';
import * as Animatable from 'react-native-animatable';
import {AsyncStorage} from '../../assets/AsyncStorage/functions';
import {Introduction} from '../Authorization/Introduction';
import {KeyboardAvoidingView} from 'react-native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

const AnimScrollView = Animatable.createAnimatableComponent(ScrollView);

// TODO: What if internet cuts out? Don't ask for login

export class LoadingScreen extends React.Component {
  constructor() {
    super();
    this.scrollview = React.createRef();
    this.slowInterntTimeout;
    this.logo = React.createRef();
    this.state = {
      signInState: 'loading', //Pass state to AuthorizationComponents to view different views. It can be loading, signIn, createAccount or forgotPassword
      signInError: false, // The error when firebase can't sign in
      isUserNew: false,
      showSlowInternet: false,
      networkError: false,
    };
  }
  componentDidMount() {
    if (this.props.initSignIn) this.signInUser();
    else {
      this.animateLogoMargin('up');
      this.setState({signInState: 'signin', signInError: false});
      this.logo.current.stopAnimation();
    }
    this.slowInterntTimeout = setTimeout(() => {
      this.setState({showSlowInternet: true});
    }, 10000);
  }
  render() {
    return this.state.signInState !== 'intro' ? (
      <KeyboardAvoidingScrollView
        scrollEventThrottle={16}
        scrollEnabled={this.state.signInState !== 'loading'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={styles.scroll}>
        <Animatable.View ref={this.scrollview} style={{height: 220}} />
        <Animatable.Image
          ref={this.logo}
          animation={'pulse'}
          iterationCount={'infinite'}
          duration={1000}
          delay={500}
          source={require('../../assets/Images/logo_transparent.png')}
          style={styles.logo}
        />
        {this.state.showSlowInternet
          ? this.state.signInState === 'loading' && (
              <Text style={styles.slowInternetText}>
                {
                  'Hmm, seems like your internet is a bit slow 🧐\nPlease check your connection'
                }
              </Text>
            )
          : this.state.networkError && (
              <View style={styles.networkErrorView}>
                <Text style={styles.networkErrorText}>
                  Oh no, there's been a network error
                </Text>
              </View>
            )}
        <KeyboardAvoidingView>
          <AuthorizationComponents
            {...this.props}
            setNetworkError={(value = false) =>
              this.setState({networkError: value})
            }
            networkError={this.state.networkError}
            signInError={this.state.signInError}
            signInState={this.state.signInState}
            isUserNew={this.state.isUserNew}
            updateSignIn={this.props.updateSignedIn} // This function will update the state in <App /> and start the app
            updateSignInState={this.updateSignInState}
            goToAuthTop={this.goToAuthTop}
            scrollTo={this.scrollTo}
            setUserIsNew={(status = true) => {
              this.setState({isUserNew: status});
            }}
          />
        </KeyboardAvoidingView>
        <View style={{height: GlobalStyle.Measurements.height * 0.4}} />
      </KeyboardAvoidingScrollView>
    ) : (
      <Introduction {...this.props} updateSignIn={this.props.updateSignedIn} />
    );
  }
  scrollTo = ({x, y}) => {
    // TODO: Cannot use ScrollTo function, possible fix might be to not use animatabel and instead a native animation for paddingTop
  };

  signInUser = () => {
    trySignInUser()
      .then(async () => {
        try {
          auth.currentUser.reload();
          return await db.enableNetwork();
        } catch {}
      }) // Reload firebase auth to get correct information
      .then(async () => {
        return getSignedInUserInfo();
      })
      .then((user) => {
        // Since we rely on uni emails the email has to be verified.
        if (auth.currentUser.emailVerified) {
          this.props.updateSignedIn(true, user);
        } else {
          // If it's not a verification component will show
          console.log('Email is not verified');
          // this.animateLogoMargin('up');
          this.setState({signInState: 'verify', signInError: false});
          this.logo.current.stopAnimation();
        }
      })

      .catch((err) => {
        if (err.toString().includes('network-request-failed'))
          this.setState({networkError: true});
        console.warn('Error init sign-in', err);
        this.props.updateSignedIn(false);
        this.animateLogoMargin('up');
        this.setState({signInState: 'signin'});
        this.logo.current.stopAnimation();
      });
  };
  updateSignInState = (response) => {
    //This function changes the state to be handled by AuthorizationComponents. It will be passed as a function reference to <AuthorizationComponenents />
    console.log('Update sign in state to ' + response);
    this.setState({signInState: response, showSlowInternet: false});

    if (this.state.showSlowInternet) clearTimeout(this.slowInterntTimeout);
  };
  animateLogoMargin = (animation = 'up' || 'down' || 'top') => {
    console.log(
      'Animating logo ' + animation,
      'to margin',
      logoAnimations[animation],
    );
    try {
      this.scrollview.current.transitionTo({
        height: logoAnimations[animation],
      });
    } catch (err) {}
  };
  onSwipeDown() {
    //This function will dismiss the keyboard if the user swipes down on the screen
    Keyboard.dismiss();
  }
  goToAuthTop = (target) => {
    // This function will be passed down in two stages to the AuthButtons. it will change the state and thus change which authorization view appears
    this.setState({signInState: target});
  };
  isUserSignedIn(response = Boolean) {
    this.props.isUserSignedin(response);
  }
}
const styles = StyleSheet.create({
  scroll: {
    height: GlobalStyle.Measurements.height,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  slowInternetText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    marginTop: GlobalStyle.Measurements.height * 0.2,
    textAlign: 'center',
    alignSelf: 'center',
  },
  networkErrorText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    fontWeight: 'bold',
    color: '#fff',
  },
  networkErrorView: {
    backgroundColor: 'red',
    padding: 5,
    marginTop: GlobalStyle.Measurements.height * 0.05,
    borderRadius: 5,
  },
});
const paddingTopWhenNotLoading = GlobalStyle.Measurements.height * 0.15; // The margin the logo will have when user is signing in, reseting password or creating an account

const logoAnimations = {
  up: paddingTopWhenNotLoading,
  down: styles.scroll.paddingTop,
};
