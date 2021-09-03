import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {EventSnap, styles as evtStyles} from './EventSnap';

import {TextStyle} from '../../../../../assets/GlobalStyle/TextStyle';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {EventError} from './EventError';
import {SwipeUpViewSmall} from '../../../../../assets/SwipeUpView';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {LoadingCircle} from '../../../../../assets/LottieAnims/loading';
import {updateReduxEvents} from '../../../../../assets/redux/functions';
import {analytics} from '../../../../../assets/Analytics';
import {TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Palettes} from '../../../../../assets/GlobalStyle/ColorStyle';

export const SLIDER_WIDTH = GlobalStyle.Measurements.width;
export const ITEM_WIDTH = GlobalStyle.Measurements.width * 0.8;
export const ITEM_HEIGHT = GlobalStyle.Measurements.unit * 7 + 20;

export class EventCarousel extends React.Component {
  // This class will NOT get events instead it will only show them as snaps.
  // Pass events in an array
  constructor() {
    super();
    this.state = {loading: false};
    this.carousel = React.createRef();
  }
  componentDidMount() {
    // We have to change the state for skeleton to show animations
    this.setState({loading: true});
  }
  componentDidUpdate() {
    // Checking data and current state to set state
    if (this.props.data.length !== 0 && this.state.loading === true) {
      this.setState({loading: false});
    } else if (this.props.data.length === 0 && this.state.loading === false) {
      this.setState({loading: true});
    }
  }
  animateToIndex = (index) => {
    try {
      this.carousel.current.snapToItem(index, true, (e) => console.log(e));
    } catch (err) {}
  };
  render() {
    // Filter events
    const events =
      this.props.data.length > 0
        ? this.props.data.filter((event) => {
            const tagCheck = event.tags.some(
              (r) =>
                this.props.chosenEventTags.includes(r) || this.props.dontFilter,
            );

            const dateCheck =
              event.start_ms >= this.props.filter.date.min &&
              event.end_ms <= this.props.filter.date.max;

            const price = parseFloat(
              !event.pricing.show ? 0 : event.pricing.price,
            );

            const priceCheck =
              price >= this.props.filter.price.min &&
              price <= this.props.filter.price.max;

            return (
              (tagCheck && dateCheck && priceCheck) || this.props.dontFilter
            );
          })
        : [];
    return (
      (events.length > 0 || this.props.isLoading || this.props.dontHide) && (
        <View>
          <SkeletonContent
            containerStyle={{width: GlobalStyle.Measurements.width}}
            isLoading={this.props.isLoading && this.props.showSkeleton}
            boneColor="#e1e9ee"
            highlightColor="#f2f8fc"
            layout={[
              {
                key: 'text',
                width: GlobalStyle.Measurements.width * 0.6,
                height: GlobalStyle.Measurements.margin,
                marginHorizontal:
                  localCarouselStyles.titleContainer.marginHorizontal,
                marginVertical:
                  localCarouselStyles.titleContainer.marginVertical,
                ...localCarouselStyles.text,
              },
              {
                key: 'carousel',
                width: ITEM_WIDTH,
                height: ITEM_HEIGHT,
                marginHorizontal: (SLIDER_WIDTH - ITEM_WIDTH) / 2,
              },
            ]}>
            <View style={localCarouselStyles.titleContainer}>
              <Text style={localCarouselStyles.text}>{this.props.text}</Text>
              {this.props.onAddMorePress && (
                <GlobalStyle.UI.PlusButton
                  onPress={this.props.onAddMorePress}
                />
              )}
            </View>
            {events.length !== 0 ? (
              <Carousel
                ref={this.carousel}
                key={'Carousel_' + this.props.data.text}
                data={events}
                renderItem={this._renderItem}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                itemHeight={ITEM_HEIGHT + 10}
                onSnapToItem={this.handleIndex}
              />
            ) : (
              <View
                style={[
                  evtStyles.container,
                  {
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    flexDirection: 'column',
                  },
                ]}>
                {this.props.isLoading && this.props.showSkeleton === false ? (
                  <React.Fragment>
                    <Text style={GlobalStyle.TextStyle.bodyLarge}>
                      Getting events
                    </Text>
                    <LoadingCircle />
                  </React.Fragment>
                ) : (
                  <EventError
                    error={this.props.data}
                    focusSearch={this.props.focusSearch}
                    text={this.props.emptyText}
                    showButton={this.props.showButton}
                    bookmarks={this.props.bookmarks}
                  />
                )}
              </View>
            )}
          </SkeletonContent>
        </View>
      )
    );
  }
  handleIndex = (index) => {
    // If index is second to last, get new events
    analytics.breadcrumb(
      `Fetching more events for carousel: ${this.props.text}`,
      'EventCarousel.js',
      'handleIndex()',
    );
    if (index == this.props.data.length - 2) this.props.refresh();
  };

  _renderItem = ({item}) => {
    return (
      <EventSnap
        data={item}
        colors={this.props.colors}
        tagColors={this.props.tagColors}
        openEvent={() => this.openEvent(item)}
        navigation={this.props.navigation}
        reduxEvent={this.props.reduxEvents[item.id]}
        bookmarks={this.props.bookmarks}
      />
    );
  };
  openEvent = (event = Object) => {
    this.props.openEvent(event);
  };
}

EventCarousel.defaultProps = {
  showButton: true,
  dontHide: false,
  chosenEventTags: [],
  showSkeleton: true,
  dontFilter: false,
  filter: {
    date: {min: null, max: null},
    price: {min: null, max: null},
  },
  reduxEvents: {}, // The redux events with the everchanging info
};

export const ADD_MORE_SIZE = 13;

export const localCarouselStyles = StyleSheet.create({
  text: {
    ...TextStyle.bodyMedium,
    // fontWeight: '700',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: GlobalStyle.Measurements.width * 0.85,

    marginHorizontal: GlobalStyle.Measurements.margin,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    marginTop: GlobalStyle.Measurements.margin,
  },
});
