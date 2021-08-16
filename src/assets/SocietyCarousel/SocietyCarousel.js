import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {GlobalStyle} from '../GlobalStyle';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import PropTypes from 'prop-types';
import {SocietySnap} from './SocietySnap';
import {Store} from '../../assets/redux/store';
import {EventError} from '../../screens/EventStack/HomeScreen/components/EventCarousel/EventError';
import {
  ADD_MORE_SIZE,
  localCarouselStyles,
} from '../../screens/EventStack/HomeScreen/components/EventCarousel/EventCarousel';
import {TouchableOpacity} from 'react-native';

/**Variables to dictate carousel dimensionss */
const SLIDER_WIDTH = GlobalStyle.Measurements.width;
export const ITEM_WIDTH = GlobalStyle.Measurements.width * 0.8;
export const ITEM_HEIGHT = GlobalStyle.Measurements.unit * 7;

export class SocietyCarousel extends React.Component {
  /**
   * Return a carousel, much like the event carousel.
   * It will be used by society managers to manage their societies
   */
  constructor() {
    super();
    this.carousel = React.createRef();
  }
  handleIndex = (index) => {
    // If index is second to last, get new events
    console.log('Getting more societies');
    if (index == this.props.data.length - 2) this.props.refresh();
  };
  _renderItem = ({item}) => {
    return (
      <SocietySnap
        data={item}
        colors={this.props.colors || this.props.store.app.campus.colors}
        onPress={(item) => this.props.onPress(item)}
        navigation={this.props.navigation}
        bookmarks={this.props.bookmarks}
        dontShowBookmark={this.props.dontShowBookmark}
        reduxSociety={
          (this.props.reduxSocieties || {})[item.id] !== undefined
            ? this.props.reduxSocieties[item.id]
            : false
        }
      />
    );
  };
  animateToIndex = (index) => {
    try {
      this.carousel.current.snapToItem(index, true, (e) => console.log(e));
    } catch (err) {}
  };
  render() {
    return (
      <View>
        <SkeletonContent
          containerStyle={{width: GlobalStyle.Measurements.width}}
          boneColor="#e1e9ee"
          highlightColor="#f2f8fc"
          isLoading={this.props.loading}
          layout={[
            {
              key: 'recommended_society_carousel_text',
              width: GlobalStyle.Measurements.width * 0.6,
              height: GlobalStyle.Measurements.margin,
              marginHorizontal: localCarouselStyles.titleContainer.marginHorizontal,
              marginVertical: localCarouselStyles.titleContainer.marginVertical,
            },
            {
              key: 'recommended_society_carousel',
              width: ITEM_WIDTH,
              height: ITEM_HEIGHT,
              marginHorizontal: (SLIDER_WIDTH - ITEM_WIDTH) / 2,
              borderRadius: GlobalStyle.Measurements.unit / 2,
            },
          ]}>
          <View style={localCarouselStyles.titleContainer}>
            <Text style={localCarouselStyles.text}>{this.props.title}</Text>
            {this.props.onAddMorePress && (
              <TouchableOpacity
                style={localCarouselStyles.addMoreIcon}
                onPress={this.props.onAddMorePress}>
                <FontAwesome5Icon
                  name={'plus'}
                  color={'#fff'}
                  size={ADD_MORE_SIZE}
                />
              </TouchableOpacity>
            )}
          </View>
          {this.props.data.length > 0 ? (
            <Carousel
              ref={this.carousel}
              data={this.props.data}
              key={'SocietyCarousel'}
              renderItem={this._renderItem}
              sliderWidth={SLIDER_WIDTH}
              itemHeight={ITEM_HEIGHT}
              itemWidth={ITEM_WIDTH}
              onSnapToItem={this.handleIndex}
            />
          ) : (
            <EventError
              text={'We could not find any societies'}
              buttonText={'Search society'}
              focusSearch={() => this.props.focusSearch()}
              text={this.props.emptyText}
            />
          )}
        </SkeletonContent>
      </View>
    );
  }
}

/**
 * Specify default this.props and prop types
 */
SocietyCarousel.deafultProps = {
  data: [], // The societies to show in carousel
  title: 'Your societies', // The title above the carousel
  loading: false,
  onPress: () => {},
  navigation: {navigate: () => {}},
  store: {app: {}},
  emptyText: "We couldn't find any societies",
};
SocietyCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  emptyText: PropTypes.string,
};
