import React from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {GlobalStyle} from '../GlobalStyle';
import Animation from '../Images/friend-notification.json';
import {styles} from './style';

export function InviteAnimation(props) {
  return (
    <View style={styles.inviteNotificationContainer}>
      {/* <Text
        style={[GlobalStyle.TextStyle.bodyMedium, {textAlign: 'center'}]}>
        {'Invite friends and earn points'}
      </Text> */}
      <LottieView
        source={Animation}
        style={styles.inviteAnimation}
        autoPlay
        loop
      />
    </View>
  );
}
