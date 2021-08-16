import React from 'react';
import {
  Animated,
  SafeAreaView,
  View,
  StyleSheet,
  PanResponder,
  Text,
  ScrollView,
} from 'react-native';
import {styles} from '../style';
import {GlobalStyle} from '../../../assets/GlobalStyle';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

//margin top
const SMALL_MARGIN = GlobalStyle.Measurements.height * 0.125;

export class InfoContainer extends React.Component {
  constructor() {
    super();
    this._view = React.createRef();
    this._scroll = React.createRef();
    this.state = {
      margin: 0,
      status: null, // Can be "up" or "down"
    };
  }

  render() {
    return (
      <AnimatedSafeAreaView
        ref={this._view}
        style={[
          styles.innerContainer,
          {
            marginTop: styles.innerContainer.marginTop - this.state.margin,
            height: styles.innerContainer.height + this.state.margin,
          },
        ]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInset={{bottom: styles.floatingButton.minHeight * 2}}
          ref={this._scroll}
          onScroll={this._onScroll}
          scrollEventThrottle={1}>
          {this.props.children}
        </ScrollView>
      </AnimatedSafeAreaView>
    );
  }
  _onScroll = (e) => {
    var offset_y = e.nativeEvent.contentOffset.y;

    if (
      offset_y > styles.innerContainer.marginTop - SMALL_MARGIN - 20 &&
      this.state.status !== 'up'
    ) {
      this.setState({
        status: 'up',
        margin: styles.innerContainer.marginTop - SMALL_MARGIN - 20,
      });
    } else if (this.state.status !== 'up' && offset_y > 0) {
      this.setState({margin: offset_y});
    } else if (
      offset_y < styles.innerContainer.marginTop &&
      this.state.status !== 'down'
    ) {
      this.setState({status: 'down'});
    } else if (this.state.status !== 'down' && offset_y < 0) {
      this.setState({margin: offset_y});
    }
  };
}
