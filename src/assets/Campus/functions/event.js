import {auth, db, functions} from '../../Firebase/Firebase';
import {parseEventData} from '../../Firebase/functions';
import {analytics} from '../../Analytics/index';

export const eventFuncs = {
  searchEvents: async function (campusKey = '', searchTerm = ' ', limit = 5) {
    const searchArray = searchTerm.toLowerCase().split(' ');

    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('search_index', 'array-contains-any', searchArray.slice(0, 10))
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .limit(limit)
      .get()
      .then((querySnapshot) => {
        const events = [];

        querySnapshot.forEach(async (doc) =>
          events.push(await parseEventData(doc.data(), doc.id)),
        );

        return events;
      })
      .catch((err) => {
        throw err;
      });
  },
  getBookmarked: async function (campusKey, ids, start) {
    const events = [];
    var error = false;
    const length = ids.length;
    const index = length - 1 - start;

    await Promise.all(
      ids.slice(start, start + 5).map(async (id) => {
        return db
          .collection('campuses')
          .doc(campusKey)
          .collection('events')
          .doc(id)
          .get()
          .then(async (doc) =>
            events.push(await parseEventData(doc.data(), doc.id)),
          )
          .catch((err) => {
            error = true;
            analytics.error(err);
          });
      }),
    );

    return {events: events, error: error};
  },
  updateParticipationStatus: async function (
    campusKey = '',
    eventId = '',
    isJoining = false,
  ) {
    return functions
      .httpsCallable('handleEventParticipationChange')({
        campusKey,
        eventId,
        isJoining,
        user: (auth.currentUser || {}).uid,
      })
      .then(({data}) => {
        console.log('Event participation status', data);
        if (!data.successful)
          throw new Error('Unsuccessful participation status');
        return data;
      })
      .catch((err) => {
        analytics.error(err, 'CampusFuncs', 'updateParticipationStatus');
        throw err;
      });
  },
};
