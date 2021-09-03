import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import MapView from 'react-native-maps';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {localCarouselStyles} from './EventCarousel/EventCarousel';
import {Pressable} from 'react-native';
import {Campus} from '../../../../assets/Campus';
import {analytics} from '../../../../assets/Analytics';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';

export class CampusMapPreview extends React.Component {
  render() {
    return (
      <Pressable
        onPress={this.onPress}
        style={{
          width: GlobalStyle.Measurements.width * 0.8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          marginVertical: GlobalStyle.Measurements.margin,
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: `${GlobalStyle.ColorStyle.blueButtonText}20`,
            borderRadius: 100,
            padding: 5,
            marginRight: GlobalStyle.Measurements.margin,
          }}>
          <Entypo
            name={'location-pin'}
            color={GlobalStyle.ColorStyle.blueButtonText}
            size={GlobalStyle.Measurements.unit}
          />
        </View>
        <Text style={GlobalStyle.ButtonStyle.TextButton}>Show campus map</Text>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 5,
          }}>
          <Ionicon
            name={'arrow-forward'}
            color={GlobalStyle.ColorStyle.blueButtonText}
            size={GlobalStyle.Measurements.unit * 0.8}
          />
        </View>
      </Pressable>
    );
  }
  onPress = () => {
    this.props.navigate('Campus Map', {
      initialRegion: this.props.campus.campus_map_initial_coordinates,
    });
  };
}

const styles = StyleSheet.create({
  map: {
    height: GlobalStyle.Measurements.unit * 4.5,
    width: GlobalStyle.Measurements.width * 0.8,
    alignSelf: 'center',
    borderRadius: GlobalStyle.Measurements.unit / 2,
  },
  container: {
    width: GlobalStyle.Measurements.width,

    shadowColor: '#aaa',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
});

const mapPadding = {
  bottom: -30,
  top: -30,
};
