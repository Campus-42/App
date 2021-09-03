import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import RNMapView, {Marker} from 'react-native-maps';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import {MapPin} from './MapPin';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import Geolib from 'geolib';
import {MapFeature} from '../../CampusMap/components/MapFeature';

export class MapView extends React.Component {
  /**
   * This class will render a webview that can be placed in the SwipeUpView
   */
  constructor() {
    super();
    this._map = React.createRef();
    this.state = {
      showDirections: false,
      inititalRegion: {latitude: 0, longitude: 0},
      userLocation: {latitude: 0, longitude: 0},
      userLocationAvailable: null,
    };
  }
  render() {
    return (
      <View>
        <RNMapView
          ref={this._map}
          loadingBackgroundColor={GlobalStyle.Palettes.background.palette5}
          style={styles.map}
          initialRegion={{
            latitude: this.props.location.latitude,
            longitude: this.props.location.longitude,
            latitudeDelta: 0.0025,
            longitudeDelta: 0.0025,
          }}
          showsUserLocation={this.state.userLocationAvailable}
          showsBuildings
          showsIndoors
          showsCompass
          loadingEnabled={true}>
          <MapFeature
            index={0}
            elem={{
              geometry: {
                coordinates: [
                  this.props.location.longitude,
                  this.props.location.latitude,
                ],
              },
            }}
            colors={this.props.colors}
            selected={true}
            selectFeature={() => {}}
            size={GlobalStyle.Measurements.unit * 1.5}
          />
        </RNMapView>
        <TouchableOpacity
          onPress={() => this.animateToUser(this.props.location)}
          style={styles.myLocation}>
          <MaterialIcon
            size={LOCATION_SIZE / 1.6}
            name={
              this.state.userLocationAvailable ||
              this.state.userLocationAvailable == null
                ? 'my-location'
                : 'location-disabled'
            }
            color="#404040"
          />
        </TouchableOpacity>
      </View>
    );
  }
  animateToUser = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        this.setState({userLocationAvailable: true});
        const lat =
          Math.abs(this.props.location.latitude - pos.coords.latitude) * 1.7;
        const lng =
          Math.abs(this.props.location.longitude - pos.coords.longitude) * 1.7;

        const latDelta = lat > 0.0025 ? lat : 0.0025;
        const lngDelta = lng > 0.0025 ? lng : 0.0025;
        const center = {
          latitude: (this.props.location.latitude + pos.coords.latitude) / 2,
          longitude: (this.props.location.longitude + pos.coords.longitude) / 2,
        };

        this._map.current.animateToRegion(
          {
            latitude: center.latitude,
            longitude: center.longitude,
            longitudeDelta: lngDelta,
            latitudeDelta: latDelta,
          },
          750,
        );
      },
      (err) => {
        console.warn("Could not get user's position", err);
        Geolocation.requestAuthorization();
        this.animateToUser();
      },
    );
  };
}

const LOCATION_SIZE = GlobalStyle.Measurements.unit * 1.65;
export const styles = StyleSheet.create({
  map: {
    // height:
    //   SwipeUpStyles.container.height - GlobalStyle.Measurements.height * 0.05,
    // width: GlobalStyle.Measurements.width,
    height: GlobalStyle.Measurements.height * 0.3,
    width: GlobalStyle.Measurements.width * 0.9,
    marginHorizontal: GlobalStyle.Measurements.width * 0.05,
    borderRadius: GlobalStyle.Measurements.unit,
  },
  myLocation: {
    position: 'absolute',
    width: LOCATION_SIZE,
    height: LOCATION_SIZE,
    backgroundColor: 'white',
    marginLeft: GlobalStyle.Measurements.width * 0.95 - LOCATION_SIZE * 1.2,
    marginTop: LOCATION_SIZE * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: LOCATION_SIZE / 4,

    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: LOCATION_SIZE / 4,
  },
});
