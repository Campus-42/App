import React from 'react';
import {Text, Platform, Dimensions} from 'react-native';
import {styles} from '../style';
import * as Animatable from 'react-native-animatable';
import {db, auth, functions} from '../../../../assets/Firebase/Firebase';
import TouchableShrink from '../../../../assets/TouchableShrink/TouchableShrink';
import {EventFuncs} from '../functions';
import {parseEventData} from '../../../../assets/Firebase/functions';
import {Store} from '../../../../assets/redux/store';
import {GlobalStyle} from '../../../../assets/GlobalStyle';
import {analytics} from '../../../../assets/Analytics';

export class FloatingButtons extends React.Component {
  render() {
    return (
      <Animatable.View
        style={[
          styles.floatingButtonsContainer,
          {
            marginTop:
              this.props.modal && Platform.OS == 'ios'
                ? styles.floatingButtonsContainer.marginTop -
                  GlobalStyle.Measurements.height * 0.08
                : styles.floatingButtonsContainer.marginTop,
          },
        ]}
        useNativeDriver={true}
        animation={'fadeInUp'}
        duration={350}>
        <TouchableShrink
          showGradient
          disabled={this.props.disabled}
          showShadow
          showIcon
          icon="user-plus"
          iconSize={Dimensions.get('screen').fontScale * 13}
          shadowColor={this.props.colors.main}
          gradientColor={this.props.colors.main}
          onPress={this.props.openInviteView}
          style={[styles.floatingButton, styles.inviteButton]}>
          <Text style={styles.floatingButtonText}>Invite</Text>
        </TouchableShrink>

        <TouchableShrink
          showGradient
          disabled={this.props.disabled}
          showShadow
          showIcon
          gradientFactor={100}
          icon={
            this.props.event.participants.includes(auth.currentUser.uid)
              ? 'times'
              : 'plus'
          }
          shadowColor={this.props.colors.main}
          gradientColor={
            this.props.event.participants.includes(auth.currentUser.uid)
              ? '#ff0800'
              : '#20d00b'
          }
          onPress={this.joinEvent}
          style={[styles.floatingButton, styles.joinButton]}>
          <Text style={styles.floatingButtonText}>
            {this.props.event.participants.includes(auth.currentUser.uid)
              ? 'Leave Event'
              : 'Join Event'}
          </Text>
        </TouchableShrink>
      </Animatable.View>
    );
  }
  joinEvent = async () => {
    this.props.showLoading(undefined);
    this.props.updateAskConfirmation(false);

    setTimeout(async () => {
      // This function will get the participants for this event and update it with the user id for current user. Then it will update the state so it's visible that user has joined
      const event = await getEvent(this.props.campusKey, this.props.event.id);
      if (event !== false) {
        var participants = event.participants;

        var type = participants.includes(auth.currentUser.uid)
          ? 'left'
          : 'joined'; // This variable lets the confirmation in the <EventFocus /> what confirmation to show


        if (
          event.join_link !== undefined &&
          event.join_link.show &&
          type == 'joined' &&
          !this.props.confirmed
        ) {
          this.props.navigation.navigate('Web View', {
            url: this.props.event.join_link.url,
          });
          setTimeout(() => this.props.updateAskConfirmation(true), 500); // Update ask confirmation when we know for sure that they will leave
        } else {
          this.props.showLoading(type);
          // Error check IMPORTANT
          // If error slips it can ruin an entire event
          if (
            participants.includes(
              auth.currentUser !== null ? auth.currentUser.uid : 'empty',
            )
          ) {
            participants = [
              ...new Set(
                participants.filter((e) => {
                  return (
                    e !==
                    (auth.currentUser !== null ? auth.currentUser.uid : 'empty')
                  );
                }),
              ),
            ];
          } else {
            participants.push(
              auth.currentUser !== null ? auth.currentUser.uid : 'empty',
            );
          }
          event.participants = participants;
          event.number_of_participants = participants.length;

          this.props.updateEvent(event);

          EventFuncs.updateEventParticipants(
            this.props.campusKey,
            this.props.event.id,
            participants,
            type,
            this.props.user,
          )
            .then((hasJoined) => {
              if (hasJoined)
                analytics.joinedEvent(event.id, this.props.campusKey);
              else analytics.leftEvent(event.id, this.props.campusKey);

              this.setState({hasJoined: hasJoined});
              if (this.props.invitation)
                EventFuncs.claimInvitation(
                  this.props.campusKey,
                  this.props.invitation.users,
                  this.props.invitation.points,
                  this.props.invitation.id,
                ).then(() => {
                  Store.dispatch({
                    type: 'UPDATE_INVITATION_IDS',
                    payload: this.props.invitationIDs.filter(
                      (elem) => elem != this.props.invitation.id,
                    ),
                  });
                });

              this.props.showConfirmation(type, false);
            })
            .catch((err) => {
              console.warn('Could not update event participation', err);
              this.props.showConfirmation(type, true);
            });
        }
      } else this.props.showConfirmation(type, true);
    }, 500);
  };
}

async function getEvent(campus = String, eventID = String) {
  return db
    .collection('campuses')
    .doc(campus)
    .collection('events')
    .doc(eventID)
    .get()
    .then(async (doc) => {
      return await parseEventData(doc.data(), doc.id);
    })
    .catch((err) => {
      console.warn('Could not get participants to join event', err);
      return false;
    });
}
