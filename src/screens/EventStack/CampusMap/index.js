import React from 'react';
import {View} from 'react-native';
import {GlobalStyle} from '../../../assets/GlobalStyle';
import RNMaps, {PROVIDER_DEFAULT, PROVIDER_GOOGLE} from 'react-native-maps';
import {CampusMapFuncs} from './functions';
import {MapFeature} from './components/MapFeature';
import {MapHeader} from './components/Header';
import {FeatureCarousel} from './components/FeatureCarousel';
import {Animated} from 'react-native';
import {Keyboard} from 'react-native';
import {Platform} from 'react-native';
import {FeatureFocus} from './components/FeatureItem';

export class CampusMap extends React.Component {
  constructor() {
    super();
    this.map = React.createRef();
    this.header = React.createRef();
    this.featureFocus = React.createRef();

    this.state = {
      mapFeatures: [],
      fetchError: false,
      selectedFeature: false,
      featureSize: new Animated.Value(0),
      region: {},
    };
  }
  componentDidMount() {
    setTimeout(
      () =>
        CampusMapFuncs.getCampusMapFeatures(this.props.store.app.campus.key)
          .then((mapFeatures) => this.setState({mapFeatures, fetchError: true}))
          .catch((err) => this.setState({fetchError: true})),
      450,
    );
  }
  render() {
    const initialRegion = {
      ...this.props.store.app.campus.campus_map_initial_coordinates,
      latitudeDelta: 0.006,
      longitudeDelta: 0.006,
    };
    const data = sortMapFeatures(this.state.mapFeatures);
    return (
      <View {...GlobalStyle.Props.focusBackgroundScrollView}>
        <RNMaps
          initialCamera={{
            pitch: 10,
            center: initialRegion,
            zoom: 17,
            altitude: 600,
            heading: 0,
          }}
          ref={this.map}
          style={{flex: 1}}
          showsCompass={false}
          showsMyLocationButton={false}
          initialRegion={initialRegion}
          showsPointsOfInterest={false}
          onPress={this.onMapInteraction}
          onPanDrag={this.onMapInteraction}
          mapPadding={{top: GlobalStyle.Measurements.height * -0.1}}
          loadingEnabled
          customMapStyle={[
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [
                {
                  visibility: 'off',
                },
              ],
            },
          ]}
          onRegionChangeComplete={(region) => this.setState({region})}
          onMarkerPress={this.selectFeature}>
          {Object.entries(data).map(this.renderMapFeature)}
        </RNMaps>
        <FeatureFocus
          ref={this.featureFocus}
          mapFeatures={this.state.mapFeatures}
          navigate={this.props.navigation.navigate}
        />
        <MapHeader
          ref={this.header}
          title={this.props.store.app.campus.name}
          goBack={this.props.navigation.goBack}
          mapFeatures={data}
          selectFeature={this.selectFeature}
        />
      </View>
    );
  }
  renderMapFeature = ([_, elem], index) => (
    <MapFeature
      elem={elem}
      index={index}
      colors={this.props.store.app.campus.colors}
      selectFeature={this.selectFeature}
      selected={this.state.selectedFeature == elem.id}
    />
  );
  onMapInteraction = () => {
    Keyboard.dismiss();
    this.header.current.clearQuery();
    if (this.state.selectedFeature) {
      this.setState({selectedFeature: false});
      this.featureFocus.current.focusFeature(false);
    }
  };
  selectFeature = ({nativeEvent}) => {
    this.map.current.animateCamera(
      CampusMapFuncs.getCameraForMarkerAnimation(nativeEvent),
      {
        duration: 750,
        useNativeDriver: true,
      },
    );
    this.featureFocus.current.focusFeature(nativeEvent.id);
    this.setState({selectedFeature: nativeEvent.id});
  };
}

function getSize(x) {
  return 0.0259 * (x ^ 2) - 0.0484 * x + 1.235;
}

function sortMapFeatures(features) {
  return Object.values(features).sort(function (a, b) {
    return a.rank || 3 - b.rank || 3;
  });
}
