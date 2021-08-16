import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {MessageRow} from '../../../Bubbles/Bubbles/components/MessageRow';
import {localCarouselStyles} from './EventCarousel/EventCarousel';

export function UnreadMessages(props) {
  function navigate() {
    props.navigation.navigate('Bubbles');
  }
  return (
    <GlobalStyle.UI.Touchable style={styles.container} onPress={navigate}>
      {/* <Text style={localCarouselStyles.text}>You have unread messages</Text> */}
      <MessageRow
        info={props.selectedBubble}
        colors={props.colors}
        unread
        openThread={navigate}
      />
      {props.bubbles.length > 1 && (
        <Text style={styles.text}>
          + {props.bubbles.length - 1} more bubble
          {props.bubbles.length > 2 ? 's' : ''}
        </Text>
      )}
    </GlobalStyle.UI.Touchable>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',

    // alignSelf: 'center',

    marginVertical: GlobalStyle.Measurements.margin,
  },
  iconWrapper: {
    padding: 7,
    borderRadius: 100,
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: GlobalStyle.Palettes.text.palette4,
    marginHorizontal: GlobalStyle.Measurements.marginHalf,
    alignSelf: 'center',
  },
});
