import React from 'react';
import {View, Animated, PanResponder, Platform, Keyboard} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {styles} from './style';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../GlobalStyle';
import {Bar} from './component/Bar';
import PropTypes from 'prop-types';
import {Pressable} from 'react-native';
import {BackgroundBlur} from './BackgroundBlur';

const STATUS = {
  CLOSED: 0,
  OPEN: 1,
};

const MARGIN = {
  CLOSED: GlobalStyle.Measurements.height,
  OPEN: GlobalStyle.Measurements.height * 0.15,
};

export class SwipeUpViewFlexible extends React.Component {
  // Create pan responder through state
  constructor() {
    super();
    this._container = React.createRef();
    this.blur = React.createRef();

    this.state = {
      pan: new Animated.Value(MARGIN.CLOSED),
      margins: {
        closed: GlobalStyle.Measurements.height,
        open: GlobalStyle.Measurements.height / 2,
      },
      firstLayout: false,
    };

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return dx > 2 || dx < -2 || dy > 2 || dy < -2;
      },
      onPanResponderGrant: () => {
        this.state.pan.setOffset(0);
        // this.state.pan.setValue(MARGIN.CLOSED)
      },
      onPanResponderMove: (e, gesture) => {
        if (this.state.pan._value > this.state.margins.open || gesture.dy > 0) {
          // Prevent the user to drag it above the go back button
          this.state.pan.setValue(this.state.margins.open + gesture.dy);
        }
        if (gesture.dy < 0) {
          // Call function when pan is being dragged down
          this.props.onDragDown();
        } else if (gesture.dy > 0) {
          // Call function when pan is being dragged up
          this.props.onDragUp();
        }
      },
      onPanResponderRelease: (e, gesture) => {
        /**
         * Should the pan close or not?
         * If the dy is greate enough, yes close it
         */
        this.state.pan.flattenOffset();
        if (this.state.pan._value < this.state.margins.open + 100) {
          this.animateTo(STATUS.OPEN);
        } else {
          this.animateTo(STATUS.CLOSED);
        }
      },
    });
  }
  componentDidMount() {
    const extraHeight =
      this.props.isModal && Platform.OS == 'ios'
        ? GlobalStyle.Measurements.safeheight * 0.06
        : Platform.OS == 'android'
        ? GlobalStyle.Measurements.safeheight * 0.06
        : 0;
    this.setState({
      margins: {
        ...this.state.margins,
        open:
          GlobalStyle.Measurements.height -
          (this.props.height +
            extraHeight +
            GlobalStyle.Measurements.height * 0.105),
      },
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isActive === false && this.props.isActive === true)
      this.animateTo(STATUS.OPEN);
    else if (prevProps.isActive === true && this.props.isActive === false)
      this.animateTo(STATUS.CLOSED);
  }
  render() {
    // Pass panhandlers to Bar so you can use scroll view inside panhandler
    return (
      <React.Fragment>
        <Animatable.View
          style={[
            styles.container,
            {
              height:
                GlobalStyle.Measurements.height - this.state.margins.open + 5,
              marginTop: this.state.pan,
            },
            this.props.style,
          ]}
          {...(!this.props.showBar ? {...this._panResponder.panHandlers} : {})}
          ref={this._container}>
          {this.props.showBar ? (
            <Bar {...this._panResponder.panHandlers} />
          ) : null}
          <View
            scrollEnabled={this.props.canScroll}
            contentInset={{bottom: GlobalStyle.Measurements.height * 0.15}}
            showsVerticalScrollIndicator={false}>
            {this.props.children}
          </View>
        </Animatable.View>
        <BackgroundBlur
          isActive={this.state.showBackground}
          onClose={() => this.animateTo(STATUS.CLOSED)}
        />
      </React.Fragment>
    );
  }
  animateTo = (toStatus = 0) => {
    /**
     *  This function will animate the Animated View to closed or open position
     * */
    let newY = 0;
    if (toStatus === STATUS.CLOSED) {
      newY = this.state.margins.closed;
    } else if (toStatus === STATUS.OPEN) {
      newY = this.state.margins.open;
    } else {
      newY = this.state.margins.closed;
    }

    Animated.spring(this.state.pan, {
      toValue: newY,
      tension: 80,
      friction: 25,
      useNativeDriver: false,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
    }).start(() => {
      if (toStatus === 0) {
        this.props.onDragUp();
        this.props.onClose();
        Keyboard.dismiss();
        this.setState({showBackground: false});
      } else {
        this.props.onDragDown();
        this.setState({showBackground: true});
      }
    });
  };
}

/**
 * Specify default props and prop types
 */
SwipeUpViewFlexible.defaultProps = {
  isActive: false,
  children: null,
  canScroll: true,
  height: 450,
  isModal: false,
  showBar: true,
  onDragDown: () => {},
  onDragUp: () => {},
  onClose: () => {},
};
SwipeUpViewFlexible.propTypes = {
  isActive: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired,
  canScroll: PropTypes.bool,
  height: PropTypes.number.isRequired,
  isModal: PropTypes.bool,
  showBar: PropTypes.bool,
  onDragDown: PropTypes.func,
  onDragUp: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};
