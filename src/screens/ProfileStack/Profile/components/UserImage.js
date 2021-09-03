import React from 'react';
import {Text} from 'react-native';
import {styles} from '../style';
import LinearGradient from 'react-native-linear-gradient';
import {LevelBadge} from './LevelBadge';
import {Palettes} from '../../../../assets/GlobalStyle/ColorStyle';
import {UI} from '../../../../assets/GlobalStyle/UI';

export function UserImage(props) {
  const style = {
    ...styles.userImageCircle,
    ...props.style,
  };

  const user = props.user;
  const name = `${(props.user.first_name || ' ').substring(0, 1)} ${(
    props.user.last_name || ' '
  ).substring(0, 1)}`;
  const img = props.overrideImage || user.image || null;

  return (
    <React.Fragment>
      {img !== null ? (
        <UI.Image source={{uri: img}} style={style} />
      ) : (
        <LinearGradient
          start={{x: 0, y: 1}}
          end={{x: 1, y: 0}}
          colors={
            !props.greyOut
              ? [props.colors.extraLight, props.colors.main]
              : [Palettes.background.palette5, Palettes.background.palette4]
          }
          style={style}>
          <Text
            adjustsFontSizeToFit
            allowFontScaling
            style={[styles.userImageText, {fontSize: style.height * 0.35}]}>
            {name}
          </Text>
        </LinearGradient>
      )}
      {props.dontShowLevelBadge === false && (
        <LevelBadge {...props} style={false} height={style.height} />
      )}
    </React.Fragment>
  );
}

UserImage.defaultProps = {
  onPress: () => {},
  pressable: false,
  style: {},
  user: {first_name: ' ', last_name: ' '},
  fontSize: styles.userImageText.fontSize,
  greyOut: false,
  overrideImage: null,
  colors: {
    dark: '#22a1d8',
    extraDark: '#1e8fc0',
    extraLight: '#88d5f7',
    light: '#58c5f3',
    main: '#26b3f0',
  },
  smallLevelBadge: false,
};
