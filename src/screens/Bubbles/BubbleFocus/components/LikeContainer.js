import React from 'react';
import {Pressable, View, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {StyleSheet} from 'react-native';
import {UserImage} from '../../../ProfileStack/Profile/components/UserImage';

export function LikeContainer(props) {
  /**
   * Container to show the likes on the message
   */
  const likes = props.item.likes || [];

  const isNotSenderColors = ['#f0f0f0', '#f0f0f0'];
  const isSenderColors = [
    GlobalStyle.ColorStyle.getCampusColors().light,
    GlobalStyle.ColorStyle.getCampusColors().main,
  ];
  const size = (props.size || 1) * HEART_SIZE;

  return likes.length > 0 ? (
    <Pressable
      style={[styles.likeWrapper, props.style]}
      onPress={() => props.onPress(props.item.id)}>
      <View
        style={[
          styles.likeContainer,
          {
            backgroundColor:
              props.backgroundColor ||
              (props.isSender ? isSenderColors[1] : isNotSenderColors[1]),
          },
        ]}>
        <Ionicon
          name={'heart'}
          color={GlobalStyle.ColorStyle.candyRed}
          size={size}
        />
        {likes.slice(0, LIKES_TO_SHOW).map((u) => (
          <UserImage
            user={props.members[u]}
            dontShowLevelBadge
            style={{height: size, width: size, marginHorizontal: 2}}
          />
        ))}
        {likes.length > LIKES_TO_SHOW && (
          <Text
            style={[
              styles.likeText,
              !props.backgroundColor && props.isSender && {color: '#fff'},
            ]}>
            +{likes.length - LIKES_TO_SHOW}
          </Text>
        )}
      </View>
    </Pressable>
  ) : null;
}
const HEART_SIZE = GlobalStyle.Measurements.unit / 1.4;
const LIKES_TO_SHOW = 3;

const styles = StyleSheet.create({
  likeText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette3,
    marginHorizontal: 2,
    fontSize: HEART_SIZE / 1.65,
  },
  likeWrapper: {
    position: 'absolute',
    padding: 1.75,
    borderRadius: 50,

    backgroundColor: '#fff',

    marginTop: -5,
    marginLeft: GlobalStyle.Measurements.unit * 1.75,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
  },
  likeContainer: {
    padding: 1.5,
    paddingHorizontal: 4,
    borderRadius: 50,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
