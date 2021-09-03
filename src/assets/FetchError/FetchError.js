import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import FetchErrorAnimation from '../Images/fetch-data-error.json';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const FetchError = (props) => {
  return (
    <View style={styles.container}>
      <LottieView source={FetchErrorAnimation} loop autoSize autoPlay />
      <Text
        style={[
          GlobalStyle.TextStyle.bodyRegular,
          {
            textAlign: 'center',
            marginVertical: GlobalStyle.Measurements.margin,
            lineHeight: Dimensions.get('screen').fontScale * 30,
            marginTop: GlobalStyle.Measurements.margin * 2,
          },
        ]}>
        {props.errorText}
      </Text>

      {props.showButton && (
        <TouchableOpacity onPress={props.onPress}>
          <Text style={styles.buttonText}>Reload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

FetchError.defaultProps = {
  onPress: () => {},
  showButton: false,
  errorText: 'Something went wrong fetching your data\nPlease try again',
};
FetchError.propTypes = {
  onPress: PropTypes.func,
  showButton: PropTypes.bool,
  errorText: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...GlobalStyle.TextStyle.bodyLarge,
    color: GlobalStyle.ColorStyle.blueButtonText,
  },
});
