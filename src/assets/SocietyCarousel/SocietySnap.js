import React from 'react';
import {Text, View, StyleSheet, Image, Dimensions} from 'react-native';
import {GlobalStyle} from '../GlobalStyle';
import PropTypes from 'prop-types';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {auth} from '../../assets/Firebase/Firebase';
import {Pressable} from 'react-native';
import {triggerHaptic} from '../Haptic/hapticFeedback';

export const SocietySnap = (props) => {
  const members = props.reduxSociety.members || props.data.members;

  return (
    <React.Fragment>
      <GlobalStyle.UI.Touchable
        key={`society_snap_pressable_${props.data.id}`}
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
        allowDoublePress={props.allowDoublePress}
        onPress={() => props.onPress(props.data)}
        onDoublePress={props.onDoublePress}>
        <GlobalStyle.UI.Image
          source={{
            uri: props.data.images.background || props.data.images.logo,
          }}
          style={styles.backgroundImage}
          {...props.touchableProps}
        />
        <View style={styles.infoContainer}>
          <View style={styles.imageAndTextContainer}>
            <GlobalStyle.UI.Image
              source={{uri: props.data.images.logo}}
              style={styles.logo}
            />
            <View style={styles.textContainer}>
              <Text
                style={GlobalStyle.TextStyle.bodyLargeBold}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}>
                {props.data.name}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Ionicon
                  name="ios-people"
                  size={GlobalStyle.Measurements.unit / 1.4}
                  color={GlobalStyle.Palettes.text.palette6}
                  style={{marginRight: GlobalStyle.Measurements.marginQuarter}}
                />
                <Text style={GlobalStyle.TextStyle.bodySmall}>
                  {members.length}
                </Text>
              </View>
            </View>
          </View>
          <GlobalStyle.UI.BookmarkSnap
            bookmarks={props.bookmarks}
            objId={props.data.id}
            type={'society'}
            dontShow={props.dontShowBookmark}
          />
        </View>
      </GlobalStyle.UI.Touchable>
      {props.data.exec_members.includes(
        auth.currentUser !== null ? auth.currentUser.uid : 'nothing',
      ) &&
        props.showExec && (
          <View style={styles.execView}>
            <Text numberOfLines={1} style={styles.execText}>
              Executive
            </Text>
          </View>
        )}
    </React.Fragment>
  );
};

SocietySnap.defaultProps = {
  onPress: () => {},
  onDoublePress: () => {},
  showExec: true,
  colors: {main: 'blue'},
  reduxSociety: {},
  showShadow: false,
  allowDoublePress: false,
  touchableProps: {},
  dontShowBookmark: false,
};
SocietySnap.propTypes = {
  onPress: PropTypes.func.isRequired,
  onDoublePress: PropTypes.func,
  showExec: PropTypes.bool,
  reduxSociety: PropTypes.object,
  showShadow: PropTypes.bool,
  allowDoublePress: PropTypes.bool,
  touchableProps: PropTypes.object,
  dontShowBookmark: PropTypes.bool,
};

const WIDTH = GlobalStyle.Measurements.width * 0.8;

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyle.Palettes.background.palette6,
    width: WIDTH,
    height: GlobalStyle.Measurements.unit * 7,
    borderRadius: GlobalStyle.Measurements.unit,

    shadowColor: '#aaa',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  backgroundImage: {
    width: WIDTH,
    height: GlobalStyle.Measurements.unit * 4,
    borderTopLeftRadius: GlobalStyle.Measurements.unit,
    borderTopRightRadius: GlobalStyle.Measurements.unit,
  },
  infoContainer: {
    height: GlobalStyle.Measurements.unit * 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: GlobalStyle.Measurements.marginHalf,
  },
  imageAndTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: WIDTH - GlobalStyle.Measurements.unit * 5,
  },
  textContainer: {
    flexDirection: 'column',
  },
  logo: {
    width: GlobalStyle.Measurements.unit * 2,
    height: GlobalStyle.Measurements.unit * 2,
    borderRadius: GlobalStyle.Measurements.unit,
    backgroundColor: GlobalStyle.ColorStyle.boneColor,
    marginHorizontal: GlobalStyle.Measurements.marginHalf,
    borderColor: '#e1e9ee',
    borderWidth: 0.5,
  },
  execView: {
    position: 'absolute',
    padding: GlobalStyle.Measurements.marginQuarter / 2,
    marginLeft: -5,
    borderRadius: 6.5,
    elevation: 5,
    zIndex: 5,
    minWidth: GlobalStyle.Measurements.width * 0.2,

    backgroundColor: GlobalStyle.Palettes.background.palette1,
  },
  execText: {
    ...GlobalStyle.TextStyle.buttonSmall,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});
