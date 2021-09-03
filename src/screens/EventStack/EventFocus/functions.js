import {db, auth} from '../../../assets/Firebase/Firebase';
import {Store} from '../../../assets/redux/store';
import {AsyncStorage} from '../../../assets/AsyncStorage/functions';
import {parseEventData} from '../../../assets/Firebase/functions';
import {Campus} from '../../../assets/Campus';

export const EventFuncs = {
  fetchEvent: async function (campusKey, eventID) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(eventID)
      .get()
      .then(async (doc) => {
        return parseEventData(doc.data(), doc.id);
      })
      .catch((err) => {
        throw err;
      });
  },
  updateEventParticipants: async function (
    campus = String,
    eventID = String,
    participants = Array,
    type,
    user,
  ) {
    const ref = db
      .collection('campuses')
      .doc(campus)
      .collection('events')
      .doc(eventID);

    const participantRef = ref
      .collection('participants')
      .doc(auth.currentUser !== null ? auth.currentUser.uid : 'empty');

    var check = null;

    if (type == 'joined') {
      check = await participantRef
        .set({
          first_name: user.first_name,
          last_name: user.last_name,
          claimed: false,
          email: auth.currentUser.email,
          joined: new Date(),
          joined_ms: new Date().getTime(),
        })
        .then(() => {
          console.log('Set participation doc');
          return true;
        })
        .catch((err) => {
          console.warn('Could not set user doc at event', err);
          throw err;
        });
    } else {
      check = await participantRef
        .delete()
        .then(() => {
          console.log('Deleted participation doc');

          return true;
        })
        .catch((err) => {
          console.warn('Could not delete user doc at event', err);
          return false;
        });
    }

    if (check == true)
      return ref
        .update({
          participants: participants,
          number_of_participants: participants.length,
        })
        .then(() => {
          console.log("Successfully updated event's participants");
          return type == 'joined' ? true : false;
        })
        .catch((err) => {
          console.warn('Could not update participants for event', err);
          throw err;
        });
    else throw {msg: 'Could not update event participants'};
  },
  claimInvitation: async function (campusKey, users, points, invitationID) {
    const inviteRef = db
      .collection('campuses')
      .doc(campusKey)
      .collection('invites')
      .doc(invitationID);

    const claimed = await inviteRef
      .get()
      .then((doc) => {
        Store.dispatch({
          type: 'UPDATE_USER_INFO',
          payload: {...doc.data(), id: doc.id},
        });
        if (doc.data().claimed == false)
          return inviteRef
            .update({claimed: true})
            .then(() => {
              return true;
            })
            .catch((err) => {
              throw err;
            });
      })
      .catch((err) => {
        console.warn('Could not claim invite');
        return false;
      });

    if (claimed) {
      users = new Set(users);
      users.forEach(async (user) => {
        const userRef = db.collection('users').doc(user);

        userRef
          .get()
          .then((user) =>
            userRef
              .update({points: user.data().points + points})
              .then(() =>
                Campus.Funcs.points.triggerPointEvent('appLogin', campusKey),
              )
              .catch((err) => {
                throw err;
              }),
          )
          .catch((err) => console.warn('Could not update points', err));
      });
    }
  },
};
