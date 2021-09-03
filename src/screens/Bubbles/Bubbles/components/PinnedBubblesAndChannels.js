import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {View, Text} from 'react-native';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {UserImage} from '../../../ProfileStack/Profile/components/UserImage';
import {getMemberNames} from './MessageRow';

export function PinnedBubblesAndChannels(props) {
  const data = Array.isArray(props.data) ? props.data : [];
  const quantity = data.length;
  const size = (quantity <= 2 ? 0.3 : 0.2) * GlobalStyle.Measurements.width;

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <PinnedComponent
          key={`pinned_bubble_${item.id}_${item.__type}`}
          size={size}
          bubble={item}
          openThread={() => props.openThread(item.id)}
        />
      ))}
    </View>
  );
}

function PinnedComponent(props) {
  const {size, bubble} = props;

  const {
    image,
    member_names,
    name,
    latest_message, // New field for bubbles
    latest_author_uid,
    latest_timestamp_ms,
  } = bubble;
  const latestAuthor = (member_names || {})[latest_author_uid] || {}; // Error proof

  const nameToShow = name || getMemberNames(member_names);

  const userLastOpened = latestAuthor.offline_timestamp_ms; // When the user last visited the conversation
  const stillInBubble =
    latestAuthor.offline_timestamp_ms < latestAuthor.online_timestamp_ms;
  const unread = userLastOpened < latest_timestamp_ms && !stillInBubble;
  const latestMessage = latest_message || {};

  return (
    <TouchableOpacity
      key={`pinned_conversation_${props.index}`}
      style={[styles.componentContainer, {width: size}]}
      onPress={() => props.openThread(bubble.id)}>
      <View style={styles.componentImageWrapper}>
        {image ? (
          <GlobalStyle.UI.Image
            style={[
              styles.componentImage,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
            source={{uri: image}}
          />
        ) : (
          <UserImage user={latestAuthor} style={{height: size, width: size}} />
        )}
      </View>
      <Text style={styles.componentTitle} numberOfLines={2}>
        {nameToShow}
      </Text>
      {unread && latestMessage && (
        <View style={styles.componentMessageContainer}>
          {latestMessage.image ? (
            <GlobalStyle.UI.Image
              source={{uri: latestMessage.image}}
              style={{height: size * 0.4, width: size * 0.4, borderRadius: 5}}
            />
          ) : latestMessage.video ? (
            <GlobalStyle.UI.Video
              source={{uri: latestMessage.video}}
              style={{height: size * 0.4, width: size * 0.4, borderRadius: 5}}
            />
          ) : (
            <Text style={styles.componentMessageText} numberOfLines={2}>
              {latestMessage.text}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const PINNED_SIZE = GlobalStyle.Measurements.width * 0.2;

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    paddingHorizontal: GlobalStyle.Measurements.margin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    // marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  componentContainer: {
    width: PINNED_SIZE,
    marginHorizontal: 7.5,
    marginVertical: 7.5,
  },
  componentImage: {
    width: PINNED_SIZE,
    height: PINNED_SIZE,
    borderRadius: PINNED_SIZE / 2,
  },
  componentImageWrapper: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  componentTitle: {
    ...GlobalStyle.TextStyle.bodyMedium,
    width: PINNED_SIZE,

    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  componentMessageContainer: {
    position: 'absolute',
    alignSelf: 'flex-start',

    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    marginTop: -10,

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  componentMessageText: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
});
