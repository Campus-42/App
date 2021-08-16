import React from 'react';
import {View, Text, TextInput as RNTextInput, Keyboard} from 'react-native';
import {styles, HEIGHT} from '../style';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {Pressable} from 'react-native';
import {CacheFuncs} from '../../../../assets/Cache';

const AnimTouchable = Animatable.createAnimatableComponent(Pressable);

export class TextInput extends React.Component {
  constructor() {
    super();
    this.textinput = React.createRef();
    this.state = {
      text: false,
      textinputIsFocused: false,
    };
  }
  send = () => {
    this.props.send(this.state.text);
    this.textinput.current.clear();
    this.setState({text: ''});
  };
  cacheText = () => {
    this.setState({textinputIsFocused: false});
  };
  componentDidUpdate(prevProps) {
    /** Get the cached textinput when the textinput receives the proper bubble id */
    if (
      this.props.converastion !== 'empty' &&
      prevProps.converastion === 'empty'
    ) {
      CacheFuncs.getBubbleTextInput(this.props.converastion)
        .then((text) => this.setState({text: text || ''}))
        .catch(console.warn);
    }

    // When the user wants to show the message focus panel, hide the keyboard
    if (
      this.props.showMessageFocus === true &&
      prevProps.showMessageFocus === false
    )
      this.textinput.current.blur();
  }
  render() {
    return (
      <KeyboardAccessoryView
        androidAdjustResize
        alwaysVisible
        hideBorder
        style={{position: 'absolute', zIndex: 2, backgroundColor: '#00000000'}}>
        <Animatable.View
          style={styles.keyboardAccessoryShadow}
          animation={'fadeInUpBig'}
          duration={550}
          delay={350}
          onLayout={this.props.onLayout}
          useNativeDriver>
          <View
            style={[
              styles.keyboardAccessoryContainer,
              this.state.textinputIsFocused && {
                paddingBottom: GlobalStyle.Measurements.height * 0.055,
              },
            ]}>
            <GlobalStyle.UI.Touchable
              onTouchStart={Keyboard.dismiss}
              onPress={this.props.showEventSearch}
              hitSlop={5}
              style={[
                styles.icon,
                {backgroundColor: `${this.props.colors.extraLight}80`},
              ]}>
              <FontAwesome5
                name={'plus'}
                size={HEIGHT / 2}
                color={this.props.colors.extraDark}
              />
            </GlobalStyle.UI.Touchable>
            <GlobalStyle.UI.Touchable
              onPress={this.props.selectImage}
              hitSlop={5}
              style={[
                styles.icon,
                {backgroundColor: `${this.props.colors.extraLight}80`},
              ]}>
              <FontAwesome5
                name={'image'}
                size={HEIGHT / 2}
                color={this.props.colors.extraDark}
              />
            </GlobalStyle.UI.Touchable>
            <GlobalStyle.UI.Touchable
              style={[
                styles.textinputContainer,
                {height: this.state.textinputHeight},
              ]}
              onPress={() => this.textinput.current.focus()}>
              <RNTextInput
                ref={this.textinput}
                style={styles.textinput}
                placeholder={'Message'}
                multiline
                onFocus={() => this.setState({textinputIsFocused: true})}
                onChangeText={(text) => this.setState({text})}
                defaultValue={this.state.text || ''}
                onEndEditing={this.cacheText}
              />
              {!!(this.state.text || '').replace(/\s/g, '').length && (
                <AnimTouchable
                  animation={animation}
                  duration={500}
                  onPress={this.send}
                  hitSlop={10}
                  style={[
                    styles.icon,
                    styles.sendIcon,
                    {backgroundColor: GlobalStyle.ColorStyle.blueButtonText},
                  ]}>
                  <FontAwesome5
                    name={'arrow-up'}
                    size={HEIGHT / 2.5}
                    color={'#fff'}
                  />
                </AnimTouchable>
              )}
            </GlobalStyle.UI.Touchable>
          </View>
          {this.props.sendSubText && this.state.textinputIsFocused && (
            <View
              animation={{
                0: {height: 0},
                1: {height: styles.textinputSubText.fontSize + 8},
              }}
              duration={350}>
              <Text
                useNativeDriver
                delay={350}
                duration={450}
                animation={'fadeIn'}
                style={styles.textinputSubText}>
                {this.props.sendSubText}
              </Text>
            </View>
          )}
        </Animatable.View>
      </KeyboardAccessoryView>
    );
  }
}

const animation = {
  0: {
    opacity: 0,
    scale: 0.5,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};
