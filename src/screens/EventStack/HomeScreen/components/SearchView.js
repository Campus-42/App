import React from 'react';
import {View} from 'react-native';
import {styles} from '../style';
import {EmptyBox} from '../../../../assets/EmptyAnimation';
import {FetchError} from '../../../../assets/FetchError/FetchError';
import * as Animatable from 'react-native-animatable';
import PropTypes from 'prop-types';
import {LoadingCircle} from '../../../../assets/LottieAnims/loading';
import {EventSnap} from './EventCarousel/EventSnap';
import {GlobalStyle} from '../../../../assets/GlobalStyle';

export const SearchView = (props) => {
  return (
    <View style={styles.search}>
      {(props.searched || props.events.length > 0) &&
        (props.error && props.textInputIsFocused === false ? (
          <View style={{marginTop: GlobalStyle.Measurements.margin}}>
            <FetchError
              errorText={
                "We couldn't search for your events\nCheck internet and try again"
              }
            />
          </View>
        ) : props.loading ? (
          <LoadingCircle loading={true} />
        ) : props.events.length > 0 ? (
          props.events.map((event, index) => (
            <Animatable.View
              style={styles.eventSnapSearch}
              animation={'fadeInUpBig'}
              duration={350}
              delay={index * 50}>
              <EventSnap
                bookmarks={props.bookmarks}
                reduxEvent={props.reduxEvents[event.id]}
                colors={props.colors}
                data={event}
                tagColors={props.tagColors}
                shouldOnPress
                openEvent={props.openEvent}
              />
            </Animatable.View>
          ))
        ) : (
          props.textInputIsFocused === false && (
            <View style={{marginTop: GlobalStyle.Measurements.margin}}>
              <EmptyBox />
            </View>
          )
        ))}
    </View>
  );
};

SearchView.defaultProps = {
  searchTerm: '',
  campusKey: 'university_of_buckingham',
  tags: ['Academic', 'Friends'],
  events: [],
  error: false,
  loading: false,
  textInputIsFocused: false,
};
SearchView.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  campusKey: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
  error: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  textInputIsFocused: PropTypes.bool.isRequired,
};
