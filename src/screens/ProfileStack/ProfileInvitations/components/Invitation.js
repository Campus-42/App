import React from 'react';
import {View, Image, Text, Alert} from 'react-native';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import * as Animatable from 'react-native-animatable';
import {styles, STAR_SIZE, STAR_COLOR} from '../style';
import PropTypes from 'prop-types';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Time} from '../../../EventStack/HomeScreen/components/EventCarousel/Time';
import {NotificationFuncs} from '../funcs';
import {Store} from '../../../../assets/redux/store';
import {DateFuncs} from '../../../../assets/Date';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {getMemberNames} from '../../../Bubbles/Bubbles/components/MessageRow';

export function Invitation(props) {
  async function handlePress() {
    const inviteParams = {
      invitation: {
        id: props.invite.invite.id,
        points: props.invite.invite.points,
        users: props.invite.invite.search_index,
      },
    };
    const type = props.invite.invite.type;

    const screen =
      type == 'event'
        ? 'Event Focus'
        : type == 'society'
        ? 'Society Preview'
        : type == 'bubble'
        ? 'Bubble Focus'
        : undefined;

    if (screen == undefined)
      Alert.alert(
        'Invitation',
        "Something went wrong, we couldn't find the invitation",
      );
    else {
      props.navigation.navigate(screen, {
        ...inviteParams,
        id: props.invite.obj.id,
      });
    }
  }

  const obj = props.invite.obj;
  const invite = props.invite.invite;
  const type = invite.type;
  const timeString =
    type == 'event' && DateFuncs.getTimeInterval(obj.date.start, obj.date.end);

  const name =
    obj.name ||
    obj.title ||
    (type == 'bubble' ? getMemberNames(obj.member_names || []) : '');
  const image =
    obj.image || (obj.images || {}).logo || (obj.images || {}).preview || false;
  const text = getText(obj, type);

  return (
    <Animatable.View
      duration={450}
      // delay={250 + 50 * props.index}
      animation={props.animateIn ? 'fadeInUpBig' : null}>
      <TouchableShrink
        disabled={props.claimed}
        onPress={handlePress}
        showShadow
        shadowOpacity={0.05}
        style={styles.buttonContainer}>
        {image && (
          <Image
            source={{uri: image}}
            style={[styles.image, type !== 'event' && {borderRadius: 100}]}
          />
        )}
        <View style={styles.infoContainer}>
          <Text
            style={styles.invitationTitle}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {name}
          </Text>
          <Text
            style={styles.invitationText}
            numberOfLines={2}
            ellipsizeMode={'tail'}>
            {invite.sender_name} {text}
          </Text>
          {type == 'event' && (
            <Text
              style={[
                styles.invitationText,
                {fontSize: GlobalStyle.TextStyle.bodySmall.fontSize},
              ]}>
              {timeString}
            </Text>
          )}
          {type == 'society' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Ionicon
                name="ios-people"
                size={GlobalStyle.Measurements.unit / 1.3}
                color={GlobalStyle.Palettes.text.palette6}
                style={{marginRight: GlobalStyle.Measurements.marginQuarter}}
              />
              <Text style={styles.invitationText}>{invite.members}</Text>
            </View>
          )}
        </View>
      </TouchableShrink>
      {type == 'event' && <Time date={obj.date.start}colors={props.colors} />}
      {(props.claimed || invite.claimed) && (
        <View style={styles.claimContainer}>
          <Text style={[GlobalStyle.TextStyle.bodyRegular, {color: '#fff'}]}>
            Claimed
          </Text>
        </View>
      )}
    </Animatable.View>
  );
}
const getText = (obj, type) => {
  if (type == 'event') return 'invited you to an event';
  else if (type == 'society') return 'invited you to a society';
  else if (type == 'bubble') return 'invited you to a bubble, click to accept';
};

Invitation.defaultProps = {
  animateIn: false,
  invite: {},
  campusKey: '',
  participants: [],
};
Invitation.propTypes = {
  animateIn: PropTypes.bool,
  invite: PropTypes.object.isRequired,
  campusKey: PropTypes.string.isRequired,
  participants: PropTypes.array,
};
