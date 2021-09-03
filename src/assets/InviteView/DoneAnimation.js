import React from 'react';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {GlobalStyle} from '../GlobalStyle';
import Animation from '../Images/confirmation-animation.json';
import {styles} from './style';

export function DoneAnimation() {
  return (
    <View style={styles.inviteNotificationContainer}>
      <LottieView
        source={Animation}
        style={styles.doneAnimation}
        autoPlay
        loop={false}
      />
      <Text
        style={[GlobalStyle.TextStyle.bodyLargeBold, {textAlign: 'center'}]}>
        Invitations have been sent
      </Text>
    </View>
  );
}
