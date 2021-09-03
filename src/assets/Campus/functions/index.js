import {eventFuncs} from './event';
import {otherFuncs} from './other';
import {serverFuncs} from './server';
import {societyFuncs} from './society';
import {imageFuncs} from './images';
import {bubbleFuncs} from './bubble';
import {inviteFuncs} from './invites';
import {userFuncs} from './user';
import {notificationFuncs} from './notifications';
import {blogFuncs} from './blog';
import {pointFuncs} from './points';
import {adminFuncs} from './admin';
import {announcementFuncs} from './announcements';
import {referralFuncs} from './referral';

export const CampusFuncs = {
  society: societyFuncs,
  event: eventFuncs,
  announcement: announcementFuncs,
  server: serverFuncs,
  images: imageFuncs,
  other: otherFuncs,
  bubble: bubbleFuncs,
  invite: inviteFuncs,
  user: userFuncs,
  blog: blogFuncs,
  notifications: notificationFuncs,
  points: pointFuncs,
  admin: adminFuncs,
  referral: referralFuncs,
};
