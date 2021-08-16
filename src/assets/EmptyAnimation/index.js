import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LottieView from 'lottie-react-native';
import EmptyAnimation from '../Images/empty-box.json';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native-gesture-handler';

export const EmptyBox = (props) => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.lottie}>
        <LottieView source={EmptyAnimation} loop autoSize autoPlay />
      </View>
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
          <Text style={styles.buttonText}>{props.buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

EmptyBox.defaultProps = {
  onPress: () => {},
  showButton: false,
  style: {},
  buttonText: 'Reload',
  errorText: "We looked everywhere in the galaxy but we couldn't find anything",
};
EmptyBox.propTypes = {
  onPress: PropTypes.func,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  errorText: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: GlobalStyle.Measurements.width,
    paddingHorizontal: GlobalStyle.Measurements.width * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...GlobalStyle.TextStyle.bodyLarge,
    color: GlobalStyle.ColorStyle.blueButtonText,
  },
  lottie: {
    // backgroundColor: '#2b3769',
    backgroundColor: '#aaa',
    borderRadius: 100,
    padding: GlobalStyle.Measurements.unit / 2,
  },
});
