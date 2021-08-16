import React from 'react';
import PropTypes from 'prop-types';
import {Pressable, View} from 'react-native';
import RNVideo from 'react-native-video';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Measurements} from '../Measurements';
import {Palettes} from '../ColorStyle';

export function Video(props) {
  const video = React.useRef();
  const [paused, setPaused] = React.useState(false);

  return (
    <Pressable
      onPress={() => video.current.presentFullscreenPlayer()}
      style={{alignItems: 'center', justifyContent: 'center'}}>
      <RNVideo
        ref={video}
        {...props}
        paused={paused}
        repeat
        onLoad={() => setPaused(true)}
        onFullscreenPlayerWillDismiss={() => setPaused(true)}
        onFullscreenPlayerWillPresent={() => setPaused(false)}
      />
      {paused && (
        <Pressable
          onPress={() => video.current.presentFullscreenPlayer()}
          style={{
            position: 'absolute',
            backgroundColor: '#e5e5e5',
            padding: 15,
            borderRadius: 100,
          }}>
          <FontAwesome5Icon
            name={'play'}
            color={Palettes.inverseBackground.palette6}
            size={Measurements.unit / 1.5}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

Video.defaultProps = {
  source: {uri: false},
};
Video.propTypes = {
  source: PropTypes.object,
};
