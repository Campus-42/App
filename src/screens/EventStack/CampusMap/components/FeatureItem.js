import React from 'react';
import {Pressable, Animated} from 'react-native';
import {StyleSheet} from 'react-native';
import {ScrollView} from 'react-native';
import {View, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedFontAwesome5 = Animated.createAnimatedComponent(FontAwesome5Icon);

export class FeatureFocus extends React.Component {
  constructor() {
    super();

    this.view = React.createRef();

    this.state = {
      marginTop: new Animated.Value(0),
      scrollExpansion: new Animated.Value(0),
      viewBottom: new Animated.Value(styles.container.bottom),

      show: false,
      showSkeleton: false,
      previousFocusedFeature: false,
      featureInfo: {properties: {}},
    };
  }

  focusFeature = (id) => {
    if (id !== false) {
      const prev = this.state.previousFocusedFeature;
      const info = this.props.mapFeatures[id || ''] || {properties: {}};

      this.setState({show: !!id && !!info});

      if (id !== prev) {
        this.toggleExpansion(0);
        this.setState({showSkeleton: true}, () => {
          setTimeout(() => this.setState({showSkeleton: false}), 1250);
        });
      }
      this.setState({previousFocusedFeature: id, featureInfo: info});

      if (!!id) this.animateView(true);
    } else if (this.state.show) {
      this.animateView(false);
      this.toggleExpansion(0);
    }
  };

  animateView = (show) => {
    var toValue = -GlobalStyle.Measurements.height * 0.4;
    if (show) toValue = GlobalStyle.Measurements.margin * 1.5;

    Animated.timing(this.state.viewBottom, {
      toValue,
      duration: 450,
      delay: 0,
      useNativeDriver: false,
    }).start();
  };

  render() {
    const properties = this.state.featureInfo.properties;

    const scrollHeight = this.state.scrollExpansion.interpolate({
      inputRange: [0, 1],
      outputRange: [0, SCROLL_MAX_HEIGHT],
    });
    const iconRotation = this.state.scrollExpansion.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return this.state.show ? (
      <Animatable.View
        ref={this.view}
        style={[styles.container, {bottom: this.state.viewBottom}]}>
        <SkeletonContent
          containerStyle={styles.skeleton}
          layout={SKELETON_LAYOUT}
          isLoading={this.state.showSkeleton}>
          <View style={styles.topInfoContainer}>
            <View>
              <Text style={styles.title}>{properties.name || ''}</Text>
              <Icons types={properties.types || []} />
            </View>
            <AnimatedPressable
              animation={{0: {scale: 0}, 1: {scale: 1}}}
              duration={350}
              hitSlop={5}
              style={styles.expandButtonContainer}
              onPress={() => this.toggleExpansion()}>
              <AnimatedFontAwesome5
                name={'chevron-up'}
                color={EXPAND_COLOR}
                size={EXPAND_SIZE}
                style={{
                  transform: [{rotate: iconRotation}],
                }}
              />
            </AnimatedPressable>
          </View>
        </SkeletonContent>
        <AnimatedScrollView
          style={[
            styles.scroll,
            {height: scrollHeight},
            this.state.scrollExpanded && {borderTopWidth: 1},
          ]}>
          {properties.opening_times && (
            <>
              <Text style={styles.heading}>Opening times</Text>
              {properties.opening_times.all_day ? (
                <Text style={styles.text}>24/7</Text>
              ) : (
                <Text style={styles.text}>
                  {properties.opening_times.open} -{' '}
                  {properties.opening_times.close}
                </Text>
              )}
            </>
          )}
          {properties.description && !this.state.showSkeleton && (
            <>
              <Text style={styles.heading}>Description</Text>
              <Text style={styles.text}>{properties.description}</Text>
            </>
          )}
          {properties.images && !this.state.showSkeleton && (
            <>
              <Text style={styles.heading}>Images</Text>
              <ScrollView horizontal>
                {properties.images.map((img) => (
                  <GlobalStyle.UI.Image
                    source={{uri: img}}
                    style={styles.image}
                    navigate={this.props.navigate}
                  />
                ))}
              </ScrollView>
            </>
          )}
          {(properties.department || []).length > 0 &&
            !this.state.showSkeleton && (
              <>
                <Text style={styles.heading}>Departments</Text>
                {properties.department.map((dep) => (
                  <Text style={styles.department}>· {dep}</Text>
                ))}
              </>
            )}
        </AnimatedScrollView>
      </Animatable.View>
    ) : null;
  }

  toggleExpansion = (overrideValue = false) => {
    var toValue = 0;
    if (overrideValue !== false) toValue = overrideValue;
    else if (!this.state.scrollExpanded) toValue = 1;

    Animated.timing(this.state.scrollExpansion, {
      toValue,
      duration: 350,
      delay: 0,
      useNativeDriver: false,
    }).start(() => this.setState({scrollExpanded: toValue > 0}));
  };
}

function Icons({types = []}) {
  return types.filter((e) => getIconProps(e)).length > 0 ? (
    <View style={styles.row}>
      {types.map((type) => (
        <LinearGradient
          colors={['#ffffff80', getIconProps(type).color]}
          start={{x: 0, y: 0}}
          end={{x: 0.7, y: 0.2}}
          style={[styles.icon, {backgroundColor: getIconProps(type).color}]}>
          <FontAwesome5Icon
            name={getIconProps(type).icon}
            size={ICON_SIZE * 0.5}
            color={'#fff'}
          />
        </LinearGradient>
      ))}
    </View>
  ) : null;
}

const BASE_HEIGHT = GlobalStyle.Measurements.unit * 3.75;
const ITEM_WIDTH = GlobalStyle.Measurements.width * 0.92;
const PADDING = 10;
const EXPAND_COLOR = GlobalStyle.Palettes.background.palette1;
const ICON_SIZE = GlobalStyle.Measurements.unit * 1.2;
const SCROLL_MAX_HEIGHT = GlobalStyle.Measurements.height * 0.4;
const EXPAND_SIZE = GlobalStyle.Measurements.unit * 0.5;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 20,

    minHeight: BASE_HEIGHT,
    width: ITEM_WIDTH,
    bottom: -GlobalStyle.Measurements.height * 0.4,

    backgroundColor: 'rgba(255,255,255,0.98)',

    borderRadius: GlobalStyle.Measurements.unit,
    borderWidth: 0.5,
    borderColor: '#e5e5e5',
    padding: PADDING,
    paddingHorizontal: PADDING + 5,

    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 7,
  },
  skeleton: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scroll: {
    alignSelf: 'stretch',
    borderTopWidth: 0,
    borderTopColor: '#e5e5e5',
  },
  title: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
  },
  heading: {
    ...GlobalStyle.TextStyle.bodyMedium,
    marginTop: 10,
    marginBottom: 2,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
  },
  image: {
    height: GlobalStyle.Measurements.width * 0.3,
    width: GlobalStyle.Measurements.width * 0.3,
    borderRadius: 5,
    marginRight: 5,
  },
  icon: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',

    height: ICON_SIZE,
    width: ICON_SIZE,
    marginHorizontal: 3.5,
    marginVertical: 5,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  topInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    height: BASE_HEIGHT - PADDING * 2 - 5,
  },
  department: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
  expandButtonContainer: {
    height: EXPAND_SIZE + 16,
    width: EXPAND_SIZE + 16,

    backgroundColor: '#e5e5e5',
    borderRadius: 100,

    alignItems: 'center',
    justifyContent: 'center',
  },
  expandButtonIcon: {},
});

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

const SKELETON_LAYOUT = [
  {
    key: 'title_map',
    height: styles.title.fontSize,
    width: ITEM_WIDTH * 0.65,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  {
    key: 'icons',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    children: [
      {
        key: 'icon1',
        ...styles.icon,
      },
      {
        key: 'icon2',
        ...styles.icon,
      },
      {
        key: 'icon3',
        ...styles.icon,
      },
    ],
  },
];
