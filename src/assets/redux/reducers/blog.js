export function blogReducer(state = {}, action) {
  switch (action.type) {
    case 'FOCUS_BLOG': {
      state = {...state, ...action.payload};
      break;
    }
  }
  return state;
}
