import {AsyncStorage} from '../../AsyncStorage/functions';

export const notificationFuncs = {
  onNotification: function (msg, push, showPopup, reduxNavigation) {
    console.log('Notification received in foreground', msg);
    const type = msg.data.type || false;

    if (type) {
      AsyncStorage.onNotification(msg);

      const objId =
        type == 'message'
          ? msg.data.bubble || msg.data.obj_id
          : msg.data.obj_id || msg.data.bubble;

      const userIsAlreadyAtScreen =
        reduxNavigation.name == msg.data.in_app_screen;
      const screenPropsAreEqual = (reduxNavigation.params || {}).id == objId;

      if (type == 'message' || type == 'bubbles') {
        // PLay the notification sound

        if (
          !(
            (userIsAlreadyAtScreen && screenPropsAreEqual) ||
            reduxNavigation.name === 'Bubbles'
          ) // Don't show toast when user sees all of the bubbles in front of them
        )
          showPopup({
            active: true,
            level: 'message',
            type: 'toast',
            title: msg.notification.title,
            text: msg.notification.body,
            user: msg.data.user && JSON.parse(msg.data.user),
            timestamp: Date.now(),
            onPress: () => push('Bubble Focus', {id: msg.data.bubble}),
          });
        else
          console.log(
            'User is already at desired screen with the same object id',
          );
      } else if (type == 'event' || type == 'society')
        if (!(userIsAlreadyAtScreen && screenPropsAreEqual)) {
          showPopup({
            active: true,
            level: 'message',
            type: 'toast',
            title: msg.notification.title,
            text: msg.notification.body,
            timestamp: Date.now(),
            onPress: () => push(msg.data.in_app_screen, {id: msg.data.obj_id}),
          });
        }
    } else console.log('No data type was passed with the notification');
  },
  onBackground: function (msg) {
    console.log('Message received in background', msg);
    const type = msg.data.type || false;
    const objId =
      type == 'message'
        ? msg.data.bubble || msg.data.obj_id
        : msg.data.obj_id || msg.data.bubble;

    if (type && objId) {
      AsyncStorage.onNotification(msg);
    }
  },
  onNotificationOpenedApp: function (msg, navigation) {
    console.log('Notification opened app, handling it', msg);
    if (msg.data || false) {
      const data = msg.data;
      const type = msg.data.type || false;

      const screen = data.in_app_screen || false;
      const objId = type == 'message' ? data.bubble : data.obj_id || false;
      if (screen && objId) navigation.push(screen, {id: objId});
    }
  },
  setActiveType: function (type, objId) {
    /**
     * Set the active type that the user is at.
     * e.g., if the user is at the Bubble 'abcde', then the app
     * will not save notifications that match type = "bubbles"
     * and obj_id = "abcde"
     */
    console.log('Setting active notification type to', {type, objId});
    AsyncStorage._setActiveNotificationType(type, objId);
  },
};
