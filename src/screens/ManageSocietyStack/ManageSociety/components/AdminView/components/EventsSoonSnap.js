import React from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from '../style';
import TouchableShrink from '../../../../../../assets/TouchableShrink/TouchableShrink';
import LinearGradient from 'react-native-linear-gradient';
import {GlobalStyle} from '../../../../../../assets/GlobalStyle';
import {EventSnap} from '../../../../../EventStack/HomeScreen/components/EventCarousel/EventSnap';
import {Store} from '../../../../../../assets/redux/store';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const EventsSoonSnap = (props) => {
  function openEvent() {
    Store.dispatch({type: 'UPDATE_EDIT_EVENT_FOCUS', payload: props.item});
    props.navigate('Live Event');
  }
  function openScanner() {
    Store.dispatch({type: 'UPDATE_EDIT_EVENT_FOCUS', payload: props.item});
    Store.dispatch({
      type: 'UPDATE_TICKET_SCANNER_EVENT',
      payload: props.item.id,
    });
    props.navigate('Ticket Scanner');
  }
  return (
    <View style={styles.eventsSoonContainer}>
      <EventSnap
        data={props.item}
        openEvent={openEvent}
        colors={props.colors}
        tagColors={props.tagColors}
        bookmarks={props.bookmarks}
      />
      <TouchableShrink
        triggerHaptic
        style={styles.eventsSoonContainerLower}
        onPress={openScanner}>
        <LinearGradient
          colors={[`${props.colors.main}70`, props.colors.main]}
          start={{y: 1, x: 0}}
          end={{y: 0.7, x: 0.6}}
          style={styles.eventsSoonIconContainer}>
          <MaterialCommunityIcons
            name={'qrcode-scan'}
            size={styles.eventsSoonIcon.width}
            color={'#fff'}
          />
        </LinearGradient>
        <Text style={[GlobalStyle.TextStyle.buttonLarge, {color: '#000'}]}>
          Scan Tickets
        </Text>
      </TouchableShrink>
    </View>
  );
};
