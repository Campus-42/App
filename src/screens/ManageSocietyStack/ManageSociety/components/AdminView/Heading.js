import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  ProgressViewIOSComponent,
} from 'react-native';
import {View} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';

export const Heading = (props) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: props.colors.main}]}>
        {props.title}
      </Text>
      <Text style={styles.text}>
        {props.screen == 'manage'
          ? subTitles[props.admin]
          : props.screen == 'join' && props.subtitle}
      </Text>
    </View>
  );
};

const subTitles = {
  true:
    'You can manage your societies here, such as create new events or write an engaging blog for your members',
  false:
    'You are currently not a society executive. Create a society and improve your campus life',
};
Heading.defaultProps = {
  title: 'Manage Your Societies',
  screen: 'manage',
  admin: false,
  subtitle: '',
};

export const styles = StyleSheet.create({
  title: {
    ...GlobalStyle.TextStyle.headingLarge,
    marginVertical: GlobalStyle.Measurements.margin,
    fontSize: Dimensions.get('screen').fontScale * 26,
    textAlign: 'center',
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    marginVertical: GlobalStyle.Measurements.marginHalf,
    textAlign: 'center',
  },
  container: {
    width: GlobalStyle.Measurements.width * 0.9,
    marginHorizontal: GlobalStyle.Measurements.width * 0.05,
    alignItems: 'center',
  },
});
