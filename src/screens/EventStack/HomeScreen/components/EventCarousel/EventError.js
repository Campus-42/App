import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {styles as eventStyles} from './EventSnap';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import LottieView from 'lottie-react-native';
import EmptyBox from '../../../../../assets/Images/empty-box.json';

export const EventError = (props) => {
  return (
    <View
      style={[
        styles.imageContainer,
        {backgroundColor: GlobalStyle.Palettes.background.palette6},
      ]}>
      <LottieView
        style={{
          height: eventStyles.container.height * 0.6,
          width: eventStyles.container.width * 0.6,
          marginTop: GlobalStyle.Measurements.marginHalf,
        }}
        autoPlay
        loop
        source={EmptyBox}
      />
      <View style={[styles.imageContainer, {position: 'absolute'}]}>
        <Text style={GlobalStyle.TextStyle.bodyLarge}>{props.text}</Text>
        {props.showButton && (
          <TouchableOpacity onPress={props.focusSearch}>
            <Text
              style={[
                GlobalStyle.TextStyle.bodyLarge,
                {color: GlobalStyle.ColorStyle.blueButtonText},
              ]}>
              {props.buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    ...eventStyles.container,
    resizeMode: 'contain',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: eventStyles.container.height,
    minWidth: eventStyles.container.width,
    backgroundColor: '#00000000',
  },
});

EventError.defaultProps = {
  buttonText: 'Search event',
  showButton: true,
};
