import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import FriendsAnimation from '../../../../../assets/Images/friend-notification.json';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';

export const NotAdminView = (props) => {
  return (
    <View>
      <LottieView
        source={FriendsAnimation}
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: GlobalStyle.Measurements.width * 0.4,
    height: GlobalStyle.Measurements.height * 0.3,
    alignSelf: 'center',
    marginVertical: GlobalStyle.Measurements.marginHalf,
  },
});
