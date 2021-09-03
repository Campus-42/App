import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {
  localCarouselStyles,
  ADD_MORE_SIZE,
} from '../EventCarousel/EventCarousel';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {
  BlogSnap,
  BLOG_CAROUSEL_WIDTH,
  BLOG_ITEM_HEIGHT,
  BLOG_ITEM_HORIZONTAL_MARGIN,
  BLOG_ITEM_WIDTH,
  styles,
} from './BlogSnap';
import PropTypes from 'prop-types';
import {EventError} from '../EventCarousel/EventError';
import {LoadingCircle} from '../../../../../assets/LottieAnims/loading';
import {styles as evtStyles} from '../EventCarousel/EventSnap';
import {TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export class BlogCarousel extends React.Component {
  constructor() {
    super();
    this.carousel = React.createRef();
  }
  renderItem = ({item, index}) => (
    <BlogSnap
      blog={item}
      showNotification={this.props.showNotification}
      colors={this.props.colors}
      navigate={this.props.navigate}
      bookmarks={this.props.bookmarks}
    />
  );
  animateToIndex = (index = 0) => {
    try {
      this.carousel.current.snapToItem(index, true, (e) => console.log(e));
    } catch (err) {}
  };
  render() {
    return (
      <View>
        <View style={localCarouselStyles.titleContainer}>
          <Text style={localCarouselStyles.text}>{this.props.title}</Text>
          {this.props.onAddMorePress && (
            <GlobalStyle.UI.PlusButton onPress={this.props.onAddMorePress} />
          )}
        </View>
        {this.props.blogs.length > 0 ? (
          <Carousel
            data={this.props.blogs}
            ref={this.carousel}
            key={'BlogCarousel'}
            renderItem={this.renderItem}
            sliderWidth={BLOG_CAROUSEL_WIDTH}
            sliderHeight={BLOG_ITEM_HEIGHT + styles.container.shadowRadius * 3}
            itemWidth={BLOG_ITEM_WIDTH + BLOG_ITEM_HORIZONTAL_MARGIN + 2}
            itemHeight={BLOG_ITEM_HEIGHT}
            activeSlideAlignment={'start'}
            containerCustomStyle={{
              paddingHorizontal:
                (GlobalStyle.Measurements.width - (BLOG_ITEM_WIDTH + 10) * 2) /
                1.5,
              paddingVertical: styles.container.shadowRadius * 2,
              marginTop: -styles.container.shadowRadius * 2,
            }}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
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
                backgroundColor: '#00000000',
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
              />
            )}
          </View>
        )}
      </View>
    );
  }
}

BlogCarousel.defaultProps = {
  blogs: [],
  colors: {main: 'blue', extraLight: 'blue'},
  campusKey: '',
  navigate: () => {},
  title: 'Announcements for You',
  showNotification: true,
};
BlogCarousel.propTypes = {
  blogs: PropTypes.array.isRequired,
  colors: PropTypes.object.isRequired,
  campusKey: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  title: PropTypes.string,
  showNotification: PropTypes.bool,
};
