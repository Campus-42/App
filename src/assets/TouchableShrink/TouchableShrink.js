import React from 'react';
import {
  TouchableWithoutFeedback,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {triggerHaptic} from '../Haptic/hapticFeedback';
import LinearGradient from 'react-native-linear-gradient';
import {LightenDarkenColor} from 'lighten-darken-color';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Color from 'color';

const AnimatableLinearGradient = Animatable.createAnimatableComponent(
  LinearGradient,
);

class TouchableShrink extends React.Component {
  constructor() {
    super();
    this._touchable = React.createRef();
    this.state = {
      gradientColors: ['#ffffff00', '#ffffff00'],
    };
  }
  async componentDidMount() {
    const {showGradient, gradientColor, gradientFactor} = this.props;
    if (showGradient) {
      const gradientColors = [
        Color(gradientColor).lighten(0.15).hsl().string(),
        gradientColor,
      ];
      this.setState({gradientColors});
    }
  }
  async componentDidUpdate(prevProps) {
    const {gradientColor, gradientFactor} = this.props;
    if (prevProps.gradientColor != gradientColor) {
      const gradientColors = [
        Color(gradientColor).lighten(0.15).hsl().string(),
        gradientColor,
      ];
      this.setState({gradientColors});
    }
  }
  render() {
    const style = [
      styles.container,
      {
        flexDirection: this.props.showIcon ? 'row' : 'column',
        elevation: this.props.showShadow ? this.props.shadowElevation : 0,
      },
      this.props.style,
    ];
    if (this.props.loading) style.justifyContent = 'space-between';

    return (
      <TouchableWithoutFeedback
        onPress={this._handlePress}
        disabled={this.props.disabled}>
        <View
          style={[
            styles.touchable,
            {
              shadowOpacity: this.props.showShadow
                ? this.props.shadowOpacity
                : 0,
              shadowColor:
                this.props.shadowColor || styles.touchable.shadowColor,

              opacity:
                this.props.disabled && !this.props.dontFadeDisabled ? 0.7 : 1,
            },
          ]}>
          <AnimatableLinearGradient
            useNativeDriver={Platform.OS == 'ios'}
            start={{x: 0, y: 0.3}}
            end={{x: 0.3, y: 0.6}}
            ref={this._touchable}
            style={style}
            colors={this.state.gradientColors}>
            {this.props.loading && !this.props.showIcon && (
              <View style={{width: 15}} />
            )}
            {this.props.children}
            {this.props.loading ? (
              <ActivityIndicator color="#fff" animating={this.props.loading} />
            ) : (
              this.props.showIcon && (
                <View
                  style={[
                    styles.icon,
                    {marginLeft: this.props.iconMarginLeft},
                    {backgroundColor: this.props.iconBackground},
                  ]}>
                  <FontAwesome5
                    size={this.props.iconSize}
                    color={this.props.iconColor}
                    name={this.props.icon}
                  />
                </View>
              )
            )}
          </AnimatableLinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  _handlePress = () => {
    //This function will start animation and then call passed this.props.onPress

    this.props.triggerHaptic && triggerHaptic(this.props.hapticScheme);

    setTimeout(() => {
      //Get the animation scheme
      const animationShcheme = {
        0: {scale: 1},
        0.35: {scale: this.props.shrinkFactor},
        1: {scale: 1},
      };

      // Start animation
      try {
        this._touchable.current.animate(
          animationShcheme,
          this.props.shrinkDuration,
        );
      } catch {}

      // Call passed function for onPress
      this.props.onPress();
    }, 50);
  };
}
/**
 * Specify default props and prop types
 */
TouchableShrink.defaultProps = {
  style: {},
  shrinkFactor: 0.9,
  shrinkDuration: 450,
  triggerHaptic: false,
  hapticScheme: 'impactMedium',
  showShadow: false,
  shadowColor: 'black',
  showGradient: false,
  shadowOpacity: 0.2,
  shadowElevation: 5,
  gradientColor: '#00000000',
  gradientFactor: 40,
  icon: 'chevron-right',
  iconBackground: '#00000015',
  iconColor: '#fff',
  showIcon: false,
  onPress: () => {},
  iconSize: Dimensions.get('screen').fontScale * 14,
  disabled: false,
  loading: false,
  dontFadeDisabled: false,
  iconMarginLeft: GlobalStyle.Measurements.marginHalf,
};
TouchableShrink.propTypes = {
  shrinkFactor: PropTypes.number,
  shrinkDuration: PropTypes.number,
  triggerHaptic: PropTypes.bool,
  hapticScheme: PropTypes.string,
  showShadow: PropTypes.bool,
  shadowColor: PropTypes.string,
  showGradient: PropTypes.bool,
  shadowOpacity: PropTypes.number,
  shadowElevation: PropTypes.number,
  gradientColor: PropTypes.string,
  gradientFactor: PropTypes.number,
  icon: PropTypes.string,
  iconBackground: PropTypes.string,
  iconColor: PropTypes.string,
  showIcon: PropTypes.bool,
  onPress: PropTypes.func,
  iconSize: PropTypes.number,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  dontFadeDisabled: PropTypes.bool,
  iconMarginLeft: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00000000',
    zIndex: 6,
  },
  icon: {
    backgroundColor: '#00000005',
    height: GlobalStyle.Measurements.unit * 1.2,
    width: GlobalStyle.Measurements.unit * 1.2,
    borderRadius: GlobalStyle.Measurements.unit * 0.6,

    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    shadowColor: 'black',
    shadowRadius: GlobalStyle.Measurements.unit / 4,
    shadowOffset: {width: 0, height: 3},
  },
});

export default TouchableShrink;
