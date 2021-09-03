import React from 'react';
import {StyleSheet} from 'react-native';
import {Keyboard} from 'react-native';
import {Animated, Pressable, View} from 'react-native';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import * as Animatable from 'react-native-animatable';
import {exp} from 'react-native-reanimated';

const AnimatedFontAwesome5Icon = Animated.createAnimatedComponent(
  FontAwesome5Icon,
);
const AnimatablePressable = Animatable.createAnimatableComponent(Pressable);

const ICON = GlobalStyle.TextStyle.bodyRegular.fontSize * 1.5;
const HEIGHT = ICON * 2;
const FULL_WIDTH = HEIGHT * 2 * 4;

export function KeyboardAccessoryAnnouncement(props) {
  const width = React.useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = React.useState(false);

  const fullWidth = HEIGHT * 1.5 * 3.3;
  function animate() {
    Animated.timing(width, {
      toValue: expanded ? 0 : fullWidth,
      duration: 450,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  }

  const rotate = width.interpolate({
    inputRange: [0, fullWidth],
    outputRange: ['0deg', '-45deg'],
  });

  return (
    <KeyboardAccessoryView
      alwaysVisible
      androidAdjustResize
      hideBorder
      inSafeAreaView
      bumperHeight={15}
      style={[
        styles.wrapper,
        {
          marginBottom: 50,
        },
      ]}>
      <View style={styles.container}>
        <Animated.View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginRight: width._value / fullWidth,
            width: width,
          }}>
          {expanded && (
            <React.Fragment>
              <IconButton
                onPress={props.searchCampus}
                name={'plus'}
                size={ICON * 0.8}
                index={3}
                {...props}
              />
              <IconButton
                type={'Image'}
                name={'image'}
                size={ICON * 0.9}
                index={2}
                {...props}
              />
              <IconButton
                type={'Heading'}
                name={'heading'}
                size={ICON * 0.7}
                index={1}
                {...props}
              />
              <IconButton
                type={'Text'}
                name={'align-left'}
                size={ICON * 0.8}
                index={0}
                {...props}
              />
            </React.Fragment>
          )}
        </Animated.View>
        <Pressable
          onPress={animate}
          style={{
            width: HEIGHT,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <AnimatedFontAwesome5Icon
            name={'plus'}
            size={ICON}
            color={props.colors.main}
            style={{
              transform: [{rotate: rotate}],
            }}
          />
        </Pressable>
      </View>
    </KeyboardAccessoryView>
  );
}

function IconButton(props) {
  function onPress() {
    if (props.type === undefined) props.onPress();
    else props.addContent(props.type);
  }

  return (
    <AnimatablePressable
      onPress={onPress}
      animation={'fadeIn'}
      duration={650}
      delay={100 + (350 / 3) * (props.index + 1)}
      style={[
        styles.iconButton,
        {backgroundColor: `${props.colors.extraLight}80`},
      ]}>
      <FontAwesome5Icon
        name={props.name}
        size={props.size}
        color={props.colors.main}
      />
    </AnimatablePressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    borderRadius: HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    marginHorizontal: GlobalStyle.Measurements.width * 0.05,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  wrapper: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#00000000',
  },
  iconButton: {
    width: HEIGHT * 0.8,
    height: HEIGHT * 0.8,
    borderRadius: HEIGHT * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: HEIGHT / 4,
  },
});
