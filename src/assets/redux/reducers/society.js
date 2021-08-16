export function societyReducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_SOCIETY_FOCUS_MANAGE': {
      state = {...state, manageSocietyFocus: action.payload};
      break;
    }
    case 'UPDATE_SOCIETY_FOCUS': {
      state = {
        ...state,
        societyFocus: {...state.societyFocus, ...action.payload},
      };
      break;
    }
    case 'UPDATE_TICKET_SCANNER_EVENT': {
      state = {...state, ticketScanEventID: action.payload};
      break;
    }
  }

  return state;
}
