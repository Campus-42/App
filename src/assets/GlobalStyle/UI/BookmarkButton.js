import React from 'react';
import {View, ActivityIndicator, StyleSheet, Alert, Text} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';
import {Touchable} from './Touchable';
import {Measurements} from '../Measurements';
import {Campus} from '../../Campus';
import {analytics} from '../../Analytics';
import {ButtonStyle} from '../ButtonStyle';
import {Palettes, ColorStyle} from '../ColorStyle';
import {TextStyle} from '../TextStyle';

const ICON_SIZE = Measurements.unit;
const ICON_SIZE_SMALL = Measurements.unit / 1.2;

export function BookmarkButton(props) {
  const [loading, setLoading] = React.useState(false);

  const bookmarks = {...(props.bookmarks || {})};
  const bookmarked = (bookmarks[props.type] || []).includes(props.objId);
  function onPress() {
    handlePress(props, setLoading, bookmarked);
  }

  return (
    <Touchable onPress={onPress} style={styles.container} disabled={loading}>
      {loading ? (
        <ActivityIndicator color={ColorStyle.candyRed} size={ICON_SIZE} />
      ) : (
        <Icon
          name={bookmarked ? 'heart' : 'heart-outline'}
          size={ICON_SIZE}
          color={ColorStyle.candyRed}
        />
      )}
    </Touchable>
  );
}

export function BookmarkSnap(props) {
  const [loading, setLoading] = React.useState(false);

  const bookmarks = {...(props.bookmarks || {})};
  const bookmarked = (bookmarks[props.type] || []).includes(props.objId);
  function onPress() {
    handlePress(props, setLoading, bookmarked);
  }

  return props.dontShow !== true ? (
    <Touchable
      style={[
        styles.snapContainer,
        bookmarked && {backgroundColor: `${ColorStyle.candyRed}20`},
      ]}
      onPress={onPress}
      hitSlop={8}>
      {loading ? (
        <ActivityIndicator
          color={ColorStyle.candyRed}
          size={ICON_SIZE_SMALL * 0.75}
          style={{maxHeight: ICON_SIZE_SMALL, maxWidth: ICON_SIZE_SMALL}}
        />
      ) : (
        <Icon
          name={bookmarked ? 'heart' : 'heart-outline'}
          size={ICON_SIZE_SMALL}
          color={bookmarked ? ColorStyle.candyRed : '#aaa'}
        />
      )}
    </Touchable>
  ) : null;
}

function handlePress(props, setLoading, isBookmarked) {
  setLoading(true);
  const check = props.type && props.objId;

  if (!check) {
    Alert.alert(
      'Bookmark Error',
      `Something went wrong bookmarking this ${props.type}`,
    );
    analytics.error(
      {msg: 'One or more of required props were ill defined', props: props},
      'BookmarkButton',
    );
    setLoading(false);
  } else {
    Campus.Funcs.user
      .toggleBookmark(props.objId, props.type, !isBookmarked)
      .finally(() => setLoading(false));
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  iconWrapper: {
    padding: 7,
    borderRadius: 100,
    backgroundColor: `${ColorStyle.candyRed}10`,
  },
  text: {
    ...TextStyle.buttonMedium,
    fontWeight: '500',
    color: `${ColorStyle.candyRed}95`,
  },
  snapContainer: {
    // position: 'absolute',
    // alignSelf: 'flex-end',

    alignItems: 'center',
    justifyContent: 'center',

    padding: 6.5,
    width: ICON_SIZE_SMALL + 6.5 * 2,
    height: ICON_SIZE_SMALL + 6.5 * 2,

    backgroundColor: Palettes.background.palette6,
    borderRadius: ICON_SIZE_SMALL * 2,
  },
});

BookmarkButton.defaultProps = {
  bookmarks: undefined,
  type: undefined,
  objId: undefined,
  dontShow: false,
};
BookmarkButton.propTypes = {
  bookmarks: PropTypes.object,
  type: PropTypes.string,
  objId: PropTypes.string,
  dontShow: PropTypes.bool,
};
BookmarkSnap.defaultProps = {
  bookmarks: undefined,
  type: undefined,
  objId: undefined,
  dontShow: false,
};
BookmarkSnap.propTypes = {
  bookmarks: PropTypes.object,
  type: PropTypes.string,
  objId: PropTypes.string,
  dontShow: PropTypes.bool,
};
