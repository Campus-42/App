import React from 'react';
import {TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import {ColorStyle} from '../ColorStyle';

export const SIZE = 13;

export function PlusButton(props) {
  return (
    <TouchableOpacity
      style={{
        height: SIZE * 1.8,
        width: SIZE * 1.8,
        borderRadius: SIZE,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: ColorStyle.blueButtonText,
      }}
      onPress={props.onPress}>
      <FontAwesome5Icon name={'plus'} color={'#fff'} size={SIZE} />
    </TouchableOpacity>
  );
}

PlusButton.defaultProps = {
  onPress: () => {},
};

PlusButton.propTypes = {
  onPress: PropTypes.func,
};
