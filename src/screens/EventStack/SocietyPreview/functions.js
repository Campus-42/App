import {auth, db, functions} from '../../../assets/Firebase/Firebase';
import {parseEventData} from '../../../assets/Firebase/functions';

export const SocietyPreviewFuncs = {
  getEvents: async function (
    campusKey,
    societyID,
    lastDoc = {end_ms: Date.now()},
    limit = 4,
  ) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('society_id', '==', societyID)
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('end_ms', '>=', Date.now())
      .orderBy('end_ms')
      .limit(limit)
      .startAfter(lastDoc.end_ms)
      .get()
      .then(async (querySnapShot) => {
        const events = [];
        querySnapShot.forEach(async (elem) =>
          events.push(await parseEventData(elem.data(), elem.id)),
        );
        return events;
      })
      .catch((err) => {
        throw err;
      });
  },
  leaveSociety: async function (campusKey, societyID) {
    /**
     * Create a ref to members data to be re-used
     * Then get all members
     * Directly after, update these members
     */

    const ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(societyID);

    const first = await ref.get().then(async (doc) => {
      return ref
        .update({
          members: doc
            .data()
            .members.filter((elem) => elem !== auth.currentUser.uid),
        })
        .then(() => {
          return {error: false};
        })
        .catch((err) => {
          return {error: err};
        });
    });
    if (first.error !== false) throw first.error;
    else {
      const fetch = await ref
        .collection('data')
        .doc('members')
        .get()
        .then((doc) => {
          return {error: false, members: doc.data().members_data};
        })
        .catch((err) => {
          return {error: err};
        });

      if (fetch.error !== false) {
        throw fetch.error;
      } else {
        const newMembers = fetch.members.filter(
          (elem) => elem.uid !== auth.currentUser.uid,
        );
        return ref
          .collection('data')
          .doc('members')
          .update({members_data: newMembers})
          .then(async () => {
            return functions
              .httpsCallable('onMemberLeftSociety')({
                campus_key: campusKey,
                society_id: societyID,
                uid: auth.currentUser.uid,
              })
              .then((res) => {
                console.log('HTTPS CALLABLE (onMemberLeftSociety)', res);
                return res;
              })
              .catch((err) => {
                console.warn('HTTPS CALLABLE (onMemberLeftSociety)', err);
                throw err;
              });
          })
          .catch((err) => {
            throw err;
          });
      }
    }
  },
  joinSociety: async function (campusKey, societyID, user) {
    /**
     * Create a ref to members data to be re-used
     * Then get all members
     * Directly after, update these members
     */
    const ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(societyID)
      .collection('data')
      .doc('members');

    const fetch = await ref
      .get()
      .then((doc) => {
        return {error: false, members: doc.data().members_data};
      })
      .catch((err) => {
        return {error: err};
      });

    if (fetch.error !== false) {
      throw fetch.error;
    } else {
      const newMembers = fetch.members.concat([
        {
          email: auth.currentUser.email,
          uid: auth.currentUser.uid,
          first_name: user.first_name,
          last_name: user.last_name,
          joined: new Date(),
        },
      ]);
    }
  },
  getSociety: async function (campusKey, societyID) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .doc(societyID)
      .get()
      .then((doc) => {
        return {...doc.data(), id: doc.id};
      })
      .catch((err) => {
        throw err;
      });
  },
};
