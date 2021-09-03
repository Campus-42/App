import React from 'react';
import {Animated, View} from 'react-native';
import {auth} from '../../../../assets/Firebase/Firebase';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {NormalText} from './MessageTypes/NormalText';
import {Custom} from './MessageTypes/Custom';
import {System} from './MessageTypes/System';
import {DateView} from './MessageTypes/DateView';
import {ActivityIndicator} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Pressable} from 'react-native';
import {ImageMessage} from './MessageTypes/Image';
import PropTypes from 'prop-types';

export function Message(props) {
  const {item} = props;

  const isNextTheSameSender = props.nextCreator === item.creator;
  const sentFromUser = item.creator == auth.currentUser.uid;

  const messageDate = new Date(item.timestamp_ms).getDate();
  const nextMessageDate =
    props.nextMsgDate && new Date(props.nextMsgDate).getDate();
  const nextMsgIsANewDate =
    props.nextMsgDate && messageDate !== nextMessageDate;

  const showAvatar =
    props.nextSystem && !sentFromUser
      ? true
      : (!isNextTheSameSender || props.index === 0) && !sentFromUser;

  const justifyContent =
    item.custom || item.system
      ? 'center'
      : sentFromUser
      ? 'flex-end'
      : 'space-between';

  const msgProps = {
    item,
    showAvatar,
    ...props,
  };
  const ICON_SIZE = GlobalStyle.Measurements.unit;

  return (
    <React.Fragment>
      {nextMsgIsANewDate && props.nextMessageExists && (
        <DateView date={props.nextMsgDate || 0} />
      )}
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent,
          },
          props.containerStyle,
        ]}>
        {item.custom && <View /> /** To place the component in the middle */}

        {props.pending && sentFromUser && (
          <ActivityIndicator size={ICON_SIZE} />
        )}
        {props.error && sentFromUser && (
          <Pressable onPress={() => props.onPress(item)} hitSlop={8}>
            <Ionicon
              name={'alert-circle'}
              size={ICON_SIZE}
              style={{marginLeft: 4}}
              color={'#ff0000'}
            />
          </Pressable>
        )}
        {item.system ? (
          <System {...msgProps} />
        ) : item.image ? (
          <ImageMessage {...msgProps} />
        ) : item.custom ? (
          <Custom {...msgProps} />
        ) : (
          <NormalText {...msgProps} />
        )}
      </Animated.View>

      {props.first && <DateView date={item.timestamp_ms} />}
    </React.Fragment>
  );
}

Message.defaultProps = {
  item: {},
  pending: false,
  error: false,
  showMessageDate: true,
  allowLiking: true, // If the user can like the message

  navigation: {navigate: () => {}},
  members: {},

  onPress: () => {},
  onHold: () => {},
  toggleLike: () => {},
  navigate: () => {},
  onLikeContainerPress: () => {},
};
Message.propTypes = {
  item: PropTypes.object.isRequired,
  pending: PropTypes.bool,
  error: PropTypes.bool,
  showMessageDate: PropTypes.bool,
  allowLiking: PropTypes.bool,

  navigation: PropTypes.func,
  navigate: PropTypes.func,
  members: PropTypes.object,

  onPress: PropTypes.func,
  onHold: PropTypes.func,
  toggleLike: PropTypes.func,
  onLikeContainerPress: PropTypes.func,
};
