import {analytics} from '../../Analytics';
import {db} from '../../Firebase/Firebase';
import {parseSocietyData, parseUserData} from '../../Firebase/functions';

export const adminFuncs = {
  fetchSubmittedSocieties: async function (campusKey) {
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection('societies')
      .where('confirmed', '==', false)
      .where('visible', '==', false)
      .get()
      .then(async (querySnapShot) => {
        const societies = [];
        return new Promise((resolve, reject) =>
          querySnapShot.forEach(async (doc, index) => {
            societies.push(await parseSocietyData(doc.data(), doc.id));
            if (index == querySnapShot.size - 1) resolve(societies);
          }),
        ).catch((err) => {
          analytics.error(err, 'adminFuncs', 'fetchSubmittedSocieties');
          throw err;
        });
      });
  },
  fetchPendingReportedUsers: async function (campusKey) {
    return db
      .collection('users')
      .where('pending_reported_behaviour', '==', true)
      .where('campus', '==', campusKey)
      .get()
      .then(async (querySnapShot) => {
        const societies = [];
        return new Promise((resolve, reject) =>
          querySnapShot.forEach(async (doc, index) => {
            societies.push(await parseUserData(doc.data(), doc.id));
            if (index == querySnapShot.size - 1) resolve(societies);
          }),
        ).catch((err) => {
          analytics.error(err, 'adminFuncs', 'fetchPendingReportedUsers');
          throw err;
        });
      });
  },
};
