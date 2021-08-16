import React from 'react';
import {Platform} from 'react-native';
import {Pressable} from 'react-native';
import {Animated} from 'react-native';
import {View, Text} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import {CameraRoll} from './components/CameraRoll';
import {CaptureButton, MAX_VIDEO_DURATION} from './components/CaptureButton';
import {FlashButton} from './components/FlashButton';
import {FlipCamera} from './components/FlipCamera';
import {GraphicFocus} from './components/GraphicFocus';
import {Graphics} from './components/Graphics';
import {styles} from './style';

const AnimatedCamera = Animated.createAnimatedComponent(RNCamera);

const MAX_ZOOM = Platform.OS == 'ios' ? 8 : 1;
const MAX_NUMBER_GRAPHICS = 8;
const CAMERA_TYPES = ['back', 'front'];

export class StoryCamera extends React.Component {
  // TODO: https://github.com/Jobeso/react-native-story-share

  constructor() {
    super();
    this.camera = React.createRef();

    this.state = {
      cameraZoom: new Animated.Value(0),
      graphics: [], // The images or videos taken by the camera
      flash: 'auto',
      cameraType: 'back',
    };
  }
  render() {
    return (
      <AnimatedCamera
        ref={this.camera}
        flashMode={this.state.flash}
        defaultVideoQuality={RNCamera.Constants.VideoQuality['1080p']}
        style={styles.camera}
        captureAudio={false}
        zoom={this.state.cameraZoom}
        maxZoom={MAX_ZOOM}
        type={this.state.cameraType}
        useNativeZoom={true}>
        {({camera, status, recordAudioPermissionStatus}) => (
          <React.Fragment>
            <CaptureButton
              takePicture={() => this.takePicture(camera)}
              startRecording={() => this.startRecording(camera)}
              restartRecording={() => this.restartRecording(camera)}
              stopRecording={() => this.stopRecording(camera)}
            />
            <FlashButton onPress={this.toggleFlash} flash={this.state.flash} />
            {this.state.graphics.length > 0 && (
              <Graphics
                graphics={this.state.graphics}
                maxNumber={MAX_NUMBER_GRAPHICS}
                onGraphicPress={this.onGraphicPress}
                onGraphicDeleted={this.onGraphicDeleted}
              />
            )}
            <FlipCamera onPress={this.flipCamera} />
            <CameraRoll onImageSelected={this.onImageSelected} />
            {/* {this.state.focus && (
              <GraphicFocus
                focus={this.state.focus}
                onClose={() => this.setState({focus: false})}
              />
            )} */}
          </React.Fragment>
        )}
      </AnimatedCamera>
    );
  }
  flipCamera = () => {
    this.setState({
      cameraType: CAMERA_TYPES[1 - CAMERA_TYPES.indexOf(this.state.cameraType)],
    });
  };
  zoomCamera = (zoom = false) => {
    const cameraZoom = this.state.cameraZoom._value;
    var newValue = 0;

    if (zoom === false) {
      if (cameraZoom > 1) newValue = 1;
      else if (cameraZoom > 0 && cameraZoom <= 1) newValue = 0;
      else if (cameraZoom == 0) newValue = 1;
      else newValue = 1;
    } else if (typeof zoom == 'number') newValue = zoom;

    newValue = newValue / MAX_ZOOM;
    this.state.cameraZoom.setValue(newValue);
  };
  toggleFlash = (state = false) => {
    const {flash} = this.state;
    if (flash == 'auto') this.setState({flash: 'off'});
    else if (flash == 'on') this.setState({flash: 'off'});
    else if (flash == 'off') this.setState({flash: 'on'});
  };

  takePicture = async (camera) => {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);
    this.setState({
      graphics: this.state.graphics.concat({uri: data.uri, type: 'image'}),
    });
  };

  startRecording = async (camera) => {
    const options = {
      quality: RNCamera.Constants.VideoQuality['1080p'],
      orientation: 'portrait',
    };
    const data = await camera.recordAsync(options);
    this.setState({
      graphics: this.state.graphics.concat({uri: data.uri, type: 'video'}),
    });
  };
  restartRecording = (camera) => {
    console.log('Starting new recording');
    camera.stopRecording();
  };
  stopRecording = async (camera) => {
    console.log('Stopping recoding');
    camera.stopRecording();
  };
  onImageSelected = (response) => {
    const type = response.type.split('/')[0];
    this.setState({
      graphics: this.state.graphics.concat({uri: response.uri, type: type}),
    });
  };
  onGraphicPress = async (nativeEvent, graphic) => {
    // const {pageX, pageY} = nativeEvent;
    // console.log({...nativeEvent})
    // this.setState({focus: {pageX, pageY, graphic}});
  };
  onGraphicDeleted = (index) => {
    const {graphics} = this.state;
    this.setState({graphics: graphics.filter((e, i) => i !== index)});
  };
}
