import React from 'react';
import {
  View,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {TextStyle} from './TextStyle';
import {Measurements} from './Measurements';
import {Palettes} from './ColorStyle';
import PropTypes from 'prop-types';
import SafeAreaInsets from 'react-native-static-safe-area-insets';
import {TextTickerAnimation} from '../TextTicker';
import {inAppBadgeEmitter} from '../EventEmitter';
import {UI} from './UI';
import {AsyncStorage} from '../AsyncStorage/functions';

const ICON_SIZE = Measurements.unit;
export const FONT_SIZE = Dimensions.get('screen').fontScale * 20;

export class Header extends React.Component {
  constructor() {
    super();
    this.inAppBadgeListener;
    this.header = React.createRef();

    this.state = {
      showBadge: false,
    };
  }

  componentDidMount() {
    inAppBadgeEmitter.on('in-app-badge-change', this.onInAppBadgeChange);
    AsyncStorage.updateBadgeCount();
  }
  componentWillUnmount() {
    inAppBadgeEmitter.removeListener(
      'in-app-badge-change',
      this.onInAppBadgeChange,
    );
  }

  setOffset = (offset, margin) => {
    /**
     * The offset is by how much the scroll is offset from its initial position
     * The margin is the margin by where it should start to animate in the header
     */
    const diff = FONT_SIZE - offset + margin;

    if (diff >= 0) {
      const opacity = 1 - (FONT_SIZE + margin - offset) / (FONT_SIZE + margin);
      this.header.current.transitionTo({
        opacity: opacity,
        marginTop: diff,
      });
    }
  };

  animateOffset = (destination = 'up' || 'down', newOpacity) => {
    /**
     * Simple animation to set new offset and opacity for title
     */
    this.header.current.transitionTo(
      {
        opacity: newOpacity,
        marginTop: destination == 'up' ? 0 : 100,
      },
      450,
    );
  };

  render() {
    return (
      <View style={styles.headerContainer} onLayout={this.props.onLayout}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            navigate(
              this.props.navigation,
              this.props.destinationType,
              this.props.target,
            );
            this.props.onLeftPress();
          }}>
          <View style={{padding: 5}}>
            <View
              style={[
                styles.iconLeft,
                {
                  backgroundColor: this.props.iconBackgroundColor,
                  shadowOpacity: this.props.showShadow && 0.2,
                },
              ]}>
              <Ionicon
                name={
                  this.props.destinationType === 'goBack'
                    ? 'arrow-back'
                    : this.props.destinationType === 'openDrawer'
                    ? 'menu'
                    : 'cross'
                }
                size={ICON_SIZE}
                color={Palettes.text.palette6}
              />
            </View>

            {this.state.showBadge && (
              <UI.InAppBadge
                size={'small'}
                style={{
                  marginBottom: -10,
                  marginLeft: ICON_SIZE,
                }}
                color={this.props.colors.dark}
              />
            )}
          </View>
        </TouchableOpacity>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.headerText}>
          {this.props.title}
        </Text>
        {this.props.onRightPress !== undefined ? (
          <TouchableOpacity onPress={this.props.onRightPress}>
            <View style={{padding: 5}}>
              <View
                style={[
                  styles.iconLeft,
                  styles.iconRight,
                  {
                    backgroundColor: this.props.iconBackgroundColor,
                    shadowOpacity: this.props.showShadow && 0.2,
                  },
                ]}>
                <Ionicon
                  name={this.props.rightIcon}
                  size={ICON_SIZE}
                  color={Palettes.text.palette6}
                />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: styles.iconLeft.width,
              marginRight: styles.iconLeft.marginLeft,
            }}
          />
        )}
      </View>
    );
  }
  onInAppBadgeChange = (data) => {
    const count = Object.entries(data)
      .map(([key, value]) => {
        if (this.props.badgeKey === 0) return 0;
        else if (this.props.badgeKey === key) return 0;
        else return value.length;
      })
      .reduce((a, b) => a + b, 0);

    this.setState({showBadge: count > 0});
  };
}

const navigate = (navigation, destinationType, target) => {
  switch (destinationType) {
    case 'goBack': {
      navigation.goBack();
      break;
    }
    case 'openDrawer': {
      navigation.openDrawer();
      break;
    }
    case 'navigate': {
      navigation.navigate(target);
      break;
    }
  }
};
/**
 * Specify default props and prop types
 */
Header.defaultProps = {
  showShadow: false,
  iconBackgroundColor: Palettes.background.palette6,
  navigation: {goBack: ([]) => {}, navigation: ([]) => {}},
  destinationType: '',
  target: '',
  title: '',
  showNotification: false,
  animateHeader: false,
  onRightPress: undefined,
  onLeftPress: () => {},
  rightIcon: '',
  colors: {
    dark: '',
    main: '',
  },
  badgeKey: undefined,
  onLayout: () => {},
};
Header.propTypes = {
  showShadow: PropTypes.bool,
  iconBackgroundColor: PropTypes.string,
  navigation: PropTypes.object.isRequired,
  destinationType: PropTypes.string.isRequired,
  target: PropTypes.string,
  title: PropTypes.string,
  showNotification: PropTypes.bool,
  animateHeader: PropTypes.bool,
  onRightPress: PropTypes.func,
  onLeftPress: PropTypes.func,
  rightIcon: PropTypes.string,
  colors: PropTypes.object,
  badgeKey: PropTypes.string,
  onLayout: PropTypes.func,
};

export const styles = StyleSheet.create({
  headerText: {
    ...TextStyle.headingMedium,
    // fontFamily: 'OpenSans-Regular',
    fontSize: FONT_SIZE,
    marginHorizontal: Dimensions.get('screen').width * 0.05,
    maxWidth: Measurements.width * 0.5,
  },
  headerContainer: {
    marginTop: 2 + SafeAreaInsets.safeAreaInsetsTop,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: Measurements.marginHalf,
    height: Measurements.unit * 2 + FONT_SIZE / 2,
    width: Measurements.width,
    borderBottomColor: Palettes.background.palette4,
    // borderBottomWidth: 0.5,
  },
  iconLeft: {
    width: ICON_SIZE * 1.5,
    height: ICON_SIZE * 1.5,
    borderRadius: ICON_SIZE / 3,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: Palettes.inverseBackground.palette5,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: ICON_SIZE / 4,

    marginLeft: Measurements.margin,
  },
  iconRight: {
    marginLeft: 0,
    marginRight: Measurements.margin,
  },
  animateHeader: {
    opacity: 0,
    marginTop: FONT_SIZE,
  },
});
