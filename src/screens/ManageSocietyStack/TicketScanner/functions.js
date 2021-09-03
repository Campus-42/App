import {db} from '../../../assets/Firebase/Firebase';

export const TicketFuncs = {
  claimTicket: async function (
    campusKey = 'nothing',
    eventIDFocus = 'nothing',
    eventIDCode = 'nothing',
    uid = 'nothing',
  ) {
    const ref = db
      .collection('campuses')
      .doc(campusKey)
      .collection('events')
      .doc(eventIDFocus)
      .collection('participants')
      .doc(uid);

    return ref
      .get()
      .then((doc) => {
        if (eventIDFocus !== eventIDCode) {
          if (eventIDCode == 'nothing') throw {msg: 'Invalid Ticket'};
          else throw {msg: 'Another Event'};
        } else if (doc.data().claimed == false) {
          ref.update({claimed: true}).catch(() => {
            throw {msg: 'Invalid Ticket'};
          });
          return 'Claimed Ticket';
        } else {
          throw {msg: 'Already Claimed'};
        }
      })
      .catch((err) => {
        if (err.msg != undefined) throw err.msg;
        else throw {msg: 'Invalid Ticket'};
      });
  },
  extractCode: async function (code) {
    try {
      const res = {
        uid: '',
        event: '',
      };
      const params = code.split('&');
      params.forEach((elem) => {
        const split = elem.split('=');
        const name = split[0];
        res[name] = split[1];
      });

      return res;
    } catch {
      return {
        uid: '',
        event: '',
      };
    }
  },
};
