import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../../../assets/TouchableShrink/TouchableShrink';
import {createAnimatableComponent} from 'react-native-animatable';
import Carousel from 'react-native-snap-carousel';
import {styles} from '../style';
import PropTypes from 'prop-types';
import {EventsSoonSnap} from './EventsSoonSnap';
import {localCarouselStyles} from '../../../../../EventStack/HomeScreen/components/EventCarousel/EventCarousel';

export const EventsSoonCarousel = (props) => {
  const _renderItem = ({item}) => (
    <EventsSoonSnap
      tagColors={props.tagColors}
      item={item}
      colors={props.colors}
      navigate={props.navigate}
      bookmarks={props.bookmarks}
    />
  );

  return (
    props.data.length > 0 && (
      <View>
        <Text style={localCarouselStyles.text}>Your upcoming events</Text>
        <Carousel
          data={props.data}
          key="ConfirmationCarousel"
          renderItem={_renderItem}
          sliderWidth={GlobalStyle.Measurements.width}
          itemHeight={styles.confirmationContainer.height}
          itemWidth={styles.confirmationContainer.width}
        />
      </View>
    )
  );
};

EventsSoonCarousel.defaultProps = {
  confirmations: [],
};
EventsSoonCarousel.propTypes = {
  confirmations: PropTypes.array.isRequired,
};
