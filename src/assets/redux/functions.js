import {auth} from '../Firebase/Firebase';
import {Store} from './store';

export function updateReduxEvents(rawEvents = [], reduxEvents = {}) {
  /**
   * To update the redux events we will go through the new events and add neccessary info to the new object of redux events
   */

  rawEvents.forEach((evt) => {
    reduxEvents[evt.id] = {
      number_of_participants: evt.number_of_participants,
      joined: evt.participants.includes(auth.currentUser.uid),
      id: evt.id,
    };
  }),
    Store.dispatch({type: 'UPDATE_EVENTS', payload: reduxEvents});
}

export function updateReduxSocieties(rawSocieties = [], reduxSocieties = {}) {
  /**
   * To update redux societies to show updated member info
   */
  rawSocieties.forEach((soc) => {
    reduxSocieties[soc.id] = {
      members: soc.members,
      joined: soc.members.includes(auth.currentUser.uid),
      id: soc.id,
    };
  });
  Store.dispatch({type: 'UPDATE_SOCIETIES', payload: reduxSocieties});
}
