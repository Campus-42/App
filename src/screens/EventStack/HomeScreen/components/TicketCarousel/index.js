import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {localCarouselStyles} from '../EventCarousel/EventCarousel';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';

import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';
import {TicketSnap} from './TicketSnap';

const SLIDER_WIDTH = GlobalStyle.Measurements.width;
export const ITEM_WIDTH = GlobalStyle.Measurements.width * 0.8;
export const ITEM_HEIGHT = GlobalStyle.Measurements.unit * 10;

export const TicketCarousel = (props) => {
  const renderItem = ({item, index}) => (
    <TicketSnap
      item={item}
      colors={props.colors}
      navigate={props.navigate}
      style={{
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
      }}
      openTicket={props.openTicket}
    />
  );

  return (
    <View>
      <View style={localCarouselStyles.titleContainer} >
      <Text style={localCarouselStyles.text}>Tickets for upcoming events</Text>
      </View>
      <Carousel
        data={props.tickets}
        key={'TicketCarousel'}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        itemHeight={ITEM_HEIGHT}
      />
    </View>
  );
};

TicketCarousel.defaultProps = {
  tickets: [],
  colors: {main: 'blue', extraLight: 'blue'},
  campusKey: '',
  navigate: () => {},
};
TicketCarousel.propTypes = {
  tickets: PropTypes.array.isRequired,
  colors: PropTypes.object.isRequired,
  campusKey: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
};
