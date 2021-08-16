import React from 'react';
import {Marker} from 'react-native-maps';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {View} from 'react-native';
const AnimFontAwesome5 = Animatable.createAnimatableComponent(FontAwesome5);

export function MapFeature(props) {
  const mapProps = {
    key: `map_feature_${props.elem.id}`,
    coordinate: {
      latitude: props.elem.geometry.coordinates[1],
      longitude: props.elem.geometry.coordinates[0],
    },
    centerOffset: {x: 0, y: -3},
    identifier: props.elem.id,
  };
  const color = props.selected ? props.colors.main : '#969696';

  return (
    <Marker {...mapProps}>
      <View style={{padding: 10}}>
        <AnimFontAwesome5
          animation={'bounceIn'}
          delay={35 * props.index}
          name={'map-pin'}
          color={color}
          size={props.size || SIZE}
        />
      </View>
    </Marker>
  );
}
const SIZE = GlobalStyle.Measurements.unit;
