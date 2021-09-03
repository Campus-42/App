import React from 'react';
import {
  View,
  Easing,
  Image,
  PanResponder,
  Pressable,
  Animated,
} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import {styles} from './style';
import {Default} from './defaultProps';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {UserImage} from '../../screens/ProfileStack/Profile/components/UserImage';
import {triggerHaptic} from '../Haptic/hapticFeedback';
import LinearGradient from 'react-native-linear-gradient';
import Color from 'color';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {Text} from 'react-native';

export class Toast extends React.Component {
  constructor() {
    super();
    this.timer = setTimeout(() => {}, 0);
    this.state = {
      margin: new Animated.Value(RESET_MARGIN),
      isUserTouching: false,
    };
  }
  componentDidUpdate(prevProps) {
    if (this.props.timestamp !== prevProps.timestamp) {
      console.log('Received new toast', this.props);
      clearTimeout(this.timer);
      this.animateIn();
      if (['points'].includes(this.props.level)) {
        triggerHaptic('notificationSuccess');
      }
    }
  }
  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (e, gesture) => {
      this.pauseTimer();
      this.setState({isUserTouching: true});

      const {dx, dy} = gesture;
      return dx > 2 || dx < -2 || dy > 2 || dy < -2;
    },
    onPanResponderGrant: () => this.state.margin.setOffset(0),
    onPanResponderMove: (e, gesture) => {
      if (this.state.margin._value < MAX_DRAG_DOWN || gesture.dy < 0)
        this.state.margin.setValue(SHOW_MARGIN + gesture.dy);
    },
    onPanResponderRelease: (e, gesture) => {
      this.setState({isUserTouching: false}, () => {
        if (this.state.margin._value > SHOW_MARGIN) {
          this.animateIn();
          this.startTimer();
        } else this.animateOut();
      });
    },
  });
  animateIn = () => {
    Animated.timing(this.state.margin, {
      ...animationOptions,
      toValue: SHOW_MARGIN,
    }).start(() => this.startTimer());
  };
  startTimer = () => {
    this.timer = setTimeout(this.animateOut, TIMER_DURATION);
  };
  pauseTimer = () => {
    clearTimeout(this.timer);
  };
  animateOut = (overrideUserTouch = false, animateInAfter = false) => {
    if (this.state.isUserTouching == false || overrideUserTouch)
      Animated.timing(this.state.margin, {
        ...animationOptions,
        toValue: RESET_MARGIN,
      }).start(() => {
        if (animateInAfter) this.animateIn();
      });
  };
  onPress = () => {
    this.animateOut(true);
    var press =
      this.props.onPress || Default.toast[this.props.level].onPress || false;
    if (press) press();
    this.setState({isUserTouching: false});
    this.pauseTimer();
  };

  render() {
    const prefilled =
      this.props.type == 'toast' && Default.toast[this.props.level];
    const isMessage = this.props.level == 'message';
    const userWasPassed = this.props.user ? true : false;

    return prefilled ? (
      <Animated.View
        style={[
          styles.toast.container,
          {
            marginTop:
              this.state.margin._value > MAX_DRAG_DOWN
                ? MAX_DRAG_DOWN
                : this.state.margin,
          },
        ]}
        {...this.panResponder.panHandlers}>
        <Pressable onPress={this.onPress} style={styles.toast.buttonContainer}>
          {isMessage && userWasPassed && (
            <UserImage
              style={USER_IMAGE_STYLE}
              user={this.props.user}
              colors={CAMPUS_DEFAULT_COLORS}
            />
          )}
          {this.props.image ? (
            <GlobalStyle.UI.Image
              source={this.props.image}
              style={styles.toast.imageLeft}
            />
          ) : prefilled.image ? (
            <Image source={prefilled.image} style={styles.toast.imageLeft} />
          ) : (
            prefilled.icon && (
              <LinearGradient
                colors={[
                  Color(this.props.iconColor || prefilled.iconColor)
                    .lighten(0.25)
                    .hsl()
                    .string(),
                  Color(this.props.iconColor || prefilled.iconColor)
                    .darken(0.1)
                    .hsl()
                    .string(),
                ]}
                start={{x: 0.2, y: 0}}
                end={{x: 0.7, y: 0.5}}
                style={styles.toast.iconBackground}>
                <FontAwesome5Icon
                  name={prefilled.icon}
                  size={styles.toast.iconSize}
                  color={'#fff'}
                />
              </LinearGradient>
            )
          )}
          <View
            style={[
              styles.toast.textContainer,
              isMessage &&
                userWasPassed && {
                  width:
                    styles.toast.textContainer.width -
                    USER_IMAGE_STYLE.width -
                    10,
                },
            ]}>
            <Text
              style={styles.toast.title}
              numberOfLines={1}
              ellipsizeMode={'tail'}>
              {this.props.title || prefilled.title}
            </Text>
            <Text
              style={styles.toast.text}
              numberOfLines={2}
              ellipsizeMode={'tail'}>
              {this.props.text || prefilled.text}
            </Text>
          </View>
          <FontAwesome5Icon
            name={this.props.icon || prefilled.icon}
            size={styles.toast.container.height * 0.5}
            color={this.props.iconColor || prefilled.iconColor}
          />
        </Pressable>
      </Animated.View>
    ) : null;
  }
}
const RESET_MARGIN = -styles.toast.container.height * 2;
const SHOW_MARGIN = StaticSafeAreaInsets.safeAreaInsetsTop;
const MAX_DRAG_DOWN = SHOW_MARGIN;
const TIMER_DURATION = 5000;
const USER_IMAGE_STYLE = {
  height: styles.toast.container.height * 0.75,
  width: styles.toast.container.height * 0.75,
  marginRight: 10,
};
const CAMPUS_DEFAULT_COLORS = {
  dark: '#22a1d8',
  extraDark: '#1e8fc0',
  extraLight: '#88d5f7',
  light: '#58c5f3',
  main: '#26b3f0',
};

const animationOptions = {
  duration: 450,
  delay: 0,
  useNativeDriver: false,
  easing: Easing.elastic(0.9),
};
