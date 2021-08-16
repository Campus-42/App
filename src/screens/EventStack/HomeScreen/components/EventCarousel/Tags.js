import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';

export const Tags = (props) => {
  return (
    <View style={styles.container}>
      {props.data.map((elem) => {
        return (
          <View
            key={elem}
            style={[
              styles.tagContainer,
              {
                backgroundColor:
                  (props.tagColors !== false || props.tagColors.length > 0) &&
                  props.tagColors[elem] !== undefined
                    ? props.tagColors[elem] + '40'
                    : props.colors.main + '30',
              },
            ]}>
            <Text
              style={[
                styles.text,
                {
                  color:
                    (props.tagColors !== false || props.tagColors.length > 0) &&
                    props.tagColors[elem] !== undefined
                      ? props.tagColors[elem]
                      : props.colors.main,
                },
              ]}>
              {elem}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...GlobalStyle.ViewStyle.rowContainer,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    maxHeight:
      (GlobalStyle.TextStyle.bodySmall.fontSize +
        (GlobalStyle.Measurements.marginHalf / 3) * 2 +
        5) *
      2,
    // marginVertical: GlobalStyle.Measurements.marginQuarter,
    width: GlobalStyle.Measurements.width * 0.45,
    flexWrap: 'wrap',
  },
  tagContainer: {
    padding: GlobalStyle.Measurements.marginHalf / 3,
    paddingHorizontal: GlobalStyle.Measurements.marginHalf / 2,
    borderRadius: 6,
    marginRight: 5,
    backgroundColor: '#eee',
    marginVertical: 2.5,
    backgroundColor: GlobalStyle.Palettes.background.palette5,
  },
  text: {
    ...GlobalStyle.TextStyle.bodySmall,
  },
});
