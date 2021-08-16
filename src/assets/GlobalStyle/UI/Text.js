import React from 'react';
import {Alert, Linking, TextPropTypes} from 'react-native';
import Autolink from 'react-native-autolink';

export function Text(
  props = {
    ...TextPropTypes,
    text: '',
    style: '',
    navigation: {navigate: () => {}},
  },
) {
  function handle(link) {
    if (
      link.match(
        /(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi,
      )
    )
      props.navigation.navigate('Web View', {url: link});
    else
      Linking.openURL(link.replace('%40', '@')).catch(() =>
        Alert.alert('Unrecognized link', 'Cannot open this link'),
      );
  }

  return (
    <Autolink
      {...props}
      selectable={props.selectable || false}
      onPress={handle}
      text={props.children || props.text}
      style={[{textAlign: 'justify'}, props.style]}
      linkStyle={[
        {textAlign: 'justify'},
        props.style,
        {color: props.linkColor || '#007bff'},
      ]}
    />
  );
}

Text.defaultProps = {
  navigation: {navigate: () => {}},
};
