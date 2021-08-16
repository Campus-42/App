import React from 'react';
import {TouchableOpacity, Text, View, Platform, Linking} from 'react-native';
import {styles} from '../style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {GlobalStyle} from '../../GlobalStyle';

export function Footer(props) {
  return (
    <View style={styles.footer}>
      <IconButton
        icon={'left'}
        onPress={props.goBack}
        disabled={!props.canGoBack}
      />
      <IconButton
        icon={'chrome'}
        onPress={() => Linking.openURL(props.url)}
        iconSize={1}
      />
      <IconButton
        disabled={!props.canGoForward}
        icon={'right'}
        onPress={props.goForward}
      />
    </View>
  );
}
export function Header(props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={props.goBack}>
        <Text style={GlobalStyle.ButtonStyle.TextButton}>Close</Text>
      </TouchableOpacity>
      <IconButton
        icon={props.loading ? 'close' : 'reload1'}
        onPress={props.loading ? props.stopLoading : props.reload}
        iconSize={0.9}
      />
    </View>
  );
}
function IconButton(props = {iconSize: 1.2, disabled: false}) {
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={{padding: 10}}
      onPress={props.onPress}>
      <AntDesign
        name={props.icon}
        size={
          GlobalStyle.Measurements.unit *
          (props.iconSize !== undefined ? props.iconSize : 1)
        }
        color={
          props.disabled
            ? GlobalStyle.Palettes.background.palette4
            : GlobalStyle.ColorStyle.blueButtonText
        }
      />
    </TouchableOpacity>
  );
}
