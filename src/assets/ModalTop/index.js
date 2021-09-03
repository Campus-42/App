import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {TextTickerAnimation} from '../TextTicker';
import {Measurements} from '../GlobalStyle/Measurements';
import {ColorStyle, Palettes} from '../GlobalStyle/ColorStyle';
import {TextStyle} from '../GlobalStyle/TextStyle';
import {BookmarkButton} from '../GlobalStyle/UI/BookmarkButton';
import Entypo from 'react-native-vector-icons/Entypo';
import {GlobalStyle} from '../GlobalStyle';

export const ModalTop = (props) => {
  const isLoading = props.title.length == 0;
  
  return (
    <View style={styles.container} onLayout={props.onLayout || false}>
      {props.bookmarks !== undefined && props.title.length > 0 && (
        <BookmarkButton
          bookmarks={props.bookmarks}
          type={props.bookmarkType}
          objId={props.objId}
        />
      )}
      <Pressable
        style={styles.titleContainer}
        onPress={props.onTitlePress !== null && props.onTitlePress}
        disabled={props.onTitlePress == null}>
        <SkeletonContent
          isLoading={isLoading}
          containerStyle={styles.skeleton}
          layout={[
            {
              key: 'title_modal',
              width: styles.title.width,
              height: Measurements.safeheight * 0.025,
              marginBottom: 3,
            },
          ]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
            style={styles.title}>
            {props.title}
          </Text>
        </SkeletonContent>
        {props.subTitle !== null && (
          <SkeletonContent
            isLoading={isLoading}
            containerStyle={styles.skeleton}
            layout={[
              {
                key: 'subtitle_modal',
                width: styles.subTitle.width,
                height: Measurements.safeheight * 0.015,
                marginTop: 3,
              },
            ]}>
            <Text numberOfLines={1} style={styles.subTitle}>
              {props.subTitle}
            </Text>
          </SkeletonContent>
        )}
      </Pressable>
      <TouchableOpacity
        onPress={props.onPress}
        style={{padding: 10, marginRight: 5}}>
        <Ionicons
          name="chevron-down"
          size={Measurements.unit * 1.3}
          color={ColorStyle.blueButtonText}
        />
      </TouchableOpacity>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    height: Measurements.height * 0.08,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
    backgroundColor: Palettes.background.palette6,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  skeleton: {
    margin: 0,
    padding: 0,
  },

  title: {
    ...TextStyle.headingMedium,
    width: Measurements.width * 0.75 - Measurements.margin,
    textAlign: 'left',
  },
  subTitle: {
    ...TextStyle.bodySmall,
    width: Measurements.width * 0.7 - Measurements.margin,
    color: Palettes.text.palette5,
    textAlign: 'left',
  },
  buttonText: {
    ...TextStyle.buttonMedium,
    width: Measurements.width * 0.2 - Measurements.margin,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#24a0ed',
  },
});

ModalTop.defaultProps = {
  showButton: false,
  onPress: () => {},
  buttonText: 'Done',
  title: 'Title',
  subTitle: null,
  onTitlePress: null,

  bookmarks: undefined,
  objId: false,
  bookmarkType: undefined,
};

ModalTop.propTypes = {
  showButton: PropTypes.bool,
  onPress: PropTypes.func,
  buttonText: PropTypes.string,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  onTitlePress: PropTypes.func,

  bookmarks: PropTypes.object,
  objId: PropTypes.string,
  bookmarkType: PropTypes.string,
};
