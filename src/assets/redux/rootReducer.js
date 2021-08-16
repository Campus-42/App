import {combineReducers} from 'redux';
import {userReducer} from './reducers/user';
import {appReducer} from './reducers/app';
import {eventReducer} from './reducers/event';
import {societyReducer} from './reducers/society';
import {editEventFocusReducer} from './reducers/editEventFocus';
import {blogReducer} from './reducers/blog';
import {navigationReducer} from './reducers/navigationReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  app: appReducer,
  event: eventReducer,
  editEventFocus: editEventFocusReducer,
  society: societyReducer,
  blog: blogReducer,
  navigation: navigationReducer,
});
