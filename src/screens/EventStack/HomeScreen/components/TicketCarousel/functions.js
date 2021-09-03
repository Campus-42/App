import {auth} from '../../../../../assets/Firebase/Firebase';

export const TicketFuncs = {
  generateCode: function (eventID = Object) {
    const str = `event=${eventID}&uid=${
      auth.currentUser !== null ? auth.currentUser.uid : 'empty'
    }`;
    return str;
  },
};
