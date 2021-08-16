import {db, auth} from '../../../assets/Firebase/Firebase';
import {parseBlog, parseEventData} from '../../../assets/Firebase/functions';
import {Alert} from 'react-native';
import {DateFuncs} from '../../../assets/Date';
import {triggerHaptic} from '../../../assets/Haptic/hapticFeedback';

export const ManageFuncs = {
  getAdminSocieties: async function (campusKey = String) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('exec_members', 'array-contains', auth.currentUser.uid)
      .orderBy('number_of_members', 'desc')
      .get()
      .then((querySnapShot) => {
        const societies = [];
        querySnapShot.forEach((doc) =>
          societies.push({...doc.data(), id: doc.id}),
        );
        return {
          societies: societies,
          isAdmin: querySnapShot.size > 0,
          societyIDs: societies.map((society) => society.id),
          error: false,
        };
      })
      .catch((err) => {
        console.warn('Could not get potential societies', err);
        return {societies: [], isAdmin: false, error: true};
      });
  },
  getEventConfirmations: async function (campusKey = '') {
    // Get all events
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('confirmed', '==', false)
      .where(
        'president',
        '==',
        auth.currentUser !== null ? auth.currentUser.uid : 'empty',
      )
      .get()
      .then((querySnapShot) => {
        const events = [];
        querySnapShot.forEach(async (doc) =>
          events.push({
            ...(await parseEventData(doc.data(), doc.id)),
            confirmation_type: 'events',
          }),
        );
        return events;
      })
      .catch((err) => {
        console.warn('Could not get potential confirmations', err);
        throw err;
      });
  },
  getBlogConfirmations: async function (campusKey = '') {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .where('confirmed', '==', false)
      .where('president', '==', auth.currentUser.uid)
      .get()
      .then((querySnapShot) => {
        const blogs = [];
        querySnapShot.forEach(async (doc) =>
          Promise.all(
            blogs.push({
              ...(await parseBlog(doc.data(), doc.id)),
              confirmation_type: 'blogs',
            }),
          ),
        );
        return blogs;
      })
      .catch((err) => {
        console.warn('Could not get potential confirmations', err);
        throw err;
      });
  },
  confirmOrDenyEvent: async function (
    action = 'confirm' || 'deny' || 'delete',
    campusKey = String,
    confirmationType = String,
    eventID = String,
    removeEvent = Function,
    edit_log = Array,
  ) {
    const editLog = {
      edit_log: (edit_log || []).concat({
        action: 'confirmed',
        uid: auth.currentUser != null ? auth.currentUser.uid : 'empty',
        date: new Date(),
      }),
    };
    const type = confirmationType == 'events' ? 'event' : 'blog';
    const ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection(confirmationType)
      .doc(eventID);

    if (action == 'confirm') {
      return ref
        .update({...editLog, confirmed: true, deleted: false})
        .then(() => {
          triggerHaptic('notificationSuccess');
          removeEvent(eventID);
        })
        .catch((err) => {
          console.warn(`Could not confirm ${type}`, err);
          triggerHaptic('notificationError');
          Alert.alert(
            'Error',
            `We could not confirm your ${type}, please try again later.\nYour ${type} won't be visible`,
          );
        });
    } else if (action == 'deny' || action == 'delete') {
      // Ask user for confirmation
      Alert.alert(
        'Confirmation',
        `You are about to delete a${
          type == 'event' ? 'n' : ''
        } ${type}\nAre you sure you want to delete the ${type}?`,
        [
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              ref
                .update({
                  ...editLog,
                  confirmed: 'deleted',
                  deleted: true,
                })
                .then(() => {
                  triggerHaptic('notificationSuccess');
                  removeEvent(eventID);
                })
                .catch((err) => {
                  console.warn(`Could not delete ${type}`, err);
                  triggerHaptic('notificationError');
                  Alert.alert(
                    'Error',
                    `We could not deny your ${type}, please try again later.\nYour ${type} won't be visible`,
                  );
                });
            },
          },
          {
            text: 'Cancel',
          },
        ],
      );
    }
  },
  getEventsHappeningSoon: async function (campusKey = String, adminSocieties) {
    const upperLimit = await DateFuncs.getFutureDateMSInMinutes(30);
    const startLower = await DateFuncs.getFutureDateMSInMinutes(-300);
    const endLimit = await DateFuncs.getFutureDateMSInMinutes(-60);

    const societies = await db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where('exec_members', 'array-contains', auth.currentUser.uid)
      .where('visible', '==', true)
      .where('confirmed', '==', true)

      .get()
      .then((querySnapShot) => {
        const societies = [];
        querySnapShot.forEach((doc) => societies.push(doc.id));
        return {error: false, societies: societies};
      })
      .catch((err) => {
        return {error: err};
      });

    if (societies.error !== false) throw societies.error;
    else if (societies.societies.length == 0) return [];
    else
      return db
        .collection('campuses')
        .doc(campusKey)
        .collection('events')
        .where('start_ms', '<', upperLimit)
        .where('start_ms', '>', startLower)
        .where('visible', '==', true)
        .where('confirmed', '==', true)
        .where('society_id', 'in', societies.societies)
        .orderBy('start_ms')
        .get()
        .then(async (querySnapshot) => {
          const events = [];

          querySnapshot.forEach(async (doc) => {
            if (doc.data().end_ms > endLimit)
              events.push(await parseEventData(doc.data(), doc.id));
          });
          return events;
        })
        .catch((err) => {
          throw err;
        });
  },
  getEditor: async function (uid) {
    return db
      .collection('users')
      .doc(uid)
      .get()
      .then((doc) => {
        const first = doc.data().first_name;
        const last = doc.data().last_name;
        return `${first} ${last}`;
      })
      .catch((err) => {
        console.warn('Could not get editor', err);
        return 'Could not get editor';
      });
  },
};
