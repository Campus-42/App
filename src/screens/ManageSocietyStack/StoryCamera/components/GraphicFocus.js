import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Pressable} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import RNVideo from 'react-native-video';
import Ionicon from 'react-native-vector-icons/Ionicons';

export function GraphicFocus(props) {
  const {graphic} = props.focus;

  return (
    <Pressable style={styles.background} onPress={props.onClose}>
      <Animatable.View style={styles.container} animation={'fadeInUpBig'}>
        {graphic.type == 'image' ? (
          <GlobalStyle.UI.Image
            source={{uri: graphic.uri}}
            style={styles.image}
          />
        ) : (
          <RNVideo
            style={styles.image}
            source={{uri: graphic.uri}}
            muted={true}
            resizeMode={'cover'}
            repeat={true}
          />
        )}
        <View style={styles.buttonContainer}>
          <Pressable>
            <Ionicon
              name={'edit'}
              color={GlobalStyle.ColorStyle.blueButtonText}
              size={ICON_SIZE}
            />
          </Pressable>
        </View>
      </Animatable.View>
    </Pressable>
  );
}

const HEIGHT = GlobalStyle.Measurements.height * 0.55;
const WIDTH = GlobalStyle.Measurements.width * 0.7;
const PADDING = GlobalStyle.Measurements.marginHalf;
const ICON_SIZE = HEIGHT / 18;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    padding: PADDING,
    borderRadius: GlobalStyle.Measurements.unit,

    alignSelf: 'center',
    marginTop: (GlobalStyle.Measurements.height - HEIGHT) / 2 - 50,

    backgroundColor: '#fff',
  },
  background: {
    position: 'absolute',
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height,
  },

  image: {
    width: WIDTH - PADDING * 2,
    height: HEIGHT * (5 / 6),
    backgroundColor: GlobalStyle.Palettes.background.palette5,

    borderRadius: GlobalStyle.Measurements.unit / 1.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
