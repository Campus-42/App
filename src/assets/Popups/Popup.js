import React from 'react';
import {Animated, View} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import {Default, WelcomeTexts} from './defaultProps';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {POPUP_MIN_HEIGHT, POPUP_ICON_SIZE, styles, POPUP_MARGIN} from './style';
import LottieView from 'lottie-react-native';
import {BlurView} from '@react-native-community/blur';
import {Pressable} from 'react-native';
import {Text} from 'react-native';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export class Popup extends React.Component {
  constructor() {
    super();
    this.state = {
      margin: new Animated.Value(RESET_MARGIN),
      showBlur: false,
      opacity: new Animated.Value(0),
    };
  }

  animateIn = () => {
    this.setState({showBlur: true}, () =>
      Animated.parallel([
        Animated.spring(this.state.margin, {
          ...animationOptions,
          toValue: POPUP_MARGIN,
        }).start(),
        Animated.timing(this.state.opacity, {
          duration: 350,
          toValue: 0.5,
          useNativeDriver: true,
        }).start(),
      ]),
    );
  };
  animateOut = () => {
    Animated.parallel([
      Animated.spring(this.state.margin, {
        ...animationOptions,
        toValue: RESET_MARGIN,
      }).start(),
      Animated.timing(this.state.opacity, {
        duration: 350,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => this.setState({showBlur: false})),
    ]);
  };

  render() {
    const prefilled =
      this.props.type == 'popup' && Default.popup[this.props.level || 'info'];
    const lottie = this.props.lottie || prefilled.lottie || false;
    const iconSize =
      this.props.iconSize || prefilled.iconSize || POPUP_ICON_SIZE;
    const welcomeText =
      this.props.level == 'welcome'
        ? WelcomeTexts[this.props.screen] || false
        : false;
    const buttons =
      welcomeText.buttons || this.props.buttons || prefilled.buttons || [];

    return prefilled ? (
      <React.Fragment>
        <Animated.View
          style={[styles.popup.container, {marginTop: this.state.margin}]}>
          <Text style={styles.popup.title}>
            {welcomeText.title || this.props.title || prefilled.title}
          </Text>
          {prefilled.icon && (
            <View
              style={[
                styles.popup.icon,
                {
                  width: iconSize,
                  height: iconSize,
                },
              ]}>
              {lottie ? (
                <LottieView
                  source={lottie}
                  autoPlay
                  loop={this.props.loopLottie || prefilled.loopLottie || true}
                />
              ) : (
                <Icon
                  icon={this.props.icon || prefilled.icon}
                  color={this.props.iconColor || prefilled.iconColor}
                  size={iconSize}
                />
              )}
            </View>
          )}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text style={styles.popup.text}>
              {welcomeText.text || this.props.text || prefilled.text}
            </Text>
          </View>

          {buttons.map((e, i) => (
            <GlobalStyle.UI.Touchable
              key={`popup_button_${i}_${e.text.substring(0, 10)}`}
              onPress={
                e.learnmore && this.props.learnmore
                  ? () => {
                      this.props.navigate(
                        this.props.learnmore.screen,
                        this.props.learnmore.params,
                      );
                      this.animateOut();
                    }
                  : e.onPress || this.animateOut
              }
              style={[styles.popup.button, e.style]}>
              <Text style={[styles.popup.buttonText, e.textStyle]}>
                {e.text}
              </Text>
            </GlobalStyle.UI.Touchable>
          ))}
        </Animated.View>

        {this.state.showBlur && (
          <Pressable
            style={styles.popup.blurView}
            onPress={() =>
              this.props.level == 'critical' ? () => {} : this.animateOut()
            }>
            <AnimatedBlurView
              blurType={'extraDark'}
              style={[styles.popup.blurView, {opacity: this.state.opacity}]}
            />
          </Pressable>
        )}
      </React.Fragment>
    ) : null;
  }
}

// TODO: Background blur view
const RESET_MARGIN = GlobalStyle.Measurements.height + POPUP_MIN_HEIGHT + 50;

const animationOptions = {
  tension: 40,
  friction: 7,
  useNativeDriver: false,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};
