import React from 'react';
import {StyleSheet, Pressable, View, Text} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import * as Animatable from 'react-native-animatable';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {FeatureFocus} from './FeatureItem';

const AnimPressable = Animatable.createAnimatableComponent(Pressable);

export class FeatureCarousel extends React.Component {
  constructor() {
    super();
    this.carousel = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const {selectedFeature} = this.props;
    const {selectedFeature: oldSelectedFeature} = prevProps;

    if (selectedFeature !== oldSelectedFeature) {
      const index = this.props.mapFeatures.findIndex(
        (e) => e.id === selectedFeature,
      );

      this.carousel.current.snapToItem(index, true);
    }
  }

  render() {
    return (
      <View style={{justifyContent: 'flex-end'}}>
        <View style={{position: 'absolute', borderColor: 'blue'}}>
          <Carousel
            ref={this.carousel}
            initialNumToRender={1}
            keyExtractor={({id}) => `campus_map_carousel_${id}`}
            contentContainerCustomStyle={{
              flexDirection: 'row',
              alignItems: 'flex-end',
            }}
            style={{
              minHeight: GlobalStyle.Measurements.height * 0.15,
              borderColor: 'red',
            }}
            data={this.props.mapFeatures.sort(sort)}
            sliderWidth={CAROUSEL_WIDTH}
            itemWidth={GlobalStyle.Measurements.width}
            renderItem={this.renderItem}
            horizontal
          />
        </View>
      </View>
    );
  }
  selectFeature = (item) =>
    this.props.selectFeature({
      nativeEvent: {
        coordinate: {
          latitude: item.geometry.coordinates[1],
          longitude: item.geometry.coordinates[0],
        },
        id: item.id,
      },
    });
  renderItem = ({item, index}) => {
    return <FeatureFocus item={item} index={index} isFocused={false} />;

    // return (
    //   <AnimPressable
    //     key={`campus_map_feature_item_${item.id}`}
    //     onPress={() => this.selectFeature(item)}
    //     style={styles.itemContainer}
    //     animation={'fadeInUpBig'}
    //     duration={550}>
    //     <View
    //       key={`campus_map_feature_item_view_${item.id}`}
    //       style={[
    //         styles.leftContainer,
    //         !properties.image && {width: ITEM_WIDTH - PADDING * 2},
    //       ]}>
    //       <Text style={styles.name}>{properties.name}</Text>
    //       <Icons types={properties.types || []} />
    //       {/* {properties.description && (
    //         <Text style={styles.description}>{properties.description}</Text>
    //       )}
    //       {properties.department.length > 0 && (
    //         <Text style={styles.type}>{properties.department.join(', ')}</Text>
    //       )} */}
    //     </View>
    //     {/* {properties.image && (
    //       <GlobalStyle.UI.Image
    //         style={styles.image}
    //         source={{uri: properties.image}}
    //       />
    //     )} */}
    //   </AnimPressable>
    // );
  };
}

function Icons({types = []}) {
  return types.filter((e) => getIconProps(e)).length > 0 ? (
    <View style={styles.iconRow}>
      {types.map((type) => (
        <View
          style={[styles.icon, {backgroundColor: getIconProps(type).color}]}>
          <FontAwesome5Icon
            name={getIconProps(type).icon}
            size={ICON_SIZE * 0.5}
            color={'#fff'}
          />
        </View>
      ))}
    </View>
  ) : null;
}
function getIconProps(type) {
  return type == 'accommodation'
    ? {icon: 'home', color: '#ff9900'}
    : type == 'it'
    ? {icon: 'desktop', color: '#ff9900'}
    : type == 'reception'
    ? {icon: 'university', color: '#9900ff'}
    : type == 'library'
    ? {icon: 'book', color: '#43b563'}
    : type == 'lecture hall'
    ? {icon: 'chalkboard-teacher', color: '#38761d'}
    : type == 'office'
    ? {icon: 'building', color: '#4a86e8'}
    : type == 'student help'
    ? {icon: 'comment-medical', color: '#ff0000'}
    : type == 'food'
    ? {icon: 'utensils', color: '#0b5394'}
    : type == 'bar'
    ? {icon: 'cocktail', color: '#ff00ff'}
    : type == 'postal'
    ? {icon: 'envelope', color: '#6aa84f'}
    : type == 'research'
    ? {icon: 'microscope', color: '#369138'}
    : type == 'cafe'
    ? {icon: 'coffee', color: '#980000'}
    : type == 'gym'
    ? {icon: 'dumbbell', color: '#000000'}
    : false;
}
function sort(a, b) {
  if (a.properties.rank || 0 < b.properties.rank || 0) {
    return -1;
  }
  if (a.properties.rank || 0 > b.properties.rank || 0) {
    return 1;
  }
  return 0;
}

const CAROUSEL_WIDTH = GlobalStyle.Measurements.width;
const ITEM_HEIGHT = GlobalStyle.Measurements.unit * 3;
const ITEM_WIDTH = GlobalStyle.Measurements.width * 0.85;
const PADDING = 10;
const ICON_SIZE = GlobalStyle.Measurements.unit * 1.2;
const IMAGE_HEIGHT = GlobalStyle.Measurements.unit * 5;

const styles = StyleSheet.create({
  carousel: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  itemContainer: {
    width: ITEM_WIDTH,
    minHeight: ITEM_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.98)',
    marginBottom: GlobalStyle.Measurements.margin * 1.2,
    borderRadius: GlobalStyle.Measurements.unit,
    padding: PADDING,

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 7,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: (ITEM_WIDTH / 4) * 1.5 - (PADDING * 3) / 2,
    height: IMAGE_HEIGHT,
    borderRadius: 7.5,
  },
  leftContainer: {
    width: (ITEM_WIDTH / 4) * 2.5 - (PADDING * 3) / 2,

    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  name: {
    ...GlobalStyle.TextStyle.bodyLarge,
    marginVertical: 2,
    fontWeight: '600',
  },
  type: {
    ...GlobalStyle.TextStyle.bodySmall,
    marginVertical: 2,
    color: GlobalStyle.Palettes.text.palette5,
  },
  description: {
    ...GlobalStyle.TextStyle.bodyRegular,
    marginVertical: 3,
  },
  icon: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',

    height: ICON_SIZE,
    width: ICON_SIZE,
    marginRight: 5,
    marginVertical: 5,
  },
  iconRow: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
});
