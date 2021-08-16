import {analytics} from '../../Analytics';

export function navigationReducer(state = {}, action) {
  switch (action.type) {
    case 'NAVIGATION_CHANGE': {
      analytics.screen(action.payload);
      state = action.payload;
      break;
    }
  }
  return state;
}
