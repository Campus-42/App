import {DateFuncs} from '../../../assets/Date';
import {db} from '../../../assets/Firebase/Firebase';
import {parseEventData} from '../../../assets/Firebase/functions';

export const EditEventFuncs = {
  getUpcomingEvents: async function (campusKey, societyID) {
    const lowerLimit = await DateFuncs.getFutureDateMSInMinutes(-60);
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('society_id', '==', societyID)
      .where('end_ms', '>=', lowerLimit)
      .where('confirmed', '==', true)
      .where('visible', '==', true)
      .get()
      .then((querySnapShot) => {
        const events = [];
        console.log(
          'Successfully fetched all upcoming events',
          querySnapShot.size,
        );
        querySnapShot.forEach(async (doc) =>
          events.push(await parseEventData(doc.data(), doc.id)),
        );
        return events;
      })
      .catch((err) => {
        console.warn('ERROR, Could not get upcoming events', err);
        throw err;
      });
  },
};
