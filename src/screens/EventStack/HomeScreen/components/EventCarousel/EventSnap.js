import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Time} from './Time';
import {Tags} from './Tags';
import {GlobalStyle} from '../../../../../assets/GlobalStyle';
import {DateFuncs} from '../../../../../assets/Date';
import Entypo from 'react-native-vector-icons/Entypo';

export const EventSnap = (props) => {
  const pressable = React.useRef();
  const times = DateFuncs.getTimeInterval(
    props.data.date.start,
    props.data.date.end,
  );

  // Get the redux participants else get the initially passed participants
  // Redux is either false or filled in event data
  const participants = props.reduxEvent.participants || props.data.participants;

  const [weekday, setWeekday] = React.useState('');
  DateFuncs.getWeekday(props.data.date.start).then((date) => setWeekday(date));

  function onPress() {
    props.shouldOnPress && props.openEvent(props.data);
  }

  const {name: locName, address: locAddress} = props.data.location;

  return (
    <View style={{padding: 5}}>
      <GlobalStyle.UI.Touchable
        ref={pressable}
        key={'EventSnapTouchable_' + props.data.id}
        onPress={onPress}
        allowDoublePress={props.allowDoublePress}
        onDoublePress={props.onDoublePress}
        onLongPress={props.onLongPress}
        style={[
          styles.container,
          props.style,
          props.showShadow && {
            shadowColor: GlobalStyle.Palettes.inverseBackground.palette6,
            shadowOffset: {width: 0, height: 5},
            shadowOpacity: 0.15,
            shadowRadius: 7,
            elevation: 3,
          },
        ]}
        {...props.touchableProps}>
        <GlobalStyle.UI.Image
          source={{uri: props.data.images.preview}}
          style={styles.image}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {props.data.title}
          </Text>
          {participants.length > 0 ? (
            <GlobalStyle.UI.PreviewUsers
              users={participants}
              size={'regular'}
              colors={props.colors}
            />
          ) : props.data.location.show ? (
            <View style={styles.locationContainer}>
              <Entypo
                name={'location-pin'}
                size={GlobalStyle.Measurements.unit * 1}
                color={LOCATION_PREVIEW_COLOR}
                style={styles.locationShadow}
              />
              <Text
                numberOfLines={2}
                style={[styles.locationText, styles.locationShadow]}>
                {locName != '' ? `${locName}, ` : ''}
                {locAddress}
              </Text>
            </View>
          ) : (
            <Tags
              tagColors={props.tagColors}
              colors={props.colors}
              data={props.data.tags}
            />
          )}
          <View style={styles.infoRow}>
            <Text style={styles.text}>
              {weekday} {times}
            </Text>
            <GlobalStyle.UI.BookmarkSnap
              type={'event'}
              objId={props.data.id}
              bookmarks={props.bookmarks}
              dontShow={props.dontShowBookmark}
            />
          </View>
        </View>
      </GlobalStyle.UI.Touchable>
      <Time
        date={props.data.date.start}
        borderRadius={styles.container.borderRadius}
        colors={props.colors}
      />
    </View>
  );
};
/**
 * Specify default props and prop types
 */
EventSnap.defaultProps = {
  shouldOnPress: true, // If the onPress should be recognized
  openEvent: (x) => {},
  style: {},
  data: {
    // EVENT DATA BELOW
    title: '',
    id: '',
    images: {
      preview: '',
      background: '',
    },
    pricing: {show: false, price: 0, currency: '£'},
    tags: [],
    date: {start: new Date(), end: new Date()},
    description: '',
    repeat: {
      doesRepeat: false,
      interval: 0, // Days
    },
    link: {show: false, url: ''},
    location: {
      latitude: 51.9986,
      longitude: -0.989,
      name: '',
      address: '',
    },
    number_of_participants: 0,
  },
  touchableProps: {},
  shrinkFactor: 0.9,
  showShadow: false,
  reduxEvent: false,
  onLongPress: undefined,
  onDoublePress: undefined,
  allowDoublePress: false,
  dontShowBookmark: false,
};
EventSnap.propTypes = {
  shouldOnPress: PropTypes.bool,
  openEvent: PropTypes.func,
  style: PropTypes.object,
  shrinkFactor: PropTypes.number,
  onLongPress: PropTypes.func,
  onDoublePress: PropTypes.func,
  allowDoublePress: PropTypes.bool,
  touchableProps: PropTypes.object,
  dontShowBookmark: PropTypes.bool,
};
const WIDTH = GlobalStyle.Measurements.width * 0.8;
const MARGIN = GlobalStyle.Measurements.marginHalf;
const LOCATION_PREVIEW_COLOR = '#fd20e1';

export const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: GlobalStyle.Measurements.unit * 7,
    borderRadius: GlobalStyle.Measurements.unit ,
    padding: MARGIN,
    flexDirection: 'row',
    backgroundColor: GlobalStyle.Palettes.background.palette6,

    shadowColor: '#aaa',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  rightContainer: {
    width: (WIDTH / 3) * 2 - MARGIN * 2,
    marginLeft: MARGIN,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  image: {
    width: WIDTH / 3 - MARGIN,
    height: GlobalStyle.Measurements.unit * 7 - MARGIN * 2,
    borderRadius: GlobalStyle.Measurements.unit / 2,

    backgroundColor: GlobalStyle.ColorStyle.boneColor,
    resizeMode: 'cover',
  },
  title: {
    ...GlobalStyle.TextStyle.bodyLargeBold,
    marginBottom: MARGIN,
    maxWidth: (WIDTH / 3) * 2 - MARGIN * 3,
  },
  text: {
    ...GlobalStyle.TextStyle.bodyRegular,
    fontWeight: '400',
    color: GlobalStyle.Palettes.text.palette4,
    marginVertical: GlobalStyle.Measurements.marginQuarter,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: WIDTH * (2 / 3) - MARGIN * 2,
  },
  locationText: {
    ...GlobalStyle.TextStyle.bodySmall,
    color: LOCATION_PREVIEW_COLOR,

    width: WIDTH * (2 / 3) - MARGIN * 4,
  },
  locationShadow: {
    shadowColor: LOCATION_PREVIEW_COLOR,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});
