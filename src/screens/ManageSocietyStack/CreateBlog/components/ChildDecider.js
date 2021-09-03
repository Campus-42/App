import React from 'react';
import {View, Alert, Text} from 'react-native';
import {styles} from '../style';
import {styles as manStyles} from '../../ManageSocietyFocus/style';
import PropTypes from 'prop-types';
import {triggerHaptic} from '../../../../assets/Haptic/hapticFeedback';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import ImagePicker from 'react-native-image-picker';
import {Funcs} from '../functions';
import {getTagColors} from '../../../../assets/Airtable/functions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {BlogHeading} from './Heading';
import {BlogText} from './Text';
import {BlogImage} from './Image';
import {CampusObject} from './CampusObject';
import {DeleteContentButton} from './DeleteContentButton';

export class ChildDecider extends React.Component {
  constructor() {
    super();
    this._ref = React.createRef();
    this.state = {
      event: null,
      error: false,
      tagColors: [],
    };
  }
  async componentDidMount() {
    if (this.props.item.type == 'Event') {
      Funcs.getEvent(this.props.campusKey, this.props.item.value)
        .then((event) => this.setState({event: event}))
        .catch((err) => {
          console.warn('Could not get specific event', err);
          this.setState({error: true});
        });
    }
  }
  render() {
    const type = this.props.item.type;
    return (
      <React.Fragment>
        <View
          style={[
            styles.childContainer,
            this.props.error && manStyles.errorView,
          ]}>
          {this.props.creating && <DeleteContentButton {...this.props} />}
          {this.props.creating && this.props.index > 0 && (
            <FontAwesome5Icon
              onLongPress={(e) => {
                triggerHaptic('impactHeavy');
                this.props.drag(e);
              }}
              name={'grip-lines'}
              color={GlobalStyle.Palettes.text.palette2}
              size={GlobalStyle.Measurements.unit / 1.5}
              style={{padding: 10}}
            />
          )}
          {type == 'Heading' ? (
            <BlogHeading {...this.props} />
          ) : type == 'Text' ? (
            <BlogText {...this.props} />
          ) : type == 'Image' ? (
            <BlogImage onPress={this.onPress} {...this.props} />
          ) : (
            <CampusObject {...this.props} />
          )}
          {this.props.error !== false && (
            <Text style={manStyles.errorText}>{this.props.error}</Text>
          )}
        </View>
      </React.Fragment>
    );
  }
  onPress = () => {
    if (this.props.creating) {
      if (this.props.item.type == 'Heading') {
      } else if (this.props.item.type == 'Text') {
      } else if (this.props.item.type == 'Image') this.selectImage();
    }
  };
  openEvent = () => {
    this.props.navigate('Event Focus', {id: this.state.event.id});
  };
  selectImage = () => {
    const imageOptions = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(imageOptions, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert(
          'Camera Unavailable',
          "We couldn't access your camera, please check your settings for the app",
          [
            {text: 'Settings', onPress: () => Linking.openSettings()},
            {text: 'Ok'},
          ],
        );
      } else {
        const source = response.uri;
        this.props.onValueChange(this.props.index, source);
      }
    });
  };
}

ChildDecider.defaulProps = {
  item: {type: '', value: ''},
  creating: false, // When user is creating a view will be showned enabling them to drag it
};

ChildDecider.propTypes = {
  item: PropTypes.object,
};
