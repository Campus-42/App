import {Points} from '../../Campus/constants/points';

export function appReducer(state = {}, action) {
  switch (action.type) {
    case 'CHANGE_DARK_MODE': {
      state = {...state, darkModeActive: action.payload};
      break;
    }
    case 'UPDATE_CAMPUS_INFO': {
      state = {...state, campus: action.payload};
      break;
    }
    case 'UPDATE_EVENT_PARTICIPATION_CHANGE': {
      console.log('UPDATE_EVENT_PARTICIPATION_CHANGE', action.payload);
      // state = {...state, eventParticipationChange: action.payload};
      break;
    }
    case 'UPDATE_INVITATION_IDS': {
      state = {...state, invitationIDs: action.payload};
      break;
    }
    case 'UPDATE_LOADING_STATUS_EVENT_FOCUS': {
      state = {...state, loadingEventFocus: action.payload};
      break;
    }
    case 'UPDATE_EVENTS': {
      state = {...state, events: action.payload};
      break;
    }
    case 'UPDATE_SOCIETIES': {
      state = {...state, societies: action.payload};
      break;
    }
    case 'UPDATE_UNREAD_BUBBLES': {
      state = {...state, unreadBubbles: action.payload};
      break;
    }
    case 'UPDATE_CAMPUS_POINT_SYSTEM': {
      const pointEvents = action.payload.point_events || [];
      pointEvents.forEach((event) => Points.setPointEvent(event));

      state = {...state, campus_point_system: action.payload};
      break;
    }
  }
  return state;
}
