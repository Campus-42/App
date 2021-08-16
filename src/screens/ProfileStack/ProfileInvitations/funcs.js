import {db, auth} from '../../../assets/Firebase/Firebase';
import {parseEventData} from '../../../assets/Firebase/functions';

export const NotificationFuncs = {
  getInvitationObject: async function (campusKey, id, type) {
    const path =
      type == 'event' ? 'events' : type == 'society' ? 'societies' : 'empty';
    console.log(path, campusKey, id, type);
    return db
      .collection('campuses')
      .doc(campusKey)
      .collection(path)
      .doc(id)
      .get()
      .then(async (doc) => {
        if (type == 'event') return await parseEventData(doc.data(), doc.id);
        else if (type == 'society') return {...doc.data(), id: doc.id};
        else
          throw {
            msg: `Passed type was ${type}, it must be either "event" or "society"`,
          };
      })
      .catch((err) => {
        throw err;
      });
  },
};
