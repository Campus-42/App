import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {UserImage} from '../../screens/ProfileStack/Profile/components/UserImage';
import {GlobalStyle} from '../GlobalStyle';
import {styles} from './style';
import TouchableShrink from '../TouchableShrink/TouchableShrink';
import {createAnimatableComponent} from 'react-native-animatable';
import PropTypes from 'prop-types';

const AnimatableTouchableShrink = createAnimatableComponent(TouchableShrink);

const USER_SIZE = GlobalStyle.Measurements.unit * 1.75;

export function UserComponent(props) {
  const subTitle =
    props.subTitle || props.user.level
      ? `Level ${props.user.level}`
      : props.user.email;

  const colors = GlobalStyle.ColorStyle.getCampusColors();

  return (
    <AnimatableTouchableShrink
      animation={props.animation}
      duration={450}
      delay={props.delay + 50 * props.index}
      showIcon={props.showIcon}
      showShadow={props.showShadow}
      dontFadeDisabled={props.dontFadeDisabled}
      disabled={props.disabled}
      onPress={() => props.onPress(props.user)}
      shadowOpacity={0.12}
      icon={props.invited ? 'times' : 'plus'}
      iconSize={Dimensions.get('screen').fontScale * (props.invited ? 13 : 14)}
      style={[
        styles.userComponent,
        {opacity: props.invited && props.dontFadeDisabled ? 1 : 0.8},
        props.style,
      ]}
      iconBackground={
        props.greyOut
          ? GlobalStyle.Palettes.background.palette4
          : props.invited
          ? GlobalStyle.ColorStyle.redButtonText
          : colors.main
      }>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <UserImage
          style={{height: USER_SIZE, width: USER_SIZE}}
          user={props.user}
          fontSize={USER_SIZE / 2.75}
          colors={colors}
          greyOut={props.disabled && props.greyOut}
          campusPointSystem={props.campusPointSystem}
          dontShowLevelBadge
        />
        <View style={styles.userComponentTextContainer}>
          <Text
            numberOfLines={1}
            style={[
              GlobalStyle.TextStyle.bodyMedium,
              {
                width: styles.userComponent.width * 0.65,
              },
            ]}>
            {props.user.first_name} {props.user.last_name}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              GlobalStyle.TextStyle.bodySmall,
              {
                color: GlobalStyle.Palettes.text.palette4,
                width: styles.userComponent.width * 0.65,
              },
            ]}>
            {subTitle}
          </Text>
        </View>
      </View>
    </AnimatableTouchableShrink>
  );
}

UserComponent.defaultProps = {
  style: {},
  delay: 0,
  animation: {0: {scale: 0.5, opacity: 0}, 1: {scale: 1, opacity: 1}},
  showIcon: true,
  disabled: false,
  dontFadeDisabled: false,
  subTitle: undefined,
  greyOut: false,
  showShadow: true,
};

UserComponent.propTypes = {
  style: PropTypes.object,
  delay: PropTypes.number,
  animation: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  showIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  dontFadeDisabled: PropTypes.bool,
  subTitle: PropTypes.string,
  greyOut: PropTypes.bool,
  showShadow: PropTypes.bool,
};
