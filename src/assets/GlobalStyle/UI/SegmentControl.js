import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Measurements} from '../Measurements';
import {Palettes} from '../ColorStyle';
import {TextStyle} from '../TextStyle';
import RNSegmentControl from '@react-native-community/segmented-control';

export function SegmentControl(props) {
  function onChange({nativeEvent}) {
    console.log('Segment control changes =>', nativeEvent.selectedSegmentIndex);
    props.onIndexChange(nativeEvent.value, nativeEvent.selectedSegmentIndex);
  }
  return (
    <RNSegmentControl
      selectedIndex={0}
      style={styles.container}
      values={props.segments}
      onChange={onChange}
    />
  );
  // <RNSegmentControl
  //   style={styles.container}
  //   inactiveTintColor={'#000'}
  //   activeTintColor={'#000'}
  //   initialSelectedName={'0'}
  //   onChangeValue={props.onIndexChange}>
  //   {props.segments.map((seg, index) => (
  //     <Segment name={index.toString()} content={seg} />
  //   ))}
  // </RNSegmentControl>
}

SegmentControl.defaultProps = {
  index: 0,
  segments: [],
  onIndexChange: () => {},
  style: {},
};
SegmentControl.propTypes = {
  index: PropTypes.number.isRequired,
  segments: PropTypes.array,
  onIndexChange: PropTypes.func.isRequired,
  style: PropTypes.object,
};

const height = Measurements.height * 0.04;
const width = Measurements.width * 0.8;
const margin = 2.5;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Palettes.background.palette5,
    alignSelf: 'center',
    marginVertical: Measurements.margin,
    borderRadius: height / 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentView: {
    height: height - margin * 2,
    borderRadius: height / 4.2,
    margin: margin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSegmentView: {
    backgroundColor: Palettes.background.palette6,
  },
  segmentText: {
    ...TextStyle.buttonSmall,
    fontSize: height / 2.5,
  },
});
