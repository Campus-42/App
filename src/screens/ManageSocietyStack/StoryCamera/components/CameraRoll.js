import React from 'react';
import {
  StyleSheet,
  View,
  NativeModules,
  Image,
  Pressable,
  Text,
} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {CAPTURE_SIZE} from './CaptureButton';
import {Campus} from '../../../../assets/Campus';
import {Alert} from 'react-native';

export class CameraRoll extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      photos: [],
    };
  }
  onPress = () => {
    console.log('Select from camera roll');
    Campus.Funcs.images
      .selectFromLibrary({})
      .then((res) => {
        if (!res.didCancel) this.props.onImageSelected(res);
      })
      .catch((err) => console.warn(err));
  };

  render() {
    return (
      <React.Fragment>
        <Pressable style={styles.container} onPress={this.onPress}>
          <Ionicon name={'images-outline'} size={SIZE} color={'#ffffff'} />
        </Pressable>
      </React.Fragment>
    );
  }
}

const SIZE = GlobalStyle.Measurements.width * 0.075;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',

    marginTop: GlobalStyle.Measurements.height * 0.95 - CAPTURE_SIZE + SIZE / 2,
    marginLeft: GlobalStyle.Measurements.width / 6 - SIZE / 2,

    alignSelf: 'flex-start',
  },
});
