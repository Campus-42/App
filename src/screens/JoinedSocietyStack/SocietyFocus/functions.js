import {DateFuncs} from '../../../assets/Date';
import {db} from '../../../assets/Firebase/Firebase';
import {parseEventData, parseBlog} from '../../../assets/Firebase/functions';

export const JoinedSocietyFuncs = {
  getEvents: async function (
    campusKey,
    societyID,
    lastDoc = {end_ms: Date.now()},
  ) {
    const lowerLimit = await DateFuncs.getFutureDateMSInMinutes(-60);
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .where('visible', '==', true)
      .where('confirmed', '==', true)
      .where('society_id', '==', societyID)
      .where('end_ms', '>=', lowerLimit)
      .orderBy('end_ms')
      .limit(4)
      .startAfter(lastDoc.end_ms)
      .get()
      .then((querySnapShot) => {
        console.log(
          'Successfully fetched',
          querySnapShot.size,
          'society events',
        );
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
  getBlogs: async function (campusKey, societyID) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('blogs')
      .where('society_id', '==', societyID)
      .where('confirmed', '==', true)
      .where('visible', '==', true)
      .get()
      .then((querySnapShot) => {
        const blogs = [];
        querySnapShot.forEach(async (elem) =>
          blogs.push(await parseBlog(elem.data(), elem.id)),
        );
        return blogs;
      })
      .catch((err) => {
        throw err;
      });
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
