import React from 'react';
import {TouchableOpacity, Text, Keyboard} from 'react-native';
import {styles} from './style';
import {GlobalStyle} from '../GlobalStyle';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import {View} from 'react-native-animatable';

export function KeyboardButton() {
  const [keyboardShow, setKeyboardShow] = React.useState(false);

  const view = React.useRef();

  function handlePress() {
    view.current.transitionTo('fadeOutDown', 150);
    Keyboard.dismiss();
  }

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setKeyboardShow(true);
  };
  const _keyboardDidHide = () => {
    try {
      view.current.animate('fadeOutDown', 150);
    } catch {}
    setKeyboardShow(false);
  };

  return (
    <KeyboardAccessoryView hideBorder style={{position: 'absolute'}}>
      {keyboardShow && (
        <View
          animation="fadeInUp"
          duration={150}
          style={styles.container}
          ref={view}>
          <TouchableOpacity
            onPress={handlePress}
            style={{opacity: 1, marginTop: 0}}>
            <Text style={GlobalStyle.ButtonStyle.TextButton}>Hide</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAccessoryView>
  );
}

const animation = {
  opacity: 0,
};
