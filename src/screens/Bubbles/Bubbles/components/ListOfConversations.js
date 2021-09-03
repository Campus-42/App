import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {View, StyleSheet} from 'react-native';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import Entypo from 'react-native-vector-icons/Entypo';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {MessageRow} from './MessageRow';
import {styles as bubbleStyles} from '../style';
import {RefreshControl} from 'react-native';
import {PinnedBubblesAndChannels} from './PinnedBubblesAndChannels';
import {Campus} from '../../../../assets/Campus';
import {ActivityIndicator} from 'react-native';
import {MESSAGE_ROW_MARGIN, styles as extStyles} from '../style';
import {EmptyBox} from '../../../../assets/EmptyAnimation';

export function ListOfConversations(props) {
  /**
   * This component shows the list of conversations
   * in bubbles and channels alike. The type prop
   * will constitute some styling changes between
   * the type 'bubbles' or 'channels'.
   *
   * It will be a semi-dumb component and only render
   * the message row with limited interactive features:
   * - navigate to
   * - pin conversation
   *
   * Important props are:
   * - data (normal list of conversations)
   * - pinnedData (list of pinned conversations)
   * - type (type of conversations)
   */

  const {type, data, pinnedData, colors} = props;

  const [pendingPinning, setPendingPinning] = React.useState([]); // Array of bubbles that are currently being pinned

  function openThread(id) {
    props.openThread(id, type);
  }

  function renderItem({item, index}, map) {
    function togglePinned(bubbleId, shouldPin) {
      setPendingPinning([...pendingPinning, item.id]);
      Campus.Funcs.user
        .toggleBookmark(bubbleId, type, shouldPin)
        .then(console.log)
        .catch(console.warn)
        .finally(() => {
          // Force close before updating pending
          const rowKey = `swipeable_conversations_list_${type}_${index}`;
          map[rowKey].closeRow();

          setPendingPinning(pendingPinning.filter((i) => i !== item.id));
        });
    }

    return (
      <SwipeRow
        style={{
          marginHorizontal: MESSAGE_ROW_MARGIN,
          marginVertical: MESSAGE_ROW_MARGIN / 3,
          flex: 1,
        }}
        leftOpenValue={styles.hiddenRowLeftContainer.width}
        disableLeftSwipe>
        <View style={styles.hiddenRowContainer}>
          <TouchableOpacity
            style={styles.hiddenRowLeftContainer}
            onPress={() => togglePinned(item.id, true)}>
            {pendingPinning.includes(item.id) ? (
              <ActivityIndicator
                size={styles.hiddenRowLeftContainer.width * 0.3}
              />
            ) : (
              <Entypo
                name={'pin'}
                size={styles.hiddenRowLeftContainer.width * 0.3}
                color={GlobalStyle.ColorStyle.pinColour}
              />
            )}
          </TouchableOpacity>
        </View>
        <MessageRow info={item} colors={colors} openThread={openThread} />
      </SwipeRow>
    );
  }

  return (
    <SwipeListView
      style={{
        paddingBottom:
        Platform.OS === 'android' && GlobalStyle.Measurements.height * 0.25,
        height:
          GlobalStyle.Measurements.height -
          props.heightDeductions.reduce((a, b) => a || 0 + b || 0), // reduce the array of layout heights
      }}
      contentInset={{
        bottom: GlobalStyle.Measurements.height * 0.25,
      }}
      keyExtractor={(_, index) =>
        `swipeable_conversations_list_${type}_${index}`
      }
      data={data}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          onRefresh={props.onRefresh}
          refreshing={props.refreshing}
        />
      }
      ListEmptyComponent={
        props.pinnedData.length === 0 &&
        props.init && (
          <EmptyBox
            errorText={`Looks like you are not a member of any ${props.type}`}
          />
        )
      }
      ListHeaderComponent={
        props.init && (
          <PinnedBubblesAndChannels data={pinnedData} openThread={openThread} />
        )
      }
      ListFooterComponent={
        props.onFooterPress && (
          <GlobalStyle.UI.TextButton
            title={props.footerText}
            onPress={props.onFooterPress}
          />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {},
  hiddenRowContainer: {
    width: GlobalStyle.Measurements.width - MESSAGE_ROW_MARGIN * 2,
    height: bubbleStyles.messagerowContainer.height,
    backgroundColor: GlobalStyle.Palettes.background.palette5,
    borderRadius: extStyles.messagerowContainer.borderRadius,

    alignSelf: 'center',

    flex: 1,
  },
  hiddenRowLeftContainer: {
    width: GlobalStyle.Measurements.width * 0.2,
    height: bubbleStyles.messagerowContainer.height,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
