import React from 'react';
import {Pressable, PanResponder, Text} from 'react-native';
import {StyleSheet, ScrollView, View} from 'react-native';
import StaticSafeAreaInsets from 'react-native-static-safe-area-insets';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import RNVideo from 'react-native-video';
import * as Animatable from 'react-native-animatable';
import {Animated} from 'react-native';

export function Graphics(props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal
      showsHorizontalScrollIndicator={false}>
      <View style={styles.mapContainer}>
        {props.graphics.map((elem, index) => (
          <GraphicView
            elem={elem}
            index={index}
            onPress={props.onGraphicPress}
            onDelete={props.onGraphicDeleted}
          />
        ))}
      </View>
      {props.graphics.length > 0 && (
        <Text style={styles.text}>
          {props.graphics.length}/{props.maxNumber}
        </Text>
      )}
    </ScrollView>
  );
}

function GraphicView(props) {
  const marginTop = React.useRef(new Animated.Value(0)).current;
  const animView = React.useRef();

  function animate(to = 'in' || 'out') {
    Animated.spring(marginTop, {
      tension: 40,
      friction: 7,
      useNativeDriver: false,
      restDisplacementThreshold: 10,
      restSpeedThreshold: 10,
      toValue: to == 'in' ? 0 : GRAPHIC_HEIGHT * -4,
    }).start(() => {
      if (to == 'out') {
        props.onDelete(props.index);
        marginTop.setValue(0);
      }
    });
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (e, gesture) => {
      const {dx, dy} = gesture;
      return dy > 2 || dy < -2;
    },
    onPanResponderGrant: () => marginTop.setOffset(0),
    onPanResponderMove: (e, gesture) => {
      gesture.dy <= 0 && marginTop.setValue(gesture.dy);
    },
    onPanResponderRelease: (e, gesture) => {
      if (gesture.dy > -20) animate('in');
      else animate('out');
    },
  });

  return (
    <Animatable.View
      {...panResponder.panHandlers}
      ref={animView}
      style={{marginTop: marginTop}}
      useNativeDriver={false}
      animation={'fadeInRight'}>
      <Pressable
        style={styles.graphicView}
        onPress={({nativeEvent}) => props.onPress(nativeEvent, props.elem)}>
        {props.elem.type == 'image' ? (
          <GlobalStyle.UI.Image
            source={{uri: props.elem.uri}}
            style={styles.image}
          />
        ) : (
          <RNVideo
            style={styles.image}
            source={{uri: props.elem.uri}}
            muted={true}
            resizeMode={'cover'}
            repeat={true}
          />
        )}
      </Pressable>
    </Animatable.View>
  );
}

const GRAPHIC_WIDTH = GlobalStyle.Measurements.width * 0.2;
const GRAPHIC_HEIGHT = GRAPHIC_WIDTH * (14 / 9);
const BORDER_WIDTH = GRAPHIC_WIDTH / 40;
const BORDER_RADIUS = GRAPHIC_WIDTH / 8;

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    paddingHorizontal: GlobalStyle.Measurements.width * 0.05,
    padding: 10,
    marginTop: StaticSafeAreaInsets.safeAreaInsetsTop + 20,

    position: 'absolute',
  },
  contentContainer: {
    flexDirection: 'column',
  },
  mapContainer: {
    paddingRight: GRAPHIC_WIDTH / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: GRAPHIC_HEIGHT,
  },

  ///// GRAPHIC VIEW //////
  graphicView: {
    width: GRAPHIC_WIDTH,
    height: GRAPHIC_HEIGHT,
    borderRadius: BORDER_RADIUS,
    borderColor: '#fff',
    borderWidth: BORDER_WIDTH,

    marginRight: GlobalStyle.Measurements.marginHalf,

    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  image: {
    width: GRAPHIC_WIDTH - BORDER_WIDTH * 2,
    height: GRAPHIC_HEIGHT - BORDER_WIDTH * 2,
    // borderRadius: BORDER_RADIUS,

    overflow: 'hidden',
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: '#fff',
    alignSelf: 'flex-start',
    marginTop: GlobalStyle.Measurements.marginHalf,
  },
});
