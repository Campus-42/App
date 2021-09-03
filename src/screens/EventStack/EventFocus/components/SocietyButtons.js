import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {WebButton} from '../../../JoinedSocietyStack/SocietyFocus/components/WebButton';
import {ChatButton} from '../../../JoinedSocietyStack/SocietyFocus/components/ChatButton';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {auth} from '../../../../assets/Firebase/Firebase';
import {Store} from '../../../../assets/redux/store';

export function SocietyButtons(props) {
  return (
    <View style={{alignItems: 'center'}}>
      <GlobalStyle.UI.GreyBackgroundButton
        title={'Show society'}
        onPress={props.showSocietyPreview}
      />

      {props.society.link.show && (
        <WebButton
          navigation={props.navigation}
          showShadow
          // shadowOpacity={0.1}
          link={props.society.link.url}
        />
      )}
      {props.society.whatsapp_link !== '' && (
        <ChatButton
          showShadow
          // shadowOpacity={0.1}
          colors={props.colors}
          link={props.society.whatsapp_link}
        />
      )}
      {/* {props.society.exec_members.includes(auth.currentUser.uid) && (
        <GlobalStyle.UI.GreyBackgroundButton
          onPress={() => {
            Store.dispatch({
              type: 'UPDATE_EDIT_EVENT_FOCUS',
              payload: props.event,
            });
            props.navigation.push('Edit Event');
            Store.dispatch({
              type: 'UPDATE_EDIT_EVENT_FOCUS',
              payload: props.event,
            });
          }}
          title={'Edit Event'}
        />
      )} */}
    </View>
  );
}
