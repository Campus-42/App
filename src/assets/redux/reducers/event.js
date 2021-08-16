export function eventReducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_EVENT_FOCUS': {
      state = {...state, ...action.payload};
      break;
    }
  }
  return state;
}
