export function editEventFocusReducer(state = {}, action) {
    switch (action.type) {
      case 'UPDATE_EDIT_EVENT_FOCUS': {
        state = {...state, ...action.payload};
        break;
      }
    }
    return state;
  }
  