import React from 'react';
import {StyleSheet, ActivityIndicator} from 'react-native';
import {View, Text} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import {Pressable} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {Campus} from '../../../assets/Campus';
import {Platform} from 'react-native';

const Blur = (props) => {
  if (Platform.OS === 'ios') return <BlurView {...props} />;
  else return <View {...props} />;
};

export class ImageFocus extends React.Component {
  constructor() {
    super();
    this.state = {
      uri: false,
      savingImage: false,
    };
  }
  componentDidMount() {
    const params = {uri: '', ...this.props.route.params};
    this.setState({uri: params.uri});
  }
  render() {
    return (
      <React.Fragment>
        <View style={styles.container}>
          <GlobalStyle.UI.Image
            source={{uri: this.state.uri || ''}}
            style={styles.backgroundImage}
            resizeMode={'cover'}
          />
          <BlurView style={styles.blur} blurType={'dark'}>
            {this.state.uri && (
              <GlobalStyle.UI.Image
                style={styles.image}
                resize
                resizeMode={'contain'}
                source={{uri: this.state.uri}}
              />
            )}
          </BlurView>
        </View>

        <Pressable
          onPress={this.props.navigation.goBack}
          style={styles.closingButtonWrapper}>
          <Blur style={styles.closingButton} blurType={'regular'}>
            <Icon name={'chevron-down'} color={'#fff'} size={ICON_SIZE} />
          </Blur>
        </Pressable>
        <Pressable onPress={this.saveImage} style={styles.imageSaveWrapper}>
          <Blur style={styles.imageSaveButton} blurType={'regular'}>
            {this.state.savingImage ? (
              <ActivityIndicator size={ICON_SIZE} color={'#fff'} />
            ) : (
              <Text style={styles.imageSaveText}>Save image</Text>
            )}
          </Blur>
        </Pressable>
      </React.Fragment>
    );
  }

  saveImage = async () => {
    this.setState({savingImage: true});
    const uri = this.state.uri;

    Campus.Funcs.other
      .saveImage(uri)
      .then(() => {
        // Show toast popup for success
        this.props.route.params.showPopup({
          active: true,
          type: 'toast',
          level: 'saved-image',
          image: uri,
        });
      })
      .catch((err) => {
        console.warn(err);
        this.props.route.params.showPopup({
          active: true,
          type: 'toast',
          level: 'error-save-image',
          image: uri,
        });
      })
      .finally(() => {
        this.setState({savingImage: false});
      });
  };
}
const ICON_SIZE = GlobalStyle.Measurements.unit * 1.2;

const styles = StyleSheet.create({
  container: {
    ...GlobalStyle.Props.focusBackgroundView.style,
    paddingBottom: GlobalStyle.Measurements.height * 0.2,
    backgroundColor: '#000000',
  },
  blur: {
    position: 'absolute',
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height,
    paddingBottom: GlobalStyle.Measurements.height * 0.1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    backgroundColor: '#000000',
    width: GlobalStyle.Measurements.width,
    resizeMode: 'center',
  },
  backgroundImage: {
    height: GlobalStyle.Measurements.height,
    width: GlobalStyle.Measurements.width,
  },
  closingButton: {
    alignItems: 'center',
    justifyContent: 'center',

    width: ICON_SIZE + 7.5,
    height: ICON_SIZE + 7.5,

    borderRadius: ICON_SIZE / 2,
  },
  closingButtonWrapper: {
    top: GlobalStyle.Measurements.margin,
    right: GlobalStyle.Measurements.margin,
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',

    backgroundColor: Platform.OS === 'android' && 'rgba(120, 120, 120, 0.5)',
    borderRadius: ICON_SIZE / 2,
  },

  imageSaveButton: {
    alignItems: 'center',
    paddingVertical: GlobalStyle.Measurements.margin * 0.75,
    paddingHorizontal: GlobalStyle.Measurements.margin,
    borderRadius: GlobalStyle.Measurements.unit,
  },
  imageSaveWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: GlobalStyle.Measurements.height * 0.05,

    backgroundColor: Platform.OS === 'android' && 'rgba(120, 120, 120, 0.5)',
    borderRadius: GlobalStyle.Measurements.unit,
  },
  imageSaveText: {
    ...GlobalStyle.TextStyle.buttonMedium,
    color: '#fff',
  },
});
