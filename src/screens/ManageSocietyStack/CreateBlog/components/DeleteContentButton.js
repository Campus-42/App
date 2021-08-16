import React from 'react';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {
  Text as AnimText,
  createAnimatableComponent,
} from 'react-native-animatable';
import {Pressable} from 'react-native';
import {triggerHaptic} from '../../../../assets/Haptic/hapticFeedback';

const ICON_SIZE = GlobalStyle.Measurements.unit * 0.65;
const DURATION = 350;

const AnimFontAwesome5 = createAnimatableComponent(FontAwesome5Icon);

export function DeleteContentButton(props) {
  const iconRef = React.useRef();
  const textRef = React.useRef();
  const [confirm, setConfirm] = React.useState(false);
  var timeout;

  function handlePress() {
    console.log('Touched delete button, confirm ==', confirm);
    console.log('check', textRef.current.transitionTo !== null);
    if (confirm == false) {
      setConfirm(true);
      try {
        textRef.current.transitionTo(
          {width: GlobalStyle.Measurements.width * 0.2, marginLeft: 5},
          DURATION,
        );
        // iconRef.current.transitionTo({marginRight: 5}, DURATION / 2);
        timeout = setTimeout(revert, 5000);
      } catch {}
    } else {
      props.deleteContent(props.index);
      triggerHaptic('notificationSuccess');
      revert();
    }
  }

  function revert() {
    clearTimeout(timeout);
    try {
      textRef.current.transitionTo({width: 0, marginLeft: 0}, DURATION);
      // iconRef.current.transitionTo({marginRight: 0}, DURATION);
      setTimeout(() => setConfirm(false), DURATION);
    } catch {}
  }

  return props.index !== 0 && !props.start ? (
    <Pressable
      hitSlop={10}
      onPress={handlePress}
      style={{
        position: 'absolute',
        backgroundColor: LIGHT_GREY,
        borderRadius: ICON_SIZE / 1.5,
        height: ICON_SIZE * 2,
        minWidth: ICON_SIZE * 2,

        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

        alignSelf: 'flex-end',

        marginTop: 10,
        // marginRight: 20,
        paddingHorizontal: confirm ? 5 : 0,
        zIndex: 2,

        // shadowColor: GlobalStyle.Palettes.text.palette6,
        // shadowOffset: {width: 0, height: 2},
        // shadowOpacity: 0.2,
        // shadowRadius: 2,
        // elevation: 3,
      }}>
      <AnimText
        ref={textRef}
        duration={DURATION}
        style={[
          GlobalStyle.TextStyle.buttonSmall,
          {
            color: DARK_GREY,
            width: 0,
            fontWeight: '600',
          },
        ]}>
        Delete?
      </AnimText>

      <AnimFontAwesome5
        ref={iconRef}
        name={'times'}
        color={DARK_GREY}
        size={ICON_SIZE}
        style={{
          width: ICON_SIZE - 5,
          height: ICON_SIZE,
          marginRight: 2,
          alignSelf: 'center',
        }}
        // animation={{0: {width: 0}, 1: {width: ICON_SIZE}}}
      />
    </Pressable>
  ) : null;
}

const DARK_GREY = GlobalStyle.Palettes.background.palette3;
const LIGHT_GREY = GlobalStyle.Palettes.background.palette4;
