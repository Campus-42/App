import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {Props} from '../Props';
import {ModalTop} from '../../ModalTop';
import {View as AnimatableView} from 'react-native-animatable';

export function ModalScreen(props) {
  // constructor() {
  //   super();
  //   this.state = {
  //     screen: 3,
  //     init: false,
  //   };
  // }
  const [screen, setScreen] = React.useState(false);

  return (
    <View {...Props.focusBackgroundScrollView}>
      <AnimatableView
        animation={screen !== false && 'fadeInLeftBig'}
        {...Props.focusBackgroundScrollView}>
        <ModalTop {...props.screenOneHeaderProps} />
        {props.screenOne}
      </AnimatableView>

      {/* <AnimatableView
        animation={'fadeInRightBig'}
        {...Props.focusBackgroundScrollView}>
        <ModalTop {...props.screenTwoHeaderProps} />
        {props.screenTwo}
      </AnimatableView> */}
    </View>
  );
}

ModalScreen.defaultProps = {
  screenOne: <Text>Screen One</Text>,
  screenTwo: <Text>Screen Two</Text>,

  screenOneHeaderProps: {
    title: 'Screen One',
    subTitle: false,
    onPress: () => {},
    onLayout: () => {},
  },
  screenTwoHeaderProps: {
    title: 'Screen Two',
    subTitle: false,
    onPress: () => {},
    onLayout: () => {},
  },

  screenOneHeaderOnPress: () => {},
};

ModalScreen.propTypes = {
  screenOne: PropTypes.element,
  screenTwo: PropTypes.element,

  screenOneHeaderProps: PropTypes.object,
  screenTwoHeaderProps: PropTypes.object,

  isLoading: PropTypes.bool,
  onLayout: PropTypes.func,
};
