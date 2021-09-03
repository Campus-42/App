import React from 'react';
import {
  Text,
  ImageBackground,
  View,
  TouchableHighlight,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {triggerHaptic} from '../../../assets/Haptic/hapticFeedback';
import SwipeableView from 'rn-swipeable-panel';

export class OpenEvent extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SwipeableView
          onlyLarge
          closeOnTouchOutside
          isActive={this.props.isActive}
          onClose={this.props.onClose}>
          {this.props.isActive && (
            <View style={styles.container}>
              <ImageBackground
                source={{uri: this.props.event.landscape_image_uri}}
                style={styles.image}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.title}>{this.props.event.title}</Text>
                <InfoView
                  icon="md-people"
                  text={`${this.props.event.number_of_participants} people are coming!`}
                  color="red"
                />
                <InfoView
                  icon="md-time"
                  text={this.props.event.date.time_string}
                  color="green"
                />
                <InfoView
                  icon="ios-pin"
                  text={this.props.event.location.name}
                  color="lightblue"
                />
                <InfoView
                  icon="ios-calendar"
                  text={this.props.event.location.name}
                  color="lightblue"
                />
              </View>
            </View>
          )}
        </SwipeableView>
        {this.props.isActive && (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              onPress={this.openMaps}
              style={[
                styles.actionButton,
                styles.directionButton,
                {
                  backgroundColor: this.props.store.app.campus.colors.main,
                },
              ]}>
              <Text style={styles.actionButtonText}>Get directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.joinEvent}
              style={[
                styles.actionButton,
                styles.joinButton,
                {
                  backgroundColor: this.props.store.app.campus.colors.main,
                },
              ]}>
              <Text style={styles.actionButtonText}>Join Event</Text>
            </TouchableOpacity>
          </View>
        )}
      </React.Fragment>
    );
  }
  openMaps = () => {
    console.log('Opening maps?');
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${this.props.event.location.latitude},${this.props.event.location.longitude}`;
    const label = this.props.event.location.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Alert.alert('Location', 'Do you want to open the location in Maps?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Yes',
        onPress: () => Linking.openURL(url),
      },
    ]);
  };
  joinEvent = () => {
    //TODO: How to join event
    console.log('User wants to join event');
  };
}

const ICON_SIZE = GlobalStyle.Measurements.unit * 1.1;
const InfoView = (props) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.infoIcon}>
        <Ionicon
          name={props.icon}
          color={GlobalStyle.Palettes.text.palette1}
          size={ICON_SIZE}
        />
      </View>
      <Text style={styles.infoText}>{props.text}</Text>
      <Text style={styles.infoText}>{props.text2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height,
    paddingVertical: GlobalStyle.Measurements.marginHalf,
  },
  innerContainer: {
    backgroundColor: 'white',
    borderRadius: GlobalStyle.Measurements.unit,
    width: GlobalStyle.Measurements.width,
  },
  image: {
    width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height * 0.2,
    borderRadius: GlobalStyle.Measurements.unit,
    marginBottom: -GlobalStyle.Measurements.unit,
  },
  title: {
    ...GlobalStyle.TextStyle.headingMedium,
    textAlign: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  infoContainer: {
    width: GlobalStyle.Measurements.width,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  infoIcon: {
    marginHorizontal: GlobalStyle.Measurements.margin,
  },
  infoText: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette5,
    alignSelf: 'center',
  },
  infoText2: {
    ...GlobalStyle.TextStyle.bodyRegular,
    color: GlobalStyle.Palettes.text.palette3,
    alignSelf: 'center',
  },
  actionButtonsContainer: {
    position: 'absolute',
    marginTop: GlobalStyle.Measurements.height * 0.9,
    width: GlobalStyle.Measurements.width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
  actionButton: {
    paddingVertical: GlobalStyle.Measurements.marginHalf,
    paddingHorizontal: GlobalStyle.Measurements.margin,
    borderRadius: GlobalStyle.Measurements.height * 0.03,
    minHeight: GlobalStyle.Measurements.height * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionButton: {
    minWidth: GlobalStyle.Measurements.width * 0.35,
  },
  joinButton: {
    minWidth: GlobalStyle.Measurements.width * 0.5,
  },
  actionButtonText: {
    ...GlobalStyle.TextStyle.bodyLarge,
    color: '#fff',
  },
});
