import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {GlobalStyle} from '../../../../../../assets/GlobalStyle';
import TouchableShrink from '../../../../../../assets/TouchableShrink/TouchableShrink';
import {createAnimatableComponent} from 'react-native-animatable';
import Carousel from 'react-native-snap-carousel';
import {ConfirmEvent} from './ConfirmEvent';
import {styles} from '../style';
import PropTypes from 'prop-types';
import {localCarouselStyles} from '../../../../../EventStack/HomeScreen/components/EventCarousel/EventCarousel';

export class ConfirmEventCarousel extends React.Component {
  render() {
    return (
      <View>
        {this.props.confirmations.length > 0 && (
          <Text style={localCarouselStyles.text}>Confirm new content</Text>
        )}
        <Carousel
          data={this.props.confirmations}
          key="ConfirmationCarousel"
          renderItem={this._renderItem}
          sliderWidth={GlobalStyle.Measurements.width}
          itemHeight={styles.confirmationContainer.height}
          itemWidth={styles.confirmationContainer.width}
        />
      </View>
    );
  }
  _renderItem = ({item, index}) => {
    return (
      <ConfirmEvent
        index={index}
        updateConfirms={this.props.updateConfirms}
        item={item}
        removeEvent={this.props.removeEvent}
        campusKey={this.props.campusKey}
        navigation={this.props.navigation}
      />
    );
  };
}

ConfirmEventCarousel.defaultProps = {
  confirmations: [],
};
ConfirmEventCarousel.propTypes = {
  confirmations: PropTypes.array.isRequired,
};
