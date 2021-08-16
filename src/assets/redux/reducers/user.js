import {AsyncStorage} from '../../AsyncStorage/functions';

export function userReducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_INITIAL_POSITION': {
      state = {...state, initialPosition: action.payload};
      break;
    }
    case 'UPDATE_USER_INFO': {
      console.log("User was updated!")
      const user = action.payload;
      state = {...state, ...user};
      AsyncStorage.setFullName(user.first_name, user.last_name);
      break;
    }
    case 'UPDATE_PERMISSIONS': {
      state = {...state, permissions: action.payload};
      break;
    }
    case 'UPDATE_BOOKMARKS': {
      state = {...state, bookmarks: action.payload};
    }
  }
  return state;
}
