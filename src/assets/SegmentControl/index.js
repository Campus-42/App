import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyle} from '../GlobalStyle';

export function SegmentControl(props) {
  const widths = (styles.container.width - margin * 4) / props.segments.length;
  const badgeIndexes = props.badgeIndexes || []; // Indexes that show show badge, e.g. [true, false, false]
  return (
    <View
      style={[styles.container, {width: widths * props.segments.length}]}
      onLayout={props.onLayout}>
      {props.segments.map((segment, index) => (
        <View key={`segment_control_${index}`}>
          <TouchableOpacity
            onPress={() => props.onIndexChange(index)}
            activeOpacity={0.8}
            style={[
              styles.segmentView,
              {width: widths * 0.9},
              index == props.index && styles.selectedSegmentView,
            ]}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={[
                styles.segmentText,
                index != props.index && {fontWeight: '400'},
              ]}>
              {segment}
            </Text>
          </TouchableOpacity>
          {index !== props.index && badgeIndexes[index] && (
            <GlobalStyle.UI.InAppBadge
              size={'xsmall'}
              style={{marginTop: -2, position: 'absolute', marginLeft: 0}}
            />
          )}
        </View>
      ))}
    </View>
  );
}

SegmentControl.defaultProps = {
  index: 0,
  segments: [],
  onIndexChange: () => {},
  style: {},
  onLayout: () => {},
  badgeIndexes: [],
};
SegmentControl.propTypes = {
  index: PropTypes.number.isRequired,
  segments: PropTypes.array,
  onIndexChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  onLayout: PropTypes.func,
  badgeIndexes: PropTypes.array,
};

const height = GlobalStyle.Measurements.height * 0.04;
const width = GlobalStyle.Measurements.width * 0.9;
const margin = 2.5;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: GlobalStyle.Palettes.background.palette4,
    alignSelf: 'center',
    marginTop: GlobalStyle.Measurements.margin,
    borderRadius: height / 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: GlobalStyle.Measurements.marginHalf,
  },
  segmentView: {
    height: height - margin * 2,
    borderRadius: height / 4.2,
    margin: margin,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  selectedSegmentView: {
    backgroundColor: GlobalStyle.Palettes.background.palette6,
  },
  segmentText: {
    ...GlobalStyle.TextStyle.buttonSmall,
    fontSize: height / 2.85,
    alignSelf: 'center',
  },
});
