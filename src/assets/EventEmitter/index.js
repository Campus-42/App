import Emitter from 'eventemitter3';

export const inAppBadgeEmitter = new Emitter();
 /**
  * Allowed types:
  * in-app-badge-change (the notifications that the app has received)
  * */